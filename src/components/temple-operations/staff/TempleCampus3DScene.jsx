import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as d3 from 'd3';
import {
  RotateCcw,
  Sun,
  Moon,
  Sunset,
  Compass,
  Play,
  Pause,
  MapPin,
  Shield,
  Activity,
  Crosshair,
  Sparkles,
  Info,
  Navigation,
  Eye,
  ChevronRight,
  Footprints,
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
 * Light Theme & Authentic Architecture Features:
 * 1. Warm alabaster/daylight sky environment with soft sandstone reflections.
 * 2. Authentic Bengali Char-Chala shikhara with curved eaves, stupa-dome, fluted Amalaka, and golden Kalasha.
 * 3. Kurmapitha tortoise mound with multi-tier stone terraces and golden guardian lions.
 * 4. Kalyan Sagar holy lake with swimming Bostami turtles and wooden observation deck.
 * 5. Interactive Landmark Inspector with smooth cinematic camera gliding.
 * 6. Interactive Devotee Walkway Ribbon (Step-by-step 6-stage pilgrim path).
 * 7. 3D Officer Humanoid Avatars with department uniforms & live tactical heatmap.
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
  viewMode = 'isometric',
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
  const pilgrimPathGroupRef = useRef(new THREE.Group());
  const ghostCursorRef = useRef(null);
  const animRefs = useRef({ turtles: [], flagMesh: null, lakeWaterMesh: null, sanctumInnerLight: null });
  const lightsRef = useRef({ sunLight: null, ambientLight: null, hemisphereLight: null });

  // Camera glide lerp transition ref
  const camTransitionRef = useRef({
    active: false,
    startPos: new THREE.Vector3(),
    targetPos: new THREE.Vector3(),
    startLook: new THREE.Vector3(),
    targetLook: new THREE.Vector3(),
    progress: 1,
  });

  // UI state
  const [atmosphere, setAtmosphere] = useState('day'); // 'day' | 'sunset' | 'night'
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showPilgrimPath, setShowPilgrimPath] = useState(true);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [hoveredOfficer, setHoveredOfficer] = useState(null);
  const [hoveredScreenPos, setHoveredScreenPos] = useState({ x: 0, y: 0 });
  const [hoveredLandmark, setHoveredLandmark] = useState(null);
  const [selectedLandmark, setSelectedLandmark] = useState(null);
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

  // Smooth camera glide trigger
  const glideCameraTo = (targetPos, targetLookAt) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    camTransitionRef.current = {
      active: true,
      startPos: camera.position.clone(),
      targetPos: new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z),
      startLook: controls.target.clone(),
      targetLook: new THREE.Vector3(targetLookAt.x, targetLookAt.y, targetLookAt.z),
      progress: 0,
    };
  };

  // -------------------------------------------------------------------------
  // INITIALIZE THREE.JS SCENE (LIGHT THEME AMBIENT ARCHITECTURE)
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 1000;
    const height = container.clientHeight || 650;

    // 1. Scene with Light Warm Cream Background & Horizon Fog
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const initialBgColor = 0xF5F0E8; // Light sandstone cream
    scene.background = new THREE.Color(initialBgColor);
    scene.fog = new THREE.FogExp2(initialBgColor, 0.0035);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 1, 400);
    camera.position.set(-2, 58, 68);
    cameraRef.current = camera;

    // 3. Renderer with ACES filmic tone mapping & soft PCF shadow maps
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
    controls.maxPolarAngle = Math.PI / 2.06; // Prevent camera dipping beneath ground
    controls.minDistance = 12;
    controls.maxDistance = 160;
    controls.target.set(6, 2, 0);
    controlsRef.current = controls;

    // 5. Lighting Setup for Light Theme
    const ambientLight = new THREE.AmbientLight(0xFFFBF2, 1.25);
    scene.add(ambientLight);
    lightsRef.current.ambientLight = ambientLight;

    const hemisphereLight = new THREE.HemisphereLight(0xEBF4FA, 0xE8DFD1, 0.9);
    scene.add(hemisphereLight);
    lightsRef.current.hemisphereLight = hemisphereLight;

    const sunLight = new THREE.DirectionalLight(0xFFF5E4, 2.0);
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

    // 7. Add Groups (Officers, Heatmap, Pilgrim Path, Ghost Cursor)
    scene.add(officersGroupRef.current);
    scene.add(heatmapGroupRef.current);
    scene.add(pilgrimPathGroupRef.current);

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
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth Camera Glide Lerping
      const ct = camTransitionRef.current;
      if (ct.active && ct.progress < 1) {
        ct.progress = Math.min(1, ct.progress + delta * 1.4);
        // Ease in-out cubic
        const t = ct.progress < 0.5
          ? 4 * ct.progress * ct.progress * ct.progress
          : 1 - Math.pow(-2 * ct.progress + 2, 3) / 2;

        camera.position.lerpVectors(ct.startPos, ct.targetPos, t);
        controls.target.lerpVectors(ct.startLook, ct.targetLook, t);

        if (ct.progress >= 1) ct.active = false;
      }

      // Animate swimming Bostami softshell turtles in Kalyan Sagar
      if (animRefs.current.turtles && animRefs.current.turtles.length > 0) {
        const lakeCenter = { x: d3ScaleX(820), z: d3ScaleZ(540) };
        animRefs.current.turtles.forEach((tGroup) => {
          const ud = tGroup.userData;
          const currentAngle = ud.baseAngle + elapsedTime * (ud.speed || 0.3);
          tGroup.position.x = lakeCenter.x + Math.cos(currentAngle) * ud.dist;
          tGroup.position.z = lakeCenter.z + Math.sin(currentAngle) * ud.dist;
          tGroup.rotation.y = -(currentAngle + Math.PI / 2);
          tGroup.position.y = 0.16 + Math.sin(elapsedTime * 2.5 + ud.baseAngle) * 0.04;
        });
      }

      // Animate fluttering saffron temple flag (Dhwaja) atop Shikhara
      if (animRefs.current.flagMesh) {
        const flagGeo = animRefs.current.flagMesh.geometry;
        const posAttr = flagGeo.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
          const u = posAttr.getX(i);
          const wave = Math.sin(elapsedTime * 4.5 + u * 2.8) * 0.18;
          posAttr.setZ(i, wave);
        }
        posAttr.needsUpdate = true;
      }

      // Animate subtle ripples on Kalyan Sagar water
      if (animRefs.current.lakeWaterMesh) {
        animRefs.current.lakeWaterMesh.rotation.y = elapsedTime * 0.015;
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
      scene.background.setHex(0x181528); // Deep twilight indigo
      scene.fog.color.setHex(0x181528);
      ambientLight.color.setHex(0x282044);
      ambientLight.intensity = 0.65;
      hemisphereLight.color.setHex(0x3B3060);
      hemisphereLight.groundColor.setHex(0x151222);
      hemisphereLight.intensity = 0.55;
      sunLight.color.setHex(0x60A5FA); // Cool moonlight
      sunLight.intensity = 0.5;
      renderer.toneMappingExposure = 1.35;
      if (animRefs.current.sanctumInnerLight) animRefs.current.sanctumInnerLight.intensity = 5.2;
    } else if (atmosphere === 'sunset') {
      scene.background.setHex(0xFCE8D5); // Warm peach golden hour
      scene.fog.color.setHex(0xFCE8D5);
      ambientLight.color.setHex(0xFFE2D0);
      ambientLight.intensity = 1.1;
      hemisphereLight.color.setHex(0xFB923C);
      hemisphereLight.groundColor.setHex(0x78350F);
      hemisphereLight.intensity = 0.85;
      sunLight.color.setHex(0xF97316); // Golden sunset sun
      sunLight.intensity = 1.8;
      renderer.toneMappingExposure = 1.25;
      if (animRefs.current.sanctumInnerLight) animRefs.current.sanctumInnerLight.intensity = 4.5;
    } else {
      // Day (Serene Light Theme)
      scene.background.setHex(0xF5F0E8); // Light sandstone cream
      scene.fog.color.setHex(0xF5F0E8);
      ambientLight.color.setHex(0xFFFBF2);
      ambientLight.intensity = 1.25;
      hemisphereLight.color.setHex(0xEBF4FA);
      hemisphereLight.groundColor.setHex(0xE8DFD1);
      hemisphereLight.intensity = 0.9;
      sunLight.color.setHex(0xFFF5E4); // Warm natural sunlight
      sunLight.intensity = 2.0;
      renderer.toneMappingExposure = 1.15;
      if (animRefs.current.sanctumInnerLight) animRefs.current.sanctumInnerLight.intensity = 3.2;
    }
  }, [atmosphere]);

  // -------------------------------------------------------------------------
  // BUILD & TOGGLE DEVOTEE WALKWAY RIBBON (Step-by-Step 6-Stage Pilgrimage)
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!pilgrimPathGroupRef.current) return;
    const group = pilgrimPathGroupRef.current;

    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    }

    if (!showPilgrimPath) return;

    // CatmullRom spline path across key campus stations
    const pathPoints = [
      new THREE.Vector3(d3ScaleX(140), 0.3, d3ScaleZ(370)), // West Gate
      new THREE.Vector3(d3ScaleX(280), 0.32, d3ScaleZ(360)), // Help Desk
      new THREE.Vector3(d3ScaleX(440), 0.35, d3ScaleZ(335)), // Natmandir Steps
      new THREE.Vector3(d3ScaleX(620), 3.2, d3ScaleZ(335)),  // Sanctum Kurmapitha
      new THREE.Vector3(d3ScaleX(640), 1.0, d3ScaleZ(480)),  // Prasad Stalls
      new THREE.Vector3(d3ScaleX(770), 0.32, d3ScaleZ(520)), // Lake Ghats
      new THREE.Vector3(d3ScaleX(820), 0.3, d3ScaleZ(540)),  // Turtle Deck
    ];

    const curve = new THREE.CatmullRomCurve3(pathPoints);
    const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.28, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0xE2BC6B,
      emissive: 0xB68A36,
      emissiveIntensity: 0.45,
      roughness: 0.3,
      metalness: 0.8,
      transparent: true,
      opacity: 0.85,
    });
    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    group.add(tubeMesh);

    // Glowing stage beacons at each landmark station
    pathPoints.forEach((pt, idx) => {
      const beaconGeo = new THREE.CylinderGeometry(0.5, 0.7, 0.25, 16);
      const beaconMat = new THREE.MeshStandardMaterial({
        color: 0x55132D,
        emissive: 0xE2BC6B,
        emissiveIntensity: 0.5,
      });
      const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
      beaconMesh.position.set(pt.x, pt.y + 0.1, pt.z);
      group.add(beaconMesh);
    });
  }, [showPilgrimPath, d3ScaleX, d3ScaleZ]);

  // -------------------------------------------------------------------------
  // UPDATE 3D OFFICER MODELS IN SCENE
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!officersGroupRef.current) return;
    const group = officersGroupRef.current;

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

      const sanctumX = d3ScaleX(640);
      const sanctumZ = d3ScaleZ(335);
      const distFromSanctum = Math.hypot(posX - sanctumX, posZ - sanctumZ);

      let elevationY = 0;
      if (distFromSanctum < 17.0) elevationY = 3.0; // Sacred upper plinth
      else if (distFromSanctum < 26.0) elevationY = 1.2; // Middle terrace

      officerMesh.position.set(posX, elevationY, posZ);
      officerMesh.userData.phase = idx * 0.7;
      officerMesh.userData.elevationY = elevationY;
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
  // CAMERA PRESET GLIDE TRANSITIONS
  // -------------------------------------------------------------------------
  const handleApplyCameraPreset = (presetKey) => {
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
        setSelectedLandmark({
          key: 'sanctum',
          name: 'Main Sanctum (Garbhagriha)',
          style: 'Bengali Char-Chala Style (1501 CE)',
          desc: 'Core shrine consecrated by Maharaja Dhanya Manikya, housing Maa Tripura Sundari (Soroshi) and Chhoto-Ma atop the Kurmapitha hillock.',
        });
        break;
      case 'lake':
        targetCamPos = { x: lakeX - 22, y: 18, z: lakeZ - 20 };
        targetLookAt = { x: lakeX, y: 2, z: lakeZ };
        setSelectedLandmark({
          key: 'lake',
          name: 'Kalyan Sagar Sacred Lake & Ghats',
          style: '6.4-Acre Historic Reservoir (1501 CE)',
          desc: 'Eastern holy lake sanctified by Maharaja Dhanya Manikya, famous for housing endangered sacred Bostami softshell turtles.',
        });
        break;
      case 'gopuram':
        targetCamPos = { x: gopuramX - 22, y: 14, z: gopuramZ };
        targetLookAt = { x: gopuramX + 6, y: 4, z: gopuramZ };
        setSelectedLandmark({
          key: 'gopuram',
          name: 'Singh Dwar (West Royal Gate)',
          style: 'Tripura Manikya Fortified Gateway',
          desc: 'Main ceremonial pedestrian entrance along NH-8 corridor, featuring baggage check, shoe deposit counters, and computerized turnstiles.',
        });
        break;
      case 'annadanam':
        targetCamPos = { x: annadanamX - 20, y: 16, z: annadanamZ + 16 };
        targetLookAt = { x: annadanamX, y: 4, z: annadanamZ };
        setSelectedLandmark({
          key: 'annadanam',
          name: 'Sri Annapurna Dining Hall',
          style: 'Mahaprasad Free Kitchen Complex',
          desc: 'Free community kitchen serving hot consecrated Anna-Prasad to over 3,000 devotees daily from 12:30 PM to 02:30 PM.',
        });
        break;
      case 'turtle_deck':
        targetCamPos = { x: lakeX - 18, y: 9, z: lakeZ - 12 };
        targetLookAt = { x: lakeX - 12, y: 1.5, z: lakeZ - 8 };
        setSelectedLandmark({
          key: 'turtle_deck',
          name: 'Bostami Turtle Observation Deck',
          style: 'Lakefront Feeding Pavilion',
          desc: 'Wooden observation deck where devotees offer puffed rice (muri) to the sacred Nilssonia nigricans softshell tortoises.',
        });
        break;
      case 'overview':
      default:
        targetCamPos = { x: -2, y: 58, z: 68 };
        targetLookAt = { x: 6, y: 2, z: 0 };
        setSelectedLandmark(null);
        break;
    }

    glideCameraTo(targetCamPos, targetLookAt);
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
        setHoveredLandmark(null);
        return;
      } else {
        setHoveredOfficer(null);
      }
    }

    // 2. Raycast against Architectural Landmarks
    if (!isPlacingPin && !isRepositioningId) {
      const landmarkIntersects = raycasterRef.current.intersectObjects(
        sceneRef.current.children,
        true
      );
      const landmarkHit = landmarkIntersects.find(
        (hit) => hit.object.userData && hit.object.userData.isLandmark
      );
      if (landmarkHit) {
        setHoveredLandmark(landmarkHit.object.userData.landmark);
      } else {
        setHoveredLandmark(null);
      }
    }

    // 3. Raycast against 3D Campus Terrain for Holographic Deploy Ghost
    const allObjects = sceneRef.current.children;
    const terrainIntersects = raycasterRef.current.intersectObjects(allObjects, true);

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
  // INTERACTIVE RAYCASTING: CLICK HANDLER (DEPLOY / SELECT / INSPECT)
  // -------------------------------------------------------------------------
  const handlePointerDown = (e) => {
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

    // Check if clicked an officer
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
        return;
      }
    }

    // Check if clicked an architectural landmark to inspect & focus
    const landmarkIntersects = raycasterRef.current.intersectObjects(
      sceneRef.current.children,
      true
    );
    const landmarkHit = landmarkIntersects.find(
      (hit) => hit.object.userData && hit.object.userData.isLandmark
    );
    if (landmarkHit) {
      const lm = landmarkHit.object.userData.landmark;
      setSelectedLandmark(lm);
      handleApplyCameraPreset(lm.key);
    }
  };

  return (
    <div className="relative w-full h-[660px] rounded-2xl overflow-hidden border border-[#E2BC6B]/60 shadow-xl bg-[#FAF7F2] select-none">
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

      {/* TOP COMMAND HUD: Status, Camera Presets & Lighting Controls (Light Theme Glassmorphism) */}
      <div className="absolute top-3.5 left-3.5 right-3.5 flex flex-wrap items-center justify-between gap-2 pointer-events-none z-20">
        {/* Left: Active Mode & Live Compass */}
        <div className="flex items-center gap-2 pointer-events-auto bg-white/92 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-stone-200/90 text-stone-800 shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-serif font-bold text-xs tracking-wide text-[#55132D]">
            Mata Tripura Sundari 3D Twin
          </span>
          <span className="text-stone-500 text-[11px] font-semibold pl-1.5 border-l border-stone-200">
            {filteredStaff.length} Officers Stationed
          </span>
        </div>

        {/* Center: Camera Architectural Presets */}
        <div className="hidden lg:flex items-center gap-1 pointer-events-auto bg-white/92 backdrop-blur-md p-1 rounded-xl border border-stone-200/90 shadow-sm">
          {[
            { key: 'overview', label: 'Overview', icon: '🏛️' },
            { key: 'sanctum', label: 'Sanctum & Natmandir', icon: '🛕' },
            { key: 'lake', label: 'Kalyan Sagar Ghat', icon: '🌊' },
            { key: 'gopuram', label: 'West Gateway', icon: '🚪' },
            { key: 'annadanam', label: 'Annadanam Hall', icon: '🍲' },
            { key: 'turtle_deck', label: 'Turtle Deck', icon: '🐢' },
          ].map((preset) => (
            <button
              key={preset.key}
              type="button"
              onClick={() => handleApplyCameraPreset(preset.key)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                cameraPreset === preset.key
                  ? 'bg-[#55132D] text-[#E2BC6B] shadow-xs ring-1 ring-[#55132D]'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <span>{preset.icon}</span>
              <span>{preset.label}</span>
            </button>
          ))}
        </div>

        {/* Right: Lighting Atmosphere, Heatmap, Pilgrim Path & 360 Rotation */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-white/92 backdrop-blur-md p-1 rounded-xl border border-stone-200/90 shadow-sm">
          {/* Lighting Atmosphere Switcher */}
          <div className="flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200">
            <button
              type="button"
              onClick={() => setAtmosphere('day')}
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                atmosphere === 'day' ? 'bg-[#55132D] text-[#E2BC6B] shadow-xs' : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Serene Daylight Solar Radiance"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setAtmosphere('sunset')}
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                atmosphere === 'sunset' ? 'bg-[#55132D] text-[#E2BC6B] shadow-xs' : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Sandhya Aarti Sunset Golden Hour"
            >
              <Sunset className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setAtmosphere('night')}
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                atmosphere === 'night' ? 'bg-[#55132D] text-[#E2BC6B] shadow-xs' : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Night Aarti Surveillance"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Toggle Devotee Pilgrim Walkway Ribbon */}
          <button
            type="button"
            onClick={() => setShowPilgrimPath(!showPilgrimPath)}
            className={`px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              showPilgrimPath
                ? 'bg-[#55132D] text-[#E2BC6B] shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
            title="Toggle Devotee Sacred Pilgrimage Path Ribbon"
          >
            <Footprints className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Pilgrim Path</span>
          </button>

          {/* Toggle Tactical Coverage Heatmap */}
          <button
            type="button"
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              showHeatmap
                ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
            title="Toggle Tactical Patrol Coverage Heatmap"
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Coverage</span>
          </button>

          {/* Cinematic 360° Tour */}
          <button
            type="button"
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              isAutoRotating ? 'bg-[#55132D] text-[#E2BC6B]' : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
            }`}
            title="Cinematic 360° Architectural Drone Patrol"
          >
            {isAutoRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          {/* Reset Camera */}
          <button
            type="button"
            onClick={() => handleApplyCameraPreset('overview')}
            className="p-1.5 rounded-lg text-xs text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            title="Reset Campus View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* HOVER LANDMARK QUICK BADGE */}
      {hoveredLandmark && !hoveredOfficer && (
        <div className="absolute top-16 left-3.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#E2BC6B]/60 shadow-md text-xs pointer-events-none flex items-center gap-2 animate-in fade-in z-20">
          <span className="w-2 h-2 rounded-full bg-[#55132D]" />
          <div>
            <span className="font-bold font-serif text-stone-900 text-xs">{hoveredLandmark.name}</span>
            <span className="text-[10px] text-stone-500 block">{hoveredLandmark.style}</span>
          </div>
        </div>
      )}

      {/* SELECTED LANDMARK INTERACTIVE INSPECTOR CARD */}
      {selectedLandmark && (
        <div className="absolute bottom-16 right-3.5 max-w-sm bg-white/95 backdrop-blur-md rounded-2xl border border-[#E2BC6B]/70 p-4 shadow-xl text-xs space-y-2 z-20 animate-in slide-in-from-right duration-200">
          <div className="flex items-start justify-between gap-2 border-b border-stone-150 pb-2">
            <div>
              <div className="text-[10px] uppercase font-bold text-[#55132D] tracking-wider">
                Architectural Landmark Inspection
              </div>
              <h4 className="font-bold font-serif text-stone-900 text-sm mt-0.5">
                {selectedLandmark.name}
              </h4>
              <div className="text-[11px] text-[#801B42] font-semibold">
                {selectedLandmark.style}
              </div>
            </div>
            <button
              onClick={() => setSelectedLandmark(null)}
              className="text-stone-400 hover:text-stone-700 text-base font-bold p-1 cursor-pointer"
            >
              ×
            </button>
          </div>
          <p className="text-[11.5px] text-stone-600 leading-relaxed">
            {selectedLandmark.desc}
          </p>
          <div className="pt-2 border-t border-stone-150 flex items-center justify-between text-[11px]">
            <span className="text-stone-500 font-medium">
              Click 3D models to inspect features
            </span>
            <button
              type="button"
              onClick={() => handleApplyCameraPreset(selectedLandmark.key)}
              className="px-2.5 py-1 bg-[#55132D] text-[#E2BC6B] font-bold rounded-lg hover:bg-[#681B37] text-[10.5px] transition-colors cursor-pointer"
            >
              Focus 360°
            </button>
          </div>
        </div>
      )}

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
                <span className="font-mono bg-black/50 px-2 py-0.5 rounded text-amber-300">
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
          className="absolute z-40 bg-white/95 backdrop-blur-md text-stone-900 p-3.5 rounded-2xl border border-[#E2BC6B] shadow-xl pointer-events-none text-xs space-y-1.5 min-w-[220px]"
          style={{
            left: Math.min(hoveredScreenPos.x + 15, (containerRef.current?.clientWidth || 800) - 240),
            top: Math.max(hoveredScreenPos.y - 75, 20),
          }}
        >
          <div className="flex items-center justify-between border-b border-stone-200 pb-1.5">
            <span className="font-serif font-bold text-sm text-[#55132D]">{hoveredOfficer.name}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                hoveredOfficer.status === 'Active'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}
            >
              {hoveredOfficer.status}
            </span>
          </div>
          <div className="text-[11px] text-stone-600 flex items-center justify-between">
            <span>
              <strong>Role:</strong> {hoveredOfficer.role}
            </span>
            <span className="font-mono text-stone-400">{hoveredOfficer.id}</span>
          </div>
          <div className="text-[11px] text-stone-600">
            <strong>Zone:</strong> {hoveredOfficer.assignedZoneName || 'Campus Ground'}
          </div>
          <div className="text-[10px] text-stone-500 flex items-center justify-between pt-1 border-t border-stone-150">
            <span>Radio: {hoveredOfficer.radioChannel || 'CH-1'}</span>
            <span className="text-[#55132D] font-bold">Click to Inspect →</span>
          </div>
        </div>
      )}

      {/* BOTTOM LEFT: TACTICAL DEPARTMENT LEGEND (Light Theme Card) */}
      <div className="absolute bottom-3 left-3 bg-white/92 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-stone-200/90 text-stone-700 text-[11px] pointer-events-auto space-y-1.5 shadow-md">
        <div className="text-[10px] font-bold text-[#55132D] uppercase tracking-wider">
          Stationed Tactical Units
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" /> Security &amp; Police
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A855F7]" /> Queue &amp; Crowd
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C]" /> Lake &amp; Safety
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /> Sevadal
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" /> Help Desk
          </span>
        </div>
        <div className="text-[10px] text-stone-500 border-t border-stone-200 pt-1">
          Left Drag: Rotate 360° • Right Drag: Pan • Scroll: Zoom • Click Landmark: Inspect Details
        </div>
      </div>

      {/* BOTTOM RIGHT: SACRED HERITAGE WATERMARK */}
      <div className="absolute bottom-3 right-3 bg-white/92 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-200/90 text-[10px] text-stone-600 pointer-events-none flex items-center gap-2 shadow-sm font-medium">
        <Compass className="w-3.5 h-3.5 text-[#55132D] animate-[spin_10s_linear_infinite]" />
        <span>EST. 1501 CE • MAHARAJA DHANYA MANIKYA • 51 SHAKTI PEETHAS</span>
      </div>
    </div>
  );
}
