import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as d3 from 'd3';
import {
  Maximize2,
  Minimize2,
  RotateCcw,
  Sun,
  Moon,
  Sunset,
  Compass,
  Play,
  Pause,
  Layers,
  MapPin,
  Shield,
  Users,
  LifeBuoy,
  HeartHandshake,
  Headphones,
  Footprints,
  Eye,
  Crosshair,
  Sparkles,
  Camera,
  Activity,
  AlertTriangle,
  Radio,
  Move,
  CheckCircle2,
} from 'lucide-react';
import { buildTempleCampus } from './TempleArchitecture3DBuilder';
import {
  buildOfficer3DModel,
  buildHolographicDeployGhost,
  getOfficerDepartment,
  DEPARTMENT_CONFIGS,
} from './Officer3DModelBuilder';

/**
 * TempleCampus3DScene:
 * Master WebGL 3D Architectural Digital Twin & Security Deployment System
 * for Mata Tripura Sundari Temple (Matabari, Udaipur, Tripura).
 *
 * Core Capabilities:
 * 1. Authentic 3D Kurma-pitha tortoise mound, Bengali Char-Chala terracotta sanctum,
 *    Natmandir hall, Parikrama colonnade, and sunken Kalyan Sagar lake with swimming softshell turtles.
 * 2. 3D Humanoid Officer Avatars with department uniforms, patrol halos & tactical FOV cones.
 * 3. Interactive Holographic Ghost cursor for click-to-deploy and repositioning anywhere on campus.
 * 4. Cinematic Camera Presets (Campus Overview, Sanctum Close-up, Kalyan Sagar, West Gopuram, Annadanam).
 * 5. Multi-atmosphere lighting (Daylight Sun, Aarti Sunset Golden Hour, Night Surveillance Floodlights).
 * 6. Live Tactical Security Coverage Heatmap overlay.
 */
