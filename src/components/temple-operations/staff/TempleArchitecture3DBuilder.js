import * as THREE from 'three';

/**
 * TempleArchitecture3DBuilder:
 * Authentic 3D Architectural Builder for Mata Tripura Sundari Temple (Matabari),
 * one of the 51 Shakti Peethas located in Udaipur, Tripura. Built in 1501 CE
 * by Maharaja Dhanya Manikya in traditional Bengali Char-Chala style atop the
 * Kurma-pitha (tortoise-shaped mound) alongside the sacred Kalyan Sagar lake.
 */

// Procedural texture generators for rich visual fidelity
function createTerracottaBrickTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Base terracotta clay color
  ctx.fillStyle = '#9C3D26';
  ctx.fillRect(0, 0, 512, 512);

  // Brick grid with lime mortar grooves
  ctx.strokeStyle = '#D8C7B0';
  ctx.lineWidth = 4;
  const brickH = 32;
  const brickW = 64;

  for (let y = 0; y < 512; y += brickH) {
    const row = Math.floor(y / brickH);
    const offsetX = (row % 2) * (brickW / 2);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();

    for (let x = -brickW; x < 512 + brickW; x += brickW) {
      ctx.beginPath();
      ctx.moveTo(x + offsetX, y);
      ctx.lineTo(x + offsetX, y + brickH);
      ctx.stroke();
    }
  }

  // Subtle weathered noise
  for (let i = 0; i < 4000; i++) {
    const nx = Math.random() * 512;
    const ny = Math.random() * 512;
    const alpha = Math.random() * 0.15;
    ctx.fillStyle = Math.random() > 0.5 ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha})`;
    ctx.fillRect(nx, ny, 2, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

function createPavedStoneTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#E3DBCF';
  ctx.fillRect(0, 0, 512, 512);

  // Stone tile slabs
  ctx.strokeStyle = '#B5A998';
  ctx.lineWidth = 3;
  const tileSize = 64;
  for (let x = 0; x < 512; x += tileSize) {
    for (let y = 0; y < 512; y += tileSize) {
      ctx.strokeRect(x, y, tileSize, tileSize);
      if ((x + y) % 128 === 0) {
        ctx.fillStyle = 'rgba(180, 160, 140, 0.15)';
        ctx.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  return texture;
}

function createWaterCausticsTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0F5868';
  ctx.fillRect(0, 0, 256, 256);

  // Soft rippling caustic lines
  ctx.strokeStyle = 'rgba(165, 243, 252, 0.35)';
  ctx.lineWidth = 2.5;
  for (let i = 0; i < 40; i++) {
    ctx.beginPath();
    const cx = Math.random() * 256;
    const cy = Math.random() * 256;
    const r = 15 + Math.random() * 35;
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}

/**
 * Builds the entire Mata Tripura Sundari Temple architectural campus
 * @param {THREE.Scene} scene
 * @param {Function} scaleX - D3 linear scale for X
 * @param {Function} scaleZ - D3 linear scale for Z
 * @returns {Object} References to dynamic animated meshes (turtles, flag, water)
 */
export function buildTempleCampus(scene, scaleX, scaleZ) {
  const campusGroup = new THREE.Group();
  campusGroup.name = 'templeCampusComplete';

  // Shared Procedural Textures & Materials
  const terracottaTex = createTerracottaBrickTexture();
  const stoneTex = createPavedStoneTexture();
  const waterTex = createWaterCausticsTexture();

  const terracottaMat = new THREE.MeshStandardMaterial({
    map: terracottaTex,
    color: 0xA6442E,
    roughness: 0.65,
    metalness: 0.08,
  });

  const stonePavedMat = new THREE.MeshStandardMaterial({
    map: stoneTex,
    color: 0xE8E2D6,
    roughness: 0.75,
    metalness: 0.05,
  });

  const goldKalasaMat = new THREE.MeshStandardMaterial({
    color: 0xF3C64D,
    roughness: 0.25,
    metalness: 0.85,
    emissive: 0x664B10,
    emissiveIntensity: 0.25,
  });

  const whiteMarbleTrimMat = new THREE.MeshStandardMaterial({
    color: 0xF5F0E6,
    roughness: 0.5,
  });

  const darkWoodMat = new THREE.MeshStandardMaterial({
    color: 0x3D2314,
    roughness: 0.8,
  });

  const lawnGreenMat = new THREE.MeshStandardMaterial({
    color: 0x3E5E32,
    roughness: 0.9,
  });

  const waterMat = new THREE.MeshStandardMaterial({
    map: waterTex,
    color: 0x0E7490,
    roughness: 0.15,
    metalness: 0.35,
    transparent: true,
    opacity: 0.88,
  });

  // Coordinates for core landmarks (mapped via D3 scales)
  const sanctumPos = { x: scaleX(640), z: scaleZ(335) };
  const lakePos = { x: scaleX(820), z: scaleZ(540) };
  const gopuramPos = { x: scaleX(140), z: scaleZ(370) };
  const annadanamPos = { x: scaleX(540), z: scaleZ(570) };
  const melaPos = { x: scaleX(330), z: scaleZ(160) };

  // =========================================================================
  // 1. KURMA-PITHA SACRED HILLOCK (Tortoise-Mound Base & Terraces)
  // =========================================================================
  const kurmaGroup = new THREE.Group();
  kurmaGroup.name = 'kurmaPithaMound';

  // Base campus ground slab (Lower Campus Level Y = 0)
  const groundSlabGeo = new THREE.BoxGeometry(108, 1.2, 76);
  const groundSlabMesh = new THREE.Mesh(groundSlabGeo, lawnGreenMat);
  groundSlabMesh.position.y = -0.6;
  groundSlabMesh.receiveShadow = true;
  kurmaGroup.add(groundSlabMesh);

  // Paved central plaza apron around mound
  const plazaApronGeo = new THREE.CylinderGeometry(34, 38, 0.4, 48);
  const plazaApronMesh = new THREE.Mesh(plazaApronGeo, stonePavedMat);
  plazaApronMesh.position.set(sanctumPos.x, 0.2, sanctumPos.z);
  plazaApronMesh.receiveShadow = true;
  kurmaGroup.add(plazaApronMesh);

  // Terraced Hillock Level 1: Outer Mound Terrace (Y = 0.4 to 1.6)
  const moundTier1Geo = new THREE.CylinderGeometry(26, 29, 1.2, 48);
  const moundTier1Mesh = new THREE.Mesh(moundTier1Geo, stonePavedMat);
  moundTier1Mesh.position.set(sanctumPos.x, 0.8, sanctumPos.z);
  moundTier1Mesh.castShadow = true;
  moundTier1Mesh.receiveShadow = true;
  kurmaGroup.add(moundTier1Mesh);

  // Terraced Hillock Level 2: Kurma-Peetha Upper Sacred Plinth (Y = 1.4 to 3.2)
  const kurmaPlinthGeo = new THREE.CylinderGeometry(17, 19, 1.6, 40);
  const kurmaPlinthMesh = new THREE.Mesh(kurmaPlinthGeo, whiteMarbleTrimMat);
  kurmaPlinthMesh.position.set(sanctumPos.x, 2.2, sanctumPos.z);
  kurmaPlinthMesh.castShadow = true;
  kurmaPlinthMesh.receiveShadow = true;
  kurmaGroup.add(kurmaPlinthMesh);

  // Ornate decorative balustrade around Kurma plinth perimeter
  const balustradeRailGeo = new THREE.TorusGeometry(17.5, 0.22, 8, 48);
  balustradeRailGeo.rotateX(Math.PI / 2);
  const balustradeMesh = new THREE.Mesh(balustradeRailGeo, goldKalasaMat);
  balustradeMesh.position.set(sanctumPos.x, 3.4, sanctumPos.z);
  kurmaGroup.add(balustradeMesh);

  // Stone Balusters along plinth
  const numBalusters = 36;
  for (let i = 0; i < numBalusters; i++) {
    const angle = (i / numBalusters) * Math.PI * 2;
    // Leave gap for west stairs
    if (Math.abs(angle - Math.PI) < 0.28) continue;
    const bx = sanctumPos.x + Math.cos(angle) * 17.5;
    const bz = sanctumPos.z + Math.sin(angle) * 17.5;
    const bGeo = new THREE.CylinderGeometry(0.12, 0.16, 0.8, 8);
    const bMesh = new THREE.Mesh(bGeo, whiteMarbleTrimMat);
    bMesh.position.set(bx, 3.0, bz);
    kurmaGroup.add(bMesh);
  }

  // Grand Western Approach Flight of Stairs up the Kurma Mound
  const numSteps = 7;
  for (let s = 0; s < numSteps; s++) {
    const stepW = 8.5 - s * 0.2;
    const stepH = 0.35;
    const stepD = 1.2;
    const stepGeo = new THREE.BoxGeometry(stepD, stepH, stepW);
    const stepMesh = new THREE.Mesh(stepGeo, stonePavedMat);
    stepMesh.position.set(sanctumPos.x - 17.2 - s * 1.0, 0.4 + s * stepH, sanctumPos.z);
    stepMesh.castShadow = true;
    stepMesh.receiveShadow = true;
    kurmaGroup.add(stepMesh);
  }

  // Flanking Guardian Lion / Vyala Statues at staircase entry
  [-4.8, 4.8].forEach((offsetZ) => {
    const lionPedestal = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 1.4), terracottaMat);
    lionPedestal.position.set(sanctumPos.x - 24.5, 0.6, sanctumPos.z + offsetZ);
    lionPedestal.castShadow = true;
    kurmaGroup.add(lionPedestal);

    const lionStatue = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.4, 0.9), goldKalasaMat);
    lionStatue.position.set(sanctumPos.x - 24.5, 1.8, sanctumPos.z + offsetZ);
    lionStatue.castShadow = true;
    kurmaGroup.add(lionStatue);
  });

  campusGroup.add(kurmaGroup);

  // =========================================================================
  // 2. MAIN SANCTUM: CHAR-CHALA TERRACOTTA SHIKHARA & GARBHAGRIHA
  // =========================================================================
  const sanctumGroup = new THREE.Group();
  sanctumGroup.name = 'mainSanctumGarbhagriha';

  const plinthY = 3.0; // Top of sacred Kurma plinth

  // Sanctum Foundation Sub-Plinth (Upapitha with molded cornice)
  const subPlinthGeo = new THREE.BoxGeometry(12.5, 1.0, 12.5);
  const subPlinthMesh = new THREE.Mesh(subPlinthGeo, whiteMarbleTrimMat);
  subPlinthMesh.position.set(sanctumPos.x, plinthY + 0.5, sanctumPos.z);
  subPlinthMesh.castShadow = true;
  subPlinthMesh.receiveShadow = true;
  sanctumGroup.add(subPlinthMesh);

  // Core Garbhagriha Walls (Fired terracotta with ornate corner pilasters)
  const garbhagrihaGeo = new THREE.BoxGeometry(10.5, 7.5, 10.5);
  const garbhagrihaMesh = new THREE.Mesh(garbhagrihaGeo, terracottaMat);
  garbhagrihaMesh.position.set(sanctumPos.x, plinthY + 4.75, sanctumPos.z);
  garbhagrihaMesh.castShadow = true;
  garbhagrihaMesh.receiveShadow = true;
  sanctumGroup.add(garbhagrihaMesh);

  // Decorative White Cornice Bands across temple facade
  [plinthY + 1.2, plinthY + 5.2, plinthY + 8.4].forEach((cy) => {
    const corniceGeo = new THREE.BoxGeometry(11.2, 0.35, 11.2);
    const corniceMesh = new THREE.Mesh(corniceGeo, whiteMarbleTrimMat);
    corniceMesh.position.set(sanctumPos.x, cy, sanctumPos.z);
    sanctumGroup.add(corniceMesh);
  });

  // Authentic Bengali Char-Chala 4-Curved Eaves Roof Structure:
  // Medieval Bengal/Tripura Char-Chala features distinct outward sweeping curved eaves
  const chalaLowerGeo = new THREE.ConeGeometry(9.6, 5.2, 4);
  chalaLowerGeo.rotateY(Math.PI / 4);
  const chalaLowerMesh = new THREE.Mesh(chalaLowerGeo, terracottaMat);
  chalaLowerMesh.position.set(sanctumPos.x, plinthY + 11.0, sanctumPos.z);
  chalaLowerMesh.castShadow = true;
  sanctumGroup.add(chalaLowerMesh);

  // Swept Vault Eaves Trim (Curvilinear roof trim)
  const eaveTrimGeo = new THREE.BoxGeometry(12.6, 0.4, 12.6);
  eaveTrimGeo.rotateY(Math.PI / 4);
  const eaveTrimMesh = new THREE.Mesh(eaveTrimGeo, whiteMarbleTrimMat);
  eaveTrimMesh.position.set(sanctumPos.x, plinthY + 8.6, sanctumPos.z);
  sanctumGroup.add(eaveTrimMesh);

  // Upper Conical Stupa-Shikhara / Ek-Ratna Dome Tower (Signature Matabari conical spire)
  const shikharaDomeGeo = new THREE.CylinderGeometry(1.6, 6.2, 6.8, 32);
  const shikharaDomeMesh = new THREE.Mesh(shikharaDomeGeo, terracottaMat);
  shikharaDomeMesh.position.set(sanctumPos.x, plinthY + 14.2, sanctumPos.z);
  shikharaDomeMesh.castShadow = true;
  sanctumGroup.add(shikharaDomeMesh);

  // Ribbed Amalaka Ring
  const amalakaGeo = new THREE.TorusGeometry(2.2, 0.65, 12, 32);
  amalakaGeo.rotateX(Math.PI / 2);
  const amalakaMesh = new THREE.Mesh(amalakaGeo, whiteMarbleTrimMat);
  amalakaMesh.position.set(sanctumPos.x, plinthY + 17.6, sanctumPos.z);
  sanctumGroup.add(amalakaMesh);

  // 16-Petal Gilded Lotus Base (Padmapitha)
  const lotusBaseGeo = new THREE.CylinderGeometry(1.8, 2.3, 0.7, 16);
  const lotusBaseMesh = new THREE.Mesh(lotusBaseGeo, goldKalasaMat);
  lotusBaseMesh.position.set(sanctumPos.x, plinthY + 18.2, sanctumPos.z);
  sanctumGroup.add(lotusBaseMesh);

  // Gilded Kalasha Finial (Sacred Urn of Immortality)
  const kalashaGeo = new THREE.SphereGeometry(1.1, 24, 24);
  const kalashaMesh = new THREE.Mesh(kalashaGeo, goldKalasaMat);
  kalashaMesh.position.set(sanctumPos.x, plinthY + 19.3, sanctumPos.z);
  sanctumGroup.add(kalashaMesh);

  // Sacred Brass Trishula (Trident) at the Temple Apex
  const trishulaRodGeo = new THREE.CylinderGeometry(0.12, 0.12, 3.2, 12);
  const trishulaRodMesh = new THREE.Mesh(trishulaRodGeo, goldKalasaMat);
  trishulaRodMesh.position.set(sanctumPos.x, plinthY + 21.2, sanctumPos.z);
  sanctumGroup.add(trishulaRodMesh);

  // Trident Prongs
  const prongGeo = new THREE.TorusGeometry(0.8, 0.08, 8, 16, Math.PI);
  prongGeo.rotateX(Math.PI);
  const prongMesh = new THREE.Mesh(prongGeo, goldKalasaMat);
  prongMesh.position.set(sanctumPos.x, plinthY + 22.4, sanctumPos.z);
  sanctumGroup.add(prongMesh);

  // Animated Saffron Temple Flag (Dhwaja) fluttering in breeze
  const flagGeo = new THREE.PlaneGeometry(1.8, 1.1, 8, 4);
  const flagMat = new THREE.MeshStandardMaterial({
    color: 0xF97316, // Saffron
    side: THREE.DoubleSide,
    roughness: 0.3,
  });
  const flagMesh = new THREE.Mesh(flagGeo, flagMat);
  flagMesh.position.set(sanctumPos.x + 0.9, plinthY + 22.0, sanctumPos.z);
  flagMesh.name = 'templeFlag';
  sanctumGroup.add(flagMesh);

  // West Arched Portal / Entrance Porch with Ornate Brass Door
  const doorArchGeo = new THREE.BoxGeometry(1.6, 5.0, 3.8);
  const doorArchMesh = new THREE.Mesh(doorArchGeo, darkWoodMat);
  doorArchMesh.position.set(sanctumPos.x - 5.1, plinthY + 3.5, sanctumPos.z);
  doorArchMesh.castShadow = true;
  sanctumGroup.add(doorArchMesh);

  // Brass Door Trim & Ornate Handle
  const doorGiltGeo = new THREE.BoxGeometry(0.2, 4.4, 3.2);
  const doorGiltMesh = new THREE.Mesh(doorGiltGeo, goldKalasaMat);
  doorGiltMesh.position.set(sanctumPos.x - 5.9, plinthY + 3.5, sanctumPos.z);
  sanctumGroup.add(doorGiltMesh);

  // Hanging Brass Temple Bells (Ghanta) at the entrance
  [-1.1, 1.1].forEach((bz) => {
    const chainGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.4, 8);
    const chainMesh = new THREE.Mesh(chainGeo, goldKalasaMat);
    chainMesh.position.set(sanctumPos.x - 6.2, plinthY + 5.5, sanctumPos.z + bz);
    sanctumGroup.add(chainMesh);

    const bellGeo = new THREE.ConeGeometry(0.35, 0.6, 12);
    const bellMesh = new THREE.Mesh(bellGeo, goldKalasaMat);
    bellMesh.position.set(sanctumPos.x - 6.2, plinthY + 4.6, sanctumPos.z + bz);
    sanctumGroup.add(bellMesh);
  });

  // Akhanda Jyoti: Warm flickering golden sanctum light casting glow out through portal
  const sanctumInnerLight = new THREE.PointLight(0xF59E0B, 3.2, 28);
  sanctumInnerLight.position.set(sanctumPos.x - 3.0, plinthY + 4.0, sanctumPos.z);
  sanctumInnerLight.castShadow = true;
  sanctumGroup.add(sanctumInnerLight);

  campusGroup.add(sanctumGroup);

  // =========================================================================
  // 3. THE NATMANDIR (Congregational Bhajan & Assembly Hall)
  // =========================================================================
  const natmandirGroup = new THREE.Group();
  natmandirGroup.name = 'natmandirAssemblyHall';

  const natmandirX = sanctumPos.x - 12.0;
  const natmandirZ = sanctumPos.z;

  // Natmandir Plinth Floor
  const natmandirFloorGeo = new THREE.BoxGeometry(10.5, 0.5, 12.0);
  const natmandirFloorMesh = new THREE.Mesh(natmandirFloorGeo, stonePavedMat);
  natmandirFloorMesh.position.set(natmandirX, plinthY + 0.25, natmandirZ);
  natmandirFloorMesh.receiveShadow = true;
  natmandirGroup.add(natmandirFloorMesh);

  // Red Pilgrim Runner Carpet in the center of Natmandir
  const carpetGeo = new THREE.PlaneGeometry(8.5, 3.2);
  carpetGeo.rotateX(-Math.PI / 2);
  const carpetMat = new THREE.MeshStandardMaterial({ color: 0x881337, roughness: 0.9 });
  const carpetMesh = new THREE.Mesh(carpetGeo, carpetMat);
  carpetMesh.position.set(natmandirX, plinthY + 0.52, natmandirZ);
  natmandirGroup.add(carpetMesh);

  // 12 Sculpted Stone Pillars Supporting the Natmandir Roof
  const pillarRows = [-4.0, 0, 4.0];
  const pillarCols = [-4.6, 4.6];
  pillarRows.forEach((pz) => {
    pillarCols.forEach((px) => {
      // Column Base
      const colBaseGeo = new THREE.BoxGeometry(0.9, 0.4, 0.9);
      const colBase = new THREE.Mesh(colBaseGeo, whiteMarbleTrimMat);
      colBase.position.set(natmandirX + px, plinthY + 0.7, natmandirZ + pz);
      natmandirGroup.add(colBase);

      // Shaft
      const colShaftGeo = new THREE.CylinderGeometry(0.32, 0.36, 4.8, 12);
      const colShaft = new THREE.Mesh(colShaftGeo, stonePavedMat);
      colShaft.position.set(natmandirX + px, plinthY + 3.2, natmandirZ + pz);
      colShaft.castShadow = true;
      natmandirGroup.add(colShaft);

      // Bracket Capital
      const colCapGeo = new THREE.BoxGeometry(1.0, 0.35, 1.0);
      const colCap = new THREE.Mesh(colCapGeo, goldKalasaMat);
      colCap.position.set(natmandirX + px, plinthY + 5.7, natmandirZ + pz);
      natmandirGroup.add(colCap);
    });
  });

  // Stepped Pyramidal Roof (Pidha-deula style assembly canopy)
  const roofTiers = [
    { w: 12.0, d: 13.5, h: 0.8, y: plinthY + 6.2 },
    { w: 9.8, d: 11.2, h: 0.8, y: plinthY + 7.0 },
    { w: 7.2, d: 8.5, h: 0.8, y: plinthY + 7.8 },
  ];
  roofTiers.forEach((tier) => {
    const tierGeo = new THREE.BoxGeometry(tier.w, tier.h, tier.d);
    const tierMesh = new THREE.Mesh(tierGeo, terracottaMat);
    tierMesh.position.set(natmandirX, tier.y, natmandirZ);
    tierMesh.castShadow = true;
    natmandirGroup.add(tierMesh);
  });

  // Crown Finial atop Natmandir
  const natFinialGeo = new THREE.ConeGeometry(0.7, 1.8, 8);
  const natFinialMesh = new THREE.Mesh(natFinialGeo, goldKalasaMat);
  natFinialMesh.position.set(natmandirX, plinthY + 9.2, natmandirZ);
  natmandirGroup.add(natFinialMesh);

  campusGroup.add(natmandirGroup);

  // =========================================================================
  // 4. CONCENTRIC PARIKRAMA (Circumambulatory Colonnade & Deepa-Stambhas)
  // =========================================================================
  const parikramaGroup = new THREE.Group();
  parikramaGroup.name = 'concentricParikrama';

  const parikramaRadiusInner = 20.0;
  const parikramaRadiusOuter = 23.5;
  const numColonnadePillars = 28;

  for (let i = 0; i < numColonnadePillars; i++) {
    const angle = (i / numColonnadePillars) * Math.PI * 2;
    // Don't obstruct west main entrance staircase
    if (Math.abs(angle - Math.PI) < 0.22) continue;

    const px = sanctumPos.x + Math.cos(angle) * parikramaRadiusInner;
    const pz = sanctumPos.z + Math.sin(angle) * parikramaRadiusInner * 0.88;

    const pGeo = new THREE.CylinderGeometry(0.28, 0.32, 3.8, 8);
    const pMesh = new THREE.Mesh(pGeo, stonePavedMat);
    pMesh.position.set(px, 2.7, pz);
    pMesh.castShadow = true;
    parikramaGroup.add(pMesh);
  }

  // Covered Parikrama Walkway Canopy Ring
  const canopyRingGeo = new THREE.TorusGeometry(parikramaRadiusInner, 1.1, 8, 48);
  canopyRingGeo.rotateX(Math.PI / 2);
  const canopyRingMesh = new THREE.Mesh(canopyRingGeo, terracottaMat);
  canopyRingMesh.position.set(sanctumPos.x, 4.6, sanctumPos.z);
  canopyRingMesh.scale.set(1, 0.88, 1);
  canopyRingMesh.castShadow = true;
  parikramaGroup.add(canopyRingMesh);

  // Four Cardinal Deepa-Stambhas (Multi-Tiered Sacred Stone Lamp Pillars)
  const cardinalOffsets = [
    { angle: 0, label: 'East' },
    { angle: Math.PI / 2, label: 'South' },
    { angle: -Math.PI / 2, label: 'North' },
    { angle: Math.PI * 0.85, label: 'South-West' },
  ];
  cardinalOffsets.forEach((card) => {
    const lx = sanctumPos.x + Math.cos(card.angle) * 26.5;
    const lz = sanctumPos.z + Math.sin(card.angle) * 23.5;

    // Multi-tiered stone pillar
    const stambhaGeo = new THREE.CylinderGeometry(0.35, 0.65, 6.2, 12);
    const stambhaMesh = new THREE.Mesh(stambhaGeo, whiteMarbleTrimMat);
    stambhaMesh.position.set(lx, 3.5, lz);
    stambhaMesh.castShadow = true;
    parikramaGroup.add(stambhaMesh);

    // Lamp bowls on tiers
    [2.2, 4.2, 5.8].forEach((ly) => {
      const bowlGeo = new THREE.TorusGeometry(0.75, 0.12, 6, 16);
      bowlGeo.rotateX(Math.PI / 2);
      const bowlMesh = new THREE.Mesh(bowlGeo, goldKalasaMat);
      bowlMesh.position.set(lx, ly, lz);
      parikramaGroup.add(bowlMesh);
    });

    // Flickering eternal oil lamp glow
    const lampGlow = new THREE.PointLight(0xF59E0B, 1.2, 10);
    lampGlow.position.set(lx, 6.8, lz);
    parikramaGroup.add(lampGlow);
  });

  campusGroup.add(parikramaGroup);

  // =========================================================================
  // 5. KALYAN SAGAR SACRED LAKE & STEPPED STONE GHATS
  // =========================================================================
  const lakeGroup = new THREE.Group();
  lakeGroup.name = 'kalyanSagarLakeComplex';

  // Sunken Lake Basin with Depth (Y = -2.8 to 0.2)
  const basinGeo = new THREE.CylinderGeometry(18.5, 20.0, 2.8, 48);
  const basinMat = new THREE.MeshStandardMaterial({ color: 0x0A2B36, roughness: 0.9 });
  const basinMesh = new THREE.Mesh(basinGeo, basinMat);
  basinMesh.position.set(lakePos.x, -1.2, lakePos.z);
  lakeGroup.add(basinMesh);

  // Water Surface Plane (Translucent animated cyan-teal water)
  const lakeWaterGeo = new THREE.CylinderGeometry(18.2, 18.2, 0.2, 48);
  const lakeWaterMesh = new THREE.Mesh(lakeWaterGeo, waterMat);
  lakeWaterMesh.position.set(lakePos.x, 0.15, lakePos.z);
  lakeWaterMesh.name = 'kalyanWaterMesh';
  lakeGroup.add(lakeWaterMesh);

  // 4 Concentric Tiers of Stepped Stone Ghats (Devotees descend to water)
  const ghatSteps = [
    { inner: 18.2, outer: 19.8, y: 0.35 },
    { inner: 19.8, outer: 21.4, y: 0.70 },
    { inner: 21.4, outer: 23.0, y: 1.05 },
    { inner: 23.0, outer: 24.6, y: 1.40 },
  ];
  ghatSteps.forEach((step) => {
    const ringGeo = new THREE.RingGeometry(step.inner, step.outer, 48);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMesh = new THREE.Mesh(ringGeo, stonePavedMat);
    ringMesh.position.set(lakePos.x, step.y, lakePos.z);
    ringMesh.receiveShadow = true;
    lakeGroup.add(ringMesh);
  });

  // Ghat Safety Perimeter Stanchions & Life-Saving Ring Stations
  const numGhatPosts = 20;
  for (let i = 0; i < numGhatPosts; i++) {
    const angle = (i / numGhatPosts) * Math.PI * 2;
    const px = lakePos.x + Math.cos(angle) * 24.2;
    const pz = lakePos.z + Math.sin(angle) * 24.2;

    const postGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.2, 8);
    const postMesh = new THREE.Mesh(postGeo, goldKalasaMat);
    postMesh.position.set(px, 1.9, pz);
    lakeGroup.add(postMesh);

    // Lifebuoy rescue ring at specific intervals
    if (i % 5 === 0) {
      const buoyGeo = new THREE.TorusGeometry(0.45, 0.12, 8, 16);
      const buoyMat = new THREE.MeshStandardMaterial({ color: 0xEA580C, roughness: 0.3 }); // Safety Orange
      const buoyMesh = new THREE.Mesh(buoyGeo, buoyMat);
      buoyMesh.position.set(px, 2.1, pz);
      lakeGroup.add(buoyMesh);
    }
  }

  // Animated 3D Sacred Bostami Softshell Turtles Swimming in the Lake
  const turtles = [];
  const turtlePositions = [
    { angle: 0.4, dist: 8.5, speed: 0.4, scale: 1.0 },
    { angle: 2.1, dist: 12.0, speed: -0.3, scale: 0.8 },
    { angle: 4.2, dist: 6.8, speed: 0.5, scale: 1.2 },
    { angle: 5.4, dist: 14.5, speed: -0.35, scale: 0.9 },
  ];

  const turtleShellMat = new THREE.MeshStandardMaterial({ color: 0x243E36, roughness: 0.7 });
  const turtleSkinMat = new THREE.MeshStandardMaterial({ color: 0x476A5A, roughness: 0.6 });

  turtlePositions.forEach((tp, idx) => {
    const tGroup = new THREE.Group();
    tGroup.name = `bostamiTurtle_${idx}`;
    tGroup.userData = { ...tp, baseAngle: tp.angle };

    // Shell (Carapace - flattened dome)
    const shellGeo = new THREE.SphereGeometry(1.2, 16, 12);
    shellGeo.scale(1.0, 0.35, 1.3);
    const shell = new THREE.Mesh(shellGeo, turtleShellMat);
    tGroup.add(shell);

    // Head
    const headGeo = new THREE.SphereGeometry(0.35, 12, 12);
    headGeo.scale(0.8, 0.6, 1.2);
    const head = new THREE.Mesh(headGeo, turtleSkinMat);
    head.position.set(0, 0.05, 1.5);
    tGroup.add(head);

    // Flippers
    [-0.9, 0.9].forEach((fx) => {
      const flipperGeo = new THREE.BoxGeometry(0.7, 0.08, 0.4);
      const flipper = new THREE.Mesh(flipperGeo, turtleSkinMat);
      flipper.position.set(fx, -0.05, 0.7);
      flipper.rotation.z = fx > 0 ? -0.3 : 0.3;
      tGroup.add(flipper);
    });

    tGroup.scale.set(tp.scale, tp.scale, tp.scale);
    tGroup.position.set(
      lakePos.x + Math.cos(tp.angle) * tp.dist,
      0.18,
      lakePos.z + Math.sin(tp.angle) * tp.dist
    );

    lakeGroup.add(tGroup);
    turtles.push(tGroup);
  });

  campusGroup.add(lakeGroup);

  // =========================================================================
  // 6. WEST TORANA GOPURAM (Grand Main Gateway & Security Turnstiles)
  // =========================================================================
  const gopuramGroup = new THREE.Group();
  gopuramGroup.name = 'westToranaGopuram';

  const gX = gopuramPos.x;
  const gZ = gopuramPos.z;

  // Twin Flanking Terracotta Gateway Towers
  [-4.8, 4.8].forEach((offsetZ) => {
    // 3-tiered gateway pylon
    const pylonLower = new THREE.Mesh(new THREE.BoxGeometry(4.2, 6.0, 3.6), terracottaMat);
    pylonLower.position.set(gX, 3.0, gZ + offsetZ);
    pylonLower.castShadow = true;
    gopuramGroup.add(pylonLower);

    const pylonUpper = new THREE.Mesh(new THREE.BoxGeometry(3.4, 4.2, 2.8), terracottaMat);
    pylonUpper.position.set(gX, 8.1, gZ + offsetZ);
    pylonUpper.castShadow = true;
    gopuramGroup.add(pylonUpper);

    // Pyramidal Cap with Golden Finial
    const pylonCap = new THREE.Mesh(new THREE.ConeGeometry(2.0, 2.5, 4), goldKalasaMat);
    pylonCap.rotateY(Math.PI / 4);
    pylonCap.position.set(gX, 11.4, gZ + offsetZ);
    gopuramGroup.add(pylonCap);
  });

  // Central Grand Arched Lintel Beam
  const lintelGeo = new THREE.BoxGeometry(4.4, 2.2, 9.8);
  const lintelMesh = new THREE.Mesh(lintelGeo, terracottaMat);
  lintelMesh.position.set(gX, 7.1, gZ);
  lintelMesh.castShadow = true;
  gopuramGroup.add(lintelMesh);

  // Golden Inscription Plaque above Archway
  const plaqueGeo = new THREE.BoxGeometry(0.2, 1.2, 7.0);
  const plaqueMesh = new THREE.Mesh(plaqueGeo, goldKalasaMat);
  plaqueMesh.position.set(gX - 2.25, 7.1, gZ);
  gopuramGroup.add(plaqueMesh);

  // 4 Multi-Lane Security Turnstile Gates
  [-2.2, -0.7, 0.7, 2.2].forEach((tz) => {
    const turnstileGeo = new THREE.BoxGeometry(1.4, 1.3, 0.4);
    const turnstileMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });
    const turnstileMesh = new THREE.Mesh(turnstileGeo, turnstileMat);
    turnstileMesh.position.set(gX, 0.65, gZ + tz);
    gopuramGroup.add(turnstileMesh);

    // Green/Red LED pass indicator
    const ledGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x10B981 });
    const ledMesh = new THREE.Mesh(ledGeo, ledMat);
    ledMesh.position.set(gX, 1.35, gZ + tz);
    gopuramGroup.add(ledMesh);
  });

  campusGroup.add(gopuramGroup);

  // =========================================================================
  // 7. ANNADANAM MAHAPRASAD DINING COMPLEX
  // =========================================================================
  const annadanamGroup = new THREE.Group();
  annadanamGroup.name = 'annadanamDiningComplex';

  const aX = annadanamPos.x;
  const aZ = annadanamPos.z;

  // Hall Main Structure
  const hallBase = new THREE.Mesh(new THREE.BoxGeometry(18.0, 5.0, 11.0), terracottaMat);
  hallBase.position.set(aX, 2.5, aZ);
  hallBase.castShadow = true;
  hallBase.receiveShadow = true;
  annadanamGroup.add(hallBase);

  // Gable Sloping Roof
  const hallRoofGeo = new THREE.ConeGeometry(13.5, 4.0, 4);
  hallRoofGeo.rotateY(Math.PI / 4);
  hallRoofGeo.scale(1.3, 1.0, 0.85);
  const hallRoof = new THREE.Mesh(hallRoofGeo, terracottaMat);
  hallRoof.position.set(aX, 7.0, aZ);
  hallRoof.castShadow = true;
  annadanamGroup.add(hallRoof);

  // Open Service Veranda Pillars
  [-7.0, -3.5, 0, 3.5, 7.0].forEach((vx) => {
    const vCol = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 3.6, 8), stonePavedMat);
    vCol.position.set(aX + vx, 1.8, aZ - 6.0);
    annadanamGroup.add(vCol);
  });

  campusGroup.add(annadanamGroup);

  // =========================================================================
  // 8. NORTH BARRIER-FREE WHEELCHAIR RAMP
  // =========================================================================
  const rampGroup = new THREE.Group();
  rampGroup.name = 'northBarrierFreeRamp';

  const rampStartX = sanctumPos.x - 14.0;
  const rampEndX = sanctumPos.x + 2.0;
  const rampZ = sanctumPos.z - 16.0;

  // Sloping Ramp Slab (Rising from Y = 0.4 to 3.0)
  const rampGeo = new THREE.BoxGeometry(16.0, 0.35, 3.2);
  const rampMat = new THREE.MeshStandardMaterial({ color: 0x065F46, roughness: 0.8 }); // Green tactile non-slip
  const rampMesh = new THREE.Mesh(rampGeo, rampMat);
  rampMesh.position.set((rampStartX + rampEndX) / 2, 1.7, rampZ);
  rampMesh.rotation.z = -0.16; // Sloping upward toward sanctum
  rampMesh.castShadow = true;
  rampMesh.receiveShadow = true;
  rampGroup.add(rampMesh);

  // Yellow Safety Handrails
  [-1.5, 1.5].forEach((rz) => {
    const railGeo = new THREE.CylinderGeometry(0.06, 0.06, 16.0, 8);
    const railMat = new THREE.MeshStandardMaterial({ color: 0xEAB308, metalness: 0.7 });
    const railMesh = new THREE.Mesh(railGeo, railMat);
    railMesh.position.set((rampStartX + rampEndX) / 2, 2.6, rampZ + rz);
    railMesh.rotation.z = -0.16 + Math.PI / 2;
    rampGroup.add(railMesh);
  });

  campusGroup.add(rampGroup);

  // =========================================================================
  // 9. DIWALI MELA FESTIVAL GROUNDS & CANOPY STALLS
  // =========================================================================
  const melaGroup = new THREE.Group();
  melaGroup.name = 'diwaliMelaGrounds';

  const stallColors = [0xDC2626, 0xD97706, 0x059669, 0x2563EB, 0x7C3AED];
  const stallPositions = [
    { x: melaPos.x - 7.0, z: melaPos.z - 3.0 },
    { x: melaPos.x - 2.0, z: melaPos.z - 3.0 },
    { x: melaPos.x + 3.0, z: melaPos.z - 3.0 },
    { x: melaPos.x - 5.0, z: melaPos.z + 4.0 },
    { x: melaPos.x + 1.0, z: melaPos.z + 4.0 },
  ];

  stallPositions.forEach((sp, idx) => {
    // Stall Table
    const table = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.0, 2.2), darkWoodMat);
    table.position.set(sp.x, 0.5, sp.z);
    table.castShadow = true;
    melaGroup.add(table);

    // Striped Canopy
    const canopyGeo = new THREE.ConeGeometry(2.4, 1.4, 4);
    canopyGeo.rotateY(Math.PI / 4);
    const canopyMat = new THREE.MeshStandardMaterial({
      color: stallColors[idx % stallColors.length],
      roughness: 0.4,
    });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.set(sp.x, 2.8, sp.z);
    melaGroup.add(canopy);
  });

  campusGroup.add(melaGroup);

  // =========================================================================
  // 10. CAMPUS PERIMETER PRAKARA WALLS & TRIPURA TREES
  // =========================================================================
  const envGroup = new THREE.Group();
  envGroup.name = 'campusPerimeterEnvironment';

  // Perimeter Fortress Walls (Prakara) with battlements
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x8C331E, roughness: 0.8 });
  const wallSections = [
    { w: 104, h: 2.8, d: 1.2, x: 0, z: -35.5 }, // North Wall
    { w: 104, h: 2.8, d: 1.2, x: 0, z: 35.5 },  // South Wall
    { w: 1.2, h: 2.8, d: 70, x: -51.5, z: 0 },  // West Wall (with gate gap)
    { w: 1.2, h: 2.8, d: 70, x: 51.5, z: 0 },   // East Wall (behind lake)
  ];
  wallSections.forEach((ws) => {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(ws.w, ws.h, ws.d), wallMat);
    wall.position.set(ws.x, ws.h / 2, ws.z);
    wall.castShadow = true;
    wall.receiveShadow = true;
    envGroup.add(wall);
  });

  // Stylized Tripura Cypress & Champak Trees along perimeter
  const treePositions = [
    { x: -44, z: -28 }, { x: -36, z: -30 }, { x: -22, z: -31 }, { x: 8, z: -30 },
    { x: 32, z: -28 }, { x: 44, z: -20 }, { x: 44, z: 12 }, { x: 40, z: 28 },
    { x: -44, z: 26 }, { x: -32, z: 28 }, { x: -16, z: 30 }, { x: 2, z: 30 },
  ];

  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x422818, roughness: 0.9 });
  const foliageMat1 = new THREE.MeshStandardMaterial({ color: 0x1E4620, roughness: 0.8 });
  const foliageMat2 = new THREE.MeshStandardMaterial({ color: 0x2A5D2C, roughness: 0.7 });

  treePositions.forEach((tp, i) => {
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.45, 3.5, 8), trunkMat);
    trunk.position.set(tp.x, 1.75, tp.z);
    trunk.castShadow = true;
    envGroup.add(trunk);

    const fMat = i % 2 === 0 ? foliageMat1 : foliageMat2;
    const foliage = new THREE.Mesh(new THREE.ConeGeometry(2.0, 5.0, 8), fMat);
    foliage.position.set(tp.x, 5.2, tp.z);
    foliage.castShadow = true;
    envGroup.add(foliage);
  });

  campusGroup.add(envGroup);

  // Add the entire architectural model to scene
  scene.add(campusGroup);

  return {
    turtles,
    flagMesh,
    lakeWaterMesh,
    sanctumInnerLight,
  };
}