export default function TempleCampus3DScene({
  staff = [],
  sectors = [],
  selectedStaffId = null,
  isPlacingPin = false,
  isRepositioningId = null,
  showLabels = true,
  showSectors = true,
  departmentFilter = 'ALL',
  shiftFilter = 'ALL',
  onSelectStaff,
  onCanvasDeployClick,
  onHoverStaff,
  activePresetZone = null,
  viewMode = 'isometric', // 'isometric' | 'night' | 'sunset'
  onChangeViewMode,
}) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  // Groups and dynamic object references
  const officersGroupRef = useRef(new THREE.Group());
  const heatmapGroupRef = useRef(new THREE.Group());
  const ghostCursorRef = useRef(null);
  const animRefs = useRef({ turtles: [], flagMesh: null, lakeWaterMesh: null, sanctumInnerLight: null });
  const lightsRef = useRef({ sunLight: null, ambientLight: null, hemisphereLight: null });

  // UI state
  const [atmosphere, setAtmosphere] = useState(viewMode === 'night' ? 'night' : 'day'); // 'day' | 'sunset' | 'night'
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [hoveredOfficer, setHoveredOfficer] = useState(null);
  const [hoveredScreenPos, setHoveredScreenPos] = useState({ x: 0, y: 0 });
  const [targetTerrainInfo, setTargetTerrainInfo] = useState(null);
  const [cameraPreset, setCameraPreset] = useState('overview');

  // D3 Coordinate Mapping Scales (Blueprint 1000 x 680 <-> 3D World Space: X [-50, 50], Z [-34, 34])
  const d3ScaleX = useMemo(() => d3.scaleLinear().domain([0, 1000]).range([-50, 50]), []);
  const d3ScaleZ = useMemo(() => d3.scaleLinear().domain([0, 680]).range([-34, 34]), []);
  const d3InvertX = useMemo(() => d3.scaleLinear().domain([-50, 50]).range([0, 1000]), []);
  const d3InvertZ = useMemo(() => d3.scaleLinear().domain([-34, 34]).range([0, 680]), []);

  // Filter staff list
  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      if (!s.mapCoords) return false;
      if (departmentFilter !== 'ALL') {
        if (departmentFilter === 'Security' && !s.team.includes('Security')) return false;
        if (departmentFilter === 'Sevadal' && !s.team.includes('Sevadal') && !s.team.includes('Volunteer')) return false;
        if (departmentFilter === 'Safety' && !s.team.includes('Safety') && !s.team.includes('Disaster')) return false;
        if (departmentFilter === 'Facilitation' && !s.team.includes('Facilitation') && !s.role.includes('Help Desk')) return false;
      }
      if (shiftFilter !== 'ALL') {
        if (!s.shift.toLowerCase().includes(shiftFilter.toLowerCase())) return false;
      }
      return true;
    });
  }, [staff, departmentFilter, shiftFilter]);

  // Normalize staff coordinate helper
  const normalizeCoords = useCallback((coords) => {
    if (!coords) return { x: 500, y: 340 };
    let { x, y } = coords;
    if (x <= 100 && y <= 100) {
      return { x: (x / 100) * 1000, y: (y / 100) * 680 };
    }
    return { x, y };
  }, []);

  // Detect which architectural sector matches coordinates
  const detectSectorName = useCallback((x, y) => {
    if (!sectors || sectors.length === 0) return 'Temple Campus';
    for (const sec of sectors) {
      if (
        x >= sec.bounds.minX &&
        x <= sec.bounds.maxX &&
        y >= sec.bounds.minY &&
        y <= sec.bounds.maxY
      ) {
        return sec.name;
      }
    }
    return 'Campus Perimeter';
  }, [sectors]);

  // -------------------------------------------------------------------------
  // INITIALIZE THREE.JS SCENE & ARCHITECTURE
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 1000;
    const height = container.clientHeight || 650;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(atmosphere === 'night' ? 0x090306 : atmosphere === 'sunset' ? 0x24101A : 0x1A0610);
    scene.fog = new THREE.FogExp2(scene.background.getHex(), 0.0065);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 1, 400);
    camera.position.set(-2, 58, 68);
    cameraRef.current = camera;

    // 3. Renderer with soft shadow maps and ACES filmic tone mapping
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2.08; // Prevent camera dipping beneath terrain
    controls.minDistance = 14;
    controls.maxDistance = 160;
    controls.target.set(6, 2, 0);
    controlsRef.current = controls;

    // 5. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xFFEEDD, 1.1);
    scene.add(ambientLight);
    lightsRef.current.ambientLight = ambientLight;

    const hemisphereLight = new THREE.HemisphereLight(0xFFE4C4, 0x1A0610, 0.85);
    scene.add(hemisphereLight);
    lightsRef.current.hemisphereLight = hemisphereLight;

    const sunLight = new THREE.DirectionalLight(0xFFF3D6, 1.8);
    sunLight.position.set(45, 75, 45);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 200;
    sunLight.shadow.camera.left = -65;
    sunLight.shadow.camera.right = 65;
    sunLight.shadow.camera.top = 65;
    sunLight.shadow.camera.bottom = -65;
    sunLight.shadow.bias = -0.0004;
    scene.add(sunLight);
    lightsRef.current.sunLight = sunLight;

    // 6. BUILD AUTHENTIC 3D TEMPLE ARCHITECTURE
    const dynamicAnimRefs = buildTempleCampus(scene, d3ScaleX, d3ScaleZ);
    animRefs.current = dynamicAnimRefs;

    // 7. Add Officers, Heatmap, and Ghost Cursor groups
    scene.add(officersGroupRef.current);
    scene.add(heatmapGroupRef.current);

    const ghost = buildHolographicDeployGhost();
    scene.add(ghost);
    ghostCursorRef.current = ghost;

    // Resize listener
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 8. Animation & Render Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Animate swimming Bostami softshell turtles in Kalyan Sagar
      if (animRefs.current.turtles && animRefs.current.turtles.length > 0) {
        const lakeCenter = { x: d3ScaleX(820), z: d3ScaleZ(540) };
        animRefs.current.turtles.forEach((tGroup) => {
          const ud = tGroup.userData;
          const currentAngle = ud.baseAngle + elapsedTime * (ud.speed || 0.3);
          tGroup.position.x = lakeCenter.x + Math.cos(currentAngle) * ud.dist;
          tGroup.position.z = lakeCenter.z + Math.sin(currentAngle) * ud.dist;
          tGroup.rotation.y = -currentAngle + (ud.speed > 0 ? Math.PI / 2 : -Math.PI / 2);
          // Subtle swimming bobbing
          tGroup.position.y = 0.18 + Math.sin(elapsedTime * 2.5 + ud.dist) * 0.05;
        });
      }

      // Animate fluttering saffron temple flag (Dhwaja) atop Char-chala dome
      if (animRefs.current.flagMesh) {
        const flag = animRefs.current.flagMesh;
        const posAttr = flag.geometry.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
          const u = posAttr.getX(i);
          const wave = Math.sin(elapsedTime * 6 + u * 2.5) * 0.18 * (u / 1.8);
          posAttr.setZ(i, wave);
        }
        flag.geometry.computeVertexNormals();
        flag.geometry.attributes.position.needsUpdate = true;
      }

      // Animate lake water surface reflections
      if (animRefs.current.lakeWaterMesh) {
        animRefs.current.lakeWaterMesh.material.opacity = 0.84 + Math.sin(elapsedTime * 2.2) * 0.06;
      }

      // Animate officer radar rings & floating emblems
      if (officersGroupRef.current) {
        officersGroupRef.current.children.forEach((officer) => {
          const radar = officer.getObjectByName('radarHalo');
          if (radar) {
            const pulse = 1.0 + Math.sin(elapsedTime * 3.5 + (officer.userData.phase || 0)) * 0.12;
            radar.scale.set(pulse, pulse, pulse);
          }
          const emblem = officer.getObjectByName('floatingEmblem');
          if (emblem) {
            emblem.rotation.y = elapsedTime * 2.0;
            emblem.position.y = 6.8 + Math.sin(elapsedTime * 3.0) * 0.25;
          }
        });
      }

      // Orbit controls update
      if (controlsRef.current) {
        controlsRef.current.autoRotate = isAutoRotating;
        controlsRef.current.autoRotateSpeed = 0.85;
        controlsRef.current.update();
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
        if (container.contains(rendererRef.current.domElement)) {
          container.removeChild(rendererRef.current.domElement);
        }
      }
    };
  }, []);

  // -------------------------------------------------------------------------
  // UPDATE ATMOSPHERE LIGHTING (Daylight / Sunset Aarti / Night Surveillance)
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!sceneRef.current || !rendererRef.current || !lightsRef.current.sunLight) return;
    const scene = sceneRef.current;
    const renderer = rendererRef.current;
    const { sunLight, ambientLight, hemisphereLight } = lightsRef.current;

    if (atmosphere === 'night') {
      scene.background = new THREE.Color(0x0A0307);
      scene.fog.color = new THREE.Color(0x0A0307);
      ambientLight.color.setHex(0x1E1528);
      ambientLight.intensity = 0.55;
      hemisphereLight.color.setHex(0x2E103A);
      hemisphereLight.groundColor.setHex(0x0A0307);
      hemisphereLight.intensity = 0.5;
      sunLight.color.setHex(0x3B82F6); // Moonlight tint
      sunLight.intensity = 0.45;
      renderer.toneMappingExposure = 1.35;
      if (animRefs.current.sanctumInnerLight) animRefs.current.sanctumInnerLight.intensity = 5.0;
    } else if (atmosphere === 'sunset') {
      scene.background = new THREE.Color(0x2A101C);
      scene.fog.color = new THREE.Color(0x2A101C);
      ambientLight.color.setHex(0xFFB599);
      ambientLight.intensity = 0.95;
      hemisphereLight.color.setHex(0xFB923C);
      hemisphereLight.groundColor.setHex(0x451A03);
      hemisphereLight.intensity = 0.8;
      sunLight.color.setHex(0xF97316); // Golden sunset
      sunLight.intensity = 1.6;
      renderer.toneMappingExposure = 1.25;
      if (animRefs.current.sanctumInnerLight) animRefs.current.sanctumInnerLight.intensity = 4.2;
    } else {
      // Day
      scene.background = new THREE.Color(0x1B0711);
      scene.fog.color = new THREE.Color(0x1B0711);
      ambientLight.color.setHex(0xFFEEDD);
      ambientLight.intensity = 1.15;
      hemisphereLight.color.setHex(0xFFE4C4);
      hemisphereLight.groundColor.setHex(0x1A0610);
      hemisphereLight.intensity = 0.85;
      sunLight.color.setHex(0xFFF3D6);
      sunLight.intensity = 1.85;
      renderer.toneMappingExposure = 1.15;
      if (animRefs.current.sanctumInnerLight) animRefs.current.sanctumInnerLight.intensity = 3.0;
    }
  }, [atmosphere]);

  // -------------------------------------------------------------------------
  // UPDATE 3D OFFICER MODELS IN SCENE
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!officersGroupRef.current) return;
    const group = officersGroupRef.current;

    // Clear existing officer meshes
    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
    }

    filteredStaff.forEach((member, idx) => {
      const norm = normalizeCoords(member.mapCoords);
      const posX = d3ScaleX(norm.x);
      const posZ = d3ScaleZ(norm.y);
      const isSelected = member.id === selectedStaffId;

      const officerMesh = buildOfficer3DModel(member, isSelected);

      // Determine ground elevation: if on Kurma hillock (near sanctum), elevate officer
      const sanctumX = d3ScaleX(640);
      const sanctumZ = d3ScaleZ(335);
      const distFromSanctum = Math.hypot(posX - sanctumX, posZ - sanctumZ);

      let elevationY = 0;
      if (distFromSanctum < 17.0) {
        elevationY = 3.0; // On sacred upper plinth
      } else if (distFromSanctum < 26.0) {
        elevationY = 1.2; // On middle terrace
      }

      officerMesh.position.set(posX, elevationY, posZ);
      officerMesh.userData.phase = idx * 0.7;
      officerMesh.userData.elevationY = elevationY;

      // Face toward center of campus or outward
      officerMesh.rotation.y = Math.atan2(sanctumX - posX, sanctumZ - posZ);

      group.add(officerMesh);
    });
  }, [filteredStaff, selectedStaffId, d3ScaleX, d3ScaleZ, normalizeCoords]);

  // -------------------------------------------------------------------------
  // UPDATE SECURITY HEATMAP / COVERAGE OVERLAY
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!heatmapGroupRef.current) return;
    const group = heatmapGroupRef.current;

    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    }

    if (!showHeatmap) return;

    // Build tactical coverage discs around each officer
    filteredStaff.forEach((member) => {
      const norm = normalizeCoords(member.mapCoords);
      const posX = d3ScaleX(norm.x);
      const posZ = d3ScaleZ(norm.y);
      const dept = getOfficerDepartment(member.team, member.role);

      const coverageGeo = new THREE.CircleGeometry(10.5, 32);
      coverageGeo.rotateX(-Math.PI / 2);
      const coverageMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(dept.hex),
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide,
      });
      const coverageMesh = new THREE.Mesh(coverageGeo, coverageMat);
      coverageMesh.position.set(posX, 0.25, posZ);
      group.add(coverageMesh);

      // Border ring
      const borderGeo = new THREE.RingGeometry(10.3, 10.5, 32);
      borderGeo.rotateX(-Math.PI / 2);
      const borderMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(dept.hex),
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
      });
      const borderMesh = new THREE.Mesh(borderGeo, borderMat);
      borderMesh.position.set(posX, 0.26, posZ);
      group.add(borderMesh);
    });
  }, [showHeatmap, filteredStaff, d3ScaleX, d3ScaleZ, normalizeCoords]);

  // -------------------------------------------------------------------------
  // CAMERA PRESET TRANSITIONS
  // -------------------------------------------------------------------------
  const handleApplyCameraPreset = (presetKey) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    setCameraPreset(presetKey);

    const sanctumX = d3ScaleX(640);
    const sanctumZ = d3ScaleZ(335);
    const lakeX = d3ScaleX(820);
    const lakeZ = d3ScaleZ(540);
    const gopuramX = d3ScaleX(140);
    const gopuramZ = d3ScaleZ(370);
    const annadanamX = d3ScaleX(540);
    const annadanamZ = d3ScaleZ(570);

    let targetCamPos = { x: -2, y: 58, z: 68 };
    let targetLookAt = { x: 6, y: 2, z: 0 };

    switch (presetKey) {
      case 'sanctum':
        targetCamPos = { x: sanctumX - 18, y: 16, z: sanctumZ + 18 };
        targetLookAt = { x: sanctumX, y: 7, z: sanctumZ };
        break;
      case 'lake':
        targetCamPos = { x: lakeX - 22, y: 18, z: lakeZ - 20 };
        targetLookAt = { x: lakeX, y: 2, z: lakeZ };
        break;
      case 'gopuram':
        targetCamPos = { x: gopuramX - 22, y: 14, z: gopuramZ };
        targetLookAt = { x: gopuramX + 6, y: 4, z: gopuramZ };
        break;
      case 'annadanam':
        targetCamPos = { x: annadanamX - 20, y: 16, z: annadanamZ + 16 };
        targetLookAt = { x: annadanamX, y: 4, z: annadanamZ };
        break;
      case 'overview':
      default:
        targetCamPos = { x: -2, y: 58, z: 68 };
        targetLookAt = { x: 6, y: 2, z: 0 };
        break;
    }

    camera.position.set(targetCamPos.x, targetCamPos.y, targetCamPos.z);
    controls.target.set(targetLookAt.x, targetLookAt.y, targetLookAt.z);
    controls.update();
  };

  // -------------------------------------------------------------------------
  // INTERACTIVE RAYCASTING: MOUSE MOVE & HOVER TRACKING
  // -------------------------------------------------------------------------
  const handlePointerMove = (e) => {
    if (!containerRef.current || !cameraRef.current || !sceneRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    mouseRef.current.set(mouseX, mouseY);
    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

    // 1. Raycast against Officer Hit Meshes
    if (officersGroupRef.current && !isPlacingPin && !isRepositioningId) {
      const officerIntersects = raycasterRef.current.intersectObjects(
        officersGroupRef.current.children,
        true
      );
      const officerHit = officerIntersects.find(
        (hit) => hit.object.userData && hit.object.userData.isOfficerClickable
      );

      if (officerHit) {
        setHoveredOfficer(officerHit.object.userData.member);
        setHoveredScreenPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        onHoverStaff?.(officerHit.object.userData.member);
        return;
      } else {
        setHoveredOfficer(null);
      }
    }

    // 2. Raycast against 3D Campus Terrain for Holographic Deploy Ghost
    const allObjects = sceneRef.current.children;
    const terrainIntersects = raycasterRef.current.intersectObjects(allObjects, true);

    // Filter out hit meshes and laser lines
    const groundHit = terrainIntersects.find(
      (hit) => hit.object.name !== 'deployGhostCursor' && !hit.object.userData?.isOfficerClickable
    );

    if (groundHit) {
      const hitPt = groundHit.point;
      const bpX = Math.round(d3InvertX(hitPt.x));
      const bpY = Math.round(d3InvertZ(hitPt.z));
      const clampedX = Math.max(40, Math.min(960, bpX));
      const clampedY = Math.max(40, Math.min(640, bpY));
      const detectedSector = detectSectorName(clampedX, clampedY);

      setTargetTerrainInfo({
        coords: { x: clampedX, y: clampedY },
        point3D: hitPt,
        sectorName: detectedSector,
      });

      // Update Holographic Ghost position if active
      if (ghostCursorRef.current && (isPlacingPin || isRepositioningId)) {
        ghostCursorRef.current.visible = true;
        ghostCursorRef.current.position.set(hitPt.x, hitPt.y + 0.1, hitPt.z);
      }
    } else {
      if (ghostCursorRef.current) ghostCursorRef.current.visible = false;
      setTargetTerrainInfo(null);
    }
  };

  // -------------------------------------------------------------------------
  // INTERACTIVE RAYCASTING: CLICK HANDLER (DEPLOY / SELECT OFFICER)
  // -------------------------------------------------------------------------
  const handlePointerDown = (e) => {
    // Only handle primary left click
    if (e.button !== 0) return;
    if (!containerRef.current || !cameraRef.current || !sceneRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    mouseRef.current.set(mouseX, mouseY);
    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

    // If currently placing or repositioning: click on 3D terrain deploys officer!
    if (isPlacingPin || isRepositioningId) {
      const terrainIntersects = raycasterRef.current.intersectObjects(
        sceneRef.current.children,
        true
      );
      const groundHit = terrainIntersects.find(
        (hit) => hit.object.name !== 'deployGhostCursor' && !hit.object.userData?.isOfficerClickable
      );

      if (groundHit) {
        const bpX = Math.round(d3InvertX(groundHit.point.x));
        const bpY = Math.round(d3InvertZ(groundHit.point.z));
        const clampedX = Math.max(40, Math.min(960, bpX));
        const clampedY = Math.max(40, Math.min(640, bpY));

        onCanvasDeployClick?.({ x: clampedX, y: clampedY });
        if (ghostCursorRef.current) ghostCursorRef.current.visible = false;
      }
      return;
    }

    // Otherwise: check if user clicked on an officer to select & inspect
    if (officersGroupRef.current) {
      const officerIntersects = raycasterRef.current.intersectObjects(
        officersGroupRef.current.children,
        true
      );
      const officerHit = officerIntersects.find(
        (hit) => hit.object.userData && hit.object.userData.isOfficerClickable
      );

      if (officerHit) {
        onSelectStaff?.(officerHit.object.userData.member);
      }
    }
  };

  return (
    <div className="relative w-full h-[650px] rounded-2xl overflow-hidden border border-[#B68A36]/40 shadow-2xl bg-[#0F040A] select-none">
      {/* 3D WebGL Canvas */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{
          cursor: isPlacingPin || isRepositioningId ? 'crosshair' : undefined,
        }}
      />

      {/* TOP COMMAND HUD: Status, Camera Presets & Lighting Controls */}
      <div className="absolute top-3.5 left-3.5 right-3.5 flex flex-wrap items-center justify-between gap-2 pointer-events-none z-20">
        {/* Left: Active Mode & Live Compass */}
        <div className="flex items-center gap-2 pointer-events-auto bg-[#1A0610]/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#B68A36]/50 text-white shadow-xl">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-heading font-bold text-xs tracking-wider text-amber-200">
            MATA TRIPURA SUNDARI 3D ARCHITECTURAL TWIN
          </span>
          <span className="text-stone-300 text-[11px] font-number pl-1.5 border-l border-white/20">
            {filteredStaff.length} Officers Stationed
          </span>
        </div>

        {/* Center: Camera Architectural Presets */}
        <div className="hidden lg:flex items-center gap-1 pointer-events-auto bg-[#1A0610]/95 backdrop-blur-md p-1 rounded-xl border border-[#B68A36]/40 shadow-xl">
          {[
            { key: 'overview', label: 'Overview', icon: '🏛️' },
            { key: 'sanctum', label: 'Sanctum & Natmandir', icon: '🛕' },
            { key: 'lake', label: 'Kalyan Sagar Ghat', icon: '🌊' },
            { key: 'gopuram', label: 'West Gateway', icon: '🚪' },
            { key: 'annadanam', label: 'Annadanam Hall', icon: '🍲' },
          ].map((preset) => (
            <button
              key={preset.key}
              type="button"
              onClick={() => handleApplyCameraPreset(preset.key)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1 ${
                cameraPreset === preset.key
                  ? 'bg-[#55132D] text-amber-200 font-bold border border-[#E2BC6B]/60 shadow-xs'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{preset.icon}</span>
              <span>{preset.label}</span>
            </button>
          ))}
        </div>

        {/* Right: Lighting Atmosphere, Heatmap & Auto-Tour */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-[#1A0610]/95 backdrop-blur-md p-1 rounded-xl border border-[#B68A36]/50 shadow-xl">
          {/* Lighting: Day / Sunset / Night */}
          <div className="flex items-center bg-black/40 rounded-lg p-0.5 border border-white/10">
            <button
              type="button"
              onClick={() => setAtmosphere('day')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                atmosphere === 'day' ? 'bg-[#55132D] text-amber-300 shadow-xs' : 'text-stone-400 hover:text-white'
              }`}
              title="Daylight Solar Radiance"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setAtmosphere('sunset')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                atmosphere === 'sunset' ? 'bg-[#55132D] text-amber-300 shadow-xs' : 'text-stone-400 hover:text-white'
              }`}
              title="Aarti Sunset Golden Hour"
            >
              <Sunset className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setAtmosphere('night')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                atmosphere === 'night' ? 'bg-[#55132D] text-amber-300 shadow-xs' : 'text-stone-400 hover:text-white'
              }`}
              title="Night Surveillance & Floodlights"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Toggle Tactical Coverage Heatmap */}
          <button
            type="button"
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              showHeatmap
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                : 'text-stone-300 hover:text-white hover:bg-white/10'
            }`}
            title="Toggle Tactical Patrol Coverage Heatmap"
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Coverage</span>
          </button>

          {/* Cinematic 360° Tour */}
          <button
            type="button"
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              isAutoRotating ? 'bg-[#55132D] text-amber-300' : 'text-stone-400 hover:text-white'
            }`}
            title="Cinematic 360° Architectural Drone Patrol"
          >
            {isAutoRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Reset Camera */}
          <button
            type="button"
            onClick={() => handleApplyCameraPreset('overview')}
            className="p-1.5 rounded-lg text-xs text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Reset Campus View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ACTIVE DEPLOYMENT TARGETING BANNER */}
      {(isPlacingPin || isRepositioningId) && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-[#55132D]/95 backdrop-blur-md text-white px-5 py-2.5 rounded-2xl border-2 border-[#E2BC6B] shadow-2xl flex items-center gap-3 text-xs animate-pulse pointer-events-none z-30">
          <Crosshair className="w-5 h-5 text-[#E2BC6B] animate-spin" />
          <div>
            <div className="font-bold tracking-wide text-amber-200">
              {isRepositioningId
                ? 'TARGETING ACTIVE: CLICK ANYWHERE ON 3D MODEL TO RELOCATE OFFICER'
                : 'TACTICAL DEPLOYMENT: CLICK ANY PATROL PATH OR GATE TO STATION OFFICER'}
            </div>
            {targetTerrainInfo && (
              <div className="text-[11px] text-stone-300 flex items-center gap-2 mt-0.5">
                <span>
                  <strong>Sector:</strong> {targetTerrainInfo.sectorName}
                </span>
                <span className="font-number bg-black/50 px-2 py-0.5 rounded text-amber-300">
                  X: {targetTerrainInfo.coords.x}, Y: {targetTerrainInfo.coords.y}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3D HOVER OFFICER TELEMETRY CARD */}
      {hoveredOfficer && !isPlacingPin && !isRepositioningId && (
        <div
          className="absolute z-40 bg-[#1A0610]/95 backdrop-blur-md text-white p-3.5 rounded-2xl border border-[#B68A36] shadow-2xl pointer-events-none text-xs space-y-1.5 min-w-[220px]"
          style={{
            left: Math.min(hoveredScreenPos.x + 15, (containerRef.current?.clientWidth || 800) - 240),
            top: Math.max(hoveredScreenPos.y - 75, 20),
          }}
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
            <span className="font-heading font-bold text-sm text-[#E2BC6B]">{hoveredOfficer.name}</span>
            <span
              className={`text-[10px] font-number px-2 py-0.5 rounded-full font-bold ${
                hoveredOfficer.status === 'Active'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}
            >
              {hoveredOfficer.status}
            </span>
          </div>
          <div className="text-[11px] text-stone-300 flex items-center justify-between">
            <span>
              <strong>Role:</strong> {hoveredOfficer.role}
            </span>
            <span className="font-number text-stone-400">{hoveredOfficer.id}</span>
          </div>
          <div className="text-[11px] text-stone-300">
            <strong>Zone:</strong> {hoveredOfficer.assignedZoneName || 'Campus Ground'}
          </div>
          <div className="text-[10px] text-stone-400 font-number flex items-center justify-between pt-1 border-t border-white/10">
            <span>Radio: {hoveredOfficer.radioChannel || 'CH-1'}</span>
            <span className="text-amber-300 font-semibold">Click Officer to Inspect →</span>
          </div>
        </div>
      )}

      {/* BOTTOM LEFT: TACTICAL DEPARTMENT LEGEND */}
      <div className="absolute bottom-3 left-3 bg-[#1A0610]/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/10 text-stone-300 text-[11px] pointer-events-auto space-y-1.5 shadow-xl">
        <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
          Stationed Tactical Units
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" /> Security & Police
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A855F7]" /> Queue & Crowd
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C]" /> Lake & Safety
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /> Sevadal
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" /> Help Desk
          </span>
        </div>
        <div className="text-[10px] text-stone-400 border-t border-white/10 pt-1">
          Left Drag: Rotate 360° • Right Drag: Pan • Scroll: Zoom • Click Officer: Full Details
        </div>
      </div>

      {/* BOTTOM RIGHT: SACRED HERITAGE WATERMARK */}
      <div className="absolute bottom-3 right-3 bg-[#1A0610]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] text-stone-300 pointer-events-none flex items-center gap-2 shadow-lg">
        <Compass className="w-3.5 h-3.5 text-[#E2BC6B] animate-[spin_10s_linear_infinite]" />
        <span>EST. 1501 CE • MAHARAJA DHANYA MANIKYA • 51 SHAKTI PEETHAS</span>
      </div>
    </div>
  );
}
