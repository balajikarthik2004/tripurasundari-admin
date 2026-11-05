import * as THREE from 'three';

/**
 * TempleArchitecture3DBuilder:
 * Authentic, highly-detailed 3D Architectural Digital Twin for Mata Tripura Sundari Temple (Matabari),
 * one of the revered 51 Shakti Peethas in Udaipur, Tripura.
 *
 * Built in 1501 CE by Maharaja Dhanya Manikya of the Manikya Dynasty.
 * Architectural style: Unique synthesis of medieval Bengali Char-Chala (four-sloping curved eaves),
 * Kurmapitha (tortoise-shaped mound base), and late-medieval Tripura stupa-shikhara crown,
 * situated beside the sacred 6.4-acre Kalyan Sagar lake.
 */

// =========================================================================
// PROCEDURAL ARCHITECTURAL TEXTURES FOR RICH VISUAL FIDELITY
// =========================================================================

function createTerracottaBrickTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Base warm red terracotta clay
  ctx.fillStyle = '#A33C25';
  ctx.fillRect(0, 0, 512, 512);

  // Brick grid with light lime mortar grooves
  ctx.strokeStyle = '#D6C5AD';
  ctx.lineWidth = 3.5;
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

  // Weathered clay specks & tonal variation
  for (let i = 0; i < 3500; i++) {
    const nx = Math.random() * 512;
    const ny = Math.random() * 512;
    const alpha = Math.random() * 0.14;
    ctx.fillStyle = Math.random() > 0.5 ? `rgba(255,255,255,${alpha})` : `rgba(40,10,5,${alpha})`;
    ctx.fillRect(nx, ny, 2.5, 2.5);
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

  ctx.fillStyle = '#EDE5D8';
  ctx.fillRect(0, 0, 512, 512);

  // Sandstone paving slabs
  ctx.strokeStyle = '#C7BBA8';
  ctx.lineWidth = 3;
  const tileSize = 64;
  for (let x = 0; x < 512; x += tileSize) {
    for (let y = 0; y < 512; y += tileSize) {
      ctx.strokeRect(x, y, tileSize, tileSize);
      if ((x + y) % 128 === 0) {
        ctx.fillStyle = 'rgba(190, 170, 150, 0.18)';
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

function createGrassTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Vibrant, lush temple lawn green
  ctx.fillStyle = '#658D52';
  ctx.fillRect(0, 0, 512, 512);

  // Grass blade flecks
  for (let i = 0; i < 5000; i++) {
    const gx = Math.random() * 512;
    const gy = Math.random() * 512;
    ctx.fillStyle = Math.random() > 0.5 ? '#7CA764' : '#4E723D';
    ctx.fillRect(gx, gy, 1.5, 3.5);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 8);
  return texture;
}

function createWaterCausticsTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#116373';
  ctx.fillRect(0, 0, 512, 512);

  // Soft rippling caustic lines
  ctx.strokeStyle = 'rgba(186, 243, 252, 0.4)';
  ctx.lineWidth = 3.0;
  for (let i = 0; i < 60; i++) {
    ctx.beginPath();
    const cx = Math.random() * 512;
    const cy = Math.random() * 512;
    const r = 20 + Math.random() * 55;
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

// =========================================================================
// MAIN BUILDER FUNCTION
// =========================================================================

export function buildTempleCampus(scene, scaleX, scaleZ) {
  const campusGroup = new THREE.Group();
  campusGroup.name = 'templeCampusComplete';

  // Shared Procedural Textures & Materials
  const terracottaTex = createTerracottaBrickTexture();
  const stoneTex = createPavedStoneTexture();
  const grassTex = createGrassTexture();
  const waterTex = createWaterCausticsTexture();

  const terracottaMat = new THREE.MeshStandardMaterial({
    map: terracottaTex,
    color: 0xB54228,
    roughness: 0.6,
    metalness: 0.05,
  });

  const stonePavedMat = new THREE.MeshStandardMaterial({
    map: stoneTex,
    color: 0xF0ECE1,
    roughness: 0.7,
    metalness: 0.04,
  });

  const goldKalasaMat = new THREE.MeshStandardMaterial({
    color: 0xF5C74C,
    roughness: 0.22,
    metalness: 0.88,
    emissive: 0x664B10,
    emissiveIntensity: 0.28,
  });

  const whiteMarbleTrimMat = new THREE.MeshStandardMaterial({
    color: 0xFAF7F2,
    roughness: 0.45,
    metalness: 0.02,
  });

  const darkWoodMat = new THREE.MeshStandardMaterial({
    color: 0x422616,
    roughness: 0.85,
  });

  const lawnGreenMat = new THREE.MeshStandardMaterial({
    map: grassTex,
    color: 0x689255,
    roughness: 0.85,
  });

  const waterMat = new THREE.MeshStandardMaterial({
    map: waterTex,
    color: 0x148296,
    roughness: 0.12,
    metalness: 0.45,
    transparent: true,
    opacity: 0.86,
  });

  // Coordinates for core landmarks (mapped via D3 scales)
  const sanctumPos = { x: scaleX(640), z: scaleZ(335) };
  const lakePos = { x: scaleX(820), z: scaleZ(540) };
  const gopuramPos = { x: scaleX(140), z: scaleZ(370) };
  const annadanamPos = { x: scaleX(540), z: scaleZ(570) };
  const melaPos = { x: scaleX(330), z: scaleZ(160) };

  // Helper to tag meshes for interactive landmark inspection
  const tagLandmark = (mesh, landmarkInfo) => {
    mesh.userData.isLandmark = true;
    mesh.userData.landmark = landmarkInfo;
  };

  // =========================================================================
  // 1. KURMA-PITHA SACRED HILLOCK (Tortoise-Mound Base & Terraces)
  // =========================================================================
  const kurmaGroup = new THREE.Group();
  kurmaGroup.name = 'kurmaPithaMound';

  // Base campus ground slab (Lower Campus Level Y = 0) with warm sandstone border plinth
  const groundSlabGeo = new THREE.BoxGeometry(108, 1.2, 76);
  const groundSlabMesh = new THREE.Mesh(groundSlabGeo, lawnGreenMat);
  groundSlabMesh.position.y = -0.6;
  groundSlabMesh.receiveShadow = true;
  kurmaGroup.add(groundSlabMesh);

  // Sandstone retaining plinth border around the campus perimeter
  const plinthBorderGeo = new THREE.BoxGeometry(109.2, 0.4, 77.2);
  const plinthBorderMesh = new THREE.Mesh(plinthBorderGeo, stonePavedMat);
  plinthBorderMesh.position.y = -1.1;
  plinthBorderMesh.receiveShadow = true;
  kurmaGroup.add(plinthBorderMesh);

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
  tagLandmark(kurmaPlinthMesh, {
    key: 'sanctum',
    name: 'Kurmapitha Hillock Plinth',
    style: 'Convex Tortoise-Backed Foundation',
    desc: 'Holiest Agamic foundation resembling a tortoise shell (Kurma avatar), representing stability and spiritual pratyahara.',
  });
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
    if (Math.abs(angle - Math.PI) < 0.28) continue; // Gap for west stairs
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

  // Flanking Guardian Lion / Gajasimha Statues at staircase entry
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
  // 2. MAIN SANCTUM: BENGALI CHAR-CHALA TERRACOTTA SHIKHARA & GARBHAGRIHA
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
  tagLandmark(garbhagrihaMesh, {
    key: 'sanctum',
    name: 'Main Sanctum (Garbhagriha)',
    style: 'Bengali Char-Chala Style (1501 CE)',
    desc: 'Core shrine consecrated by Maharaja Dhanya Manikya, housing Maa Tripura Sundari (Soroshi) and Chhoto-Ma atop the Kurmapitha hillock.',
  });
  sanctumGroup.add(garbhagrihaMesh);

  // Decorative White Cornice Bands across temple facade
  [plinthY + 1.2, plinthY + 5.2, plinthY + 8.4].forEach((cy) => {
    const corniceGeo = new THREE.BoxGeometry(11.2, 0.35, 11.2);
    const corniceMesh = new THREE.Mesh(corniceGeo, whiteMarbleTrimMat);
    corniceMesh.position.set(sanctumPos.x, cy, sanctumPos.z);
    sanctumGroup.add(corniceMesh);
  });

  // Authentic 4-Sloping Bengali Char-Chala Roof (Gracefully curved eaves)
  const chalaLowerGeo = new THREE.ConeGeometry(9.8, 5.4, 4);
  chalaLowerGeo.rotateY(Math.PI / 4);
  const chalaLowerMesh = new THREE.Mesh(chalaLowerGeo, terracottaMat);
  chalaLowerMesh.position.set(sanctumPos.x, plinthY + 11.1, sanctumPos.z);
  chalaLowerMesh.castShadow = true;
  tagLandmark(chalaLowerMesh, {
    key: 'sanctum',
    name: 'Char-Chala Curvilinear Roof',
    style: 'Bengal Thatched-Hut Adaptation',
    desc: 'Four-sided curved eaves roof imitating traditional Bengal rural huts, designed to withstand torrential monsoons.',
  });
  sanctumGroup.add(chalaLowerMesh);

  // Flared Eaves Cornice Trim (White stucco rim)
  const eaveTrimGeo = new THREE.BoxGeometry(12.8, 0.45, 12.8);
  eaveTrimGeo.rotateY(Math.PI / 4);
  const eaveTrimMesh = new THREE.Mesh(eaveTrimGeo, whiteMarbleTrimMat);
  eaveTrimMesh.position.set(sanctumPos.x, plinthY + 8.7, sanctumPos.z);
  sanctumGroup.add(eaveTrimMesh);

  // Circular Neck Drum (Griva) with decorative alcoves
  const drumGeo = new THREE.CylinderGeometry(5.2, 5.6, 1.8, 24);
  const drumMesh = new THREE.Mesh(drumGeo, whiteMarbleTrimMat);
  drumMesh.position.set(sanctumPos.x, plinthY + 13.0, sanctumPos.z);
  drumMesh.castShadow = true;
  sanctumGroup.add(drumMesh);

  // Upper Conical Stupa-Shikhara Spire (Signature Matabari dome with horizontal concentric molding bands)
  const shikharaDomeGeo = new THREE.CylinderGeometry(1.6, 5.0, 6.2, 32);
  const shikharaDomeMesh = new THREE.Mesh(shikharaDomeGeo, terracottaMat);
  shikharaDomeMesh.position.set(sanctumPos.x, plinthY + 16.2, sanctumPos.z);
  shikharaDomeMesh.castShadow = true;
  sanctumGroup.add(shikharaDomeMesh);

  // Concentric horizontal molding rings on shikhara
  [plinthY + 14.5, plinthY + 16.0, plinthY + 17.5].forEach((my, idx) => {
    const ringRadius = 4.2 - idx * 0.9;
    const ringGeo = new THREE.TorusGeometry(ringRadius, 0.18, 8, 32);
    ringGeo.rotateX(Math.PI / 2);
    const ringMesh = new THREE.Mesh(ringGeo, whiteMarbleTrimMat);
    ringMesh.position.set(sanctumPos.x, my, sanctumPos.z);
    sanctumGroup.add(ringMesh);
  });

  // Ribbed Fluted Amalaka Ring
  const amalakaGeo = new THREE.TorusGeometry(2.3, 0.7, 12, 32);
  amalakaGeo.rotateX(Math.PI / 2);
  const amalakaMesh = new THREE.Mesh(amalakaGeo, whiteMarbleTrimMat);
  amalakaMesh.position.set(sanctumPos.x, plinthY + 19.5, sanctumPos.z);
  sanctumGroup.add(amalakaMesh);

  // 16-Petal Gilded Lotus Base (Padmapitha)
  const lotusBaseGeo = new THREE.CylinderGeometry(1.8, 2.4, 0.8, 16);
  const lotusBaseMesh = new THREE.Mesh(lotusBaseGeo, goldKalasaMat);
  lotusBaseMesh.position.set(sanctumPos.x, plinthY + 20.2, sanctumPos.z);
  sanctumGroup.add(lotusBaseMesh);

  // Gilded Kalasha Finial (Sacred Pitcher of Amrita)
  const kalashaGeo = new THREE.SphereGeometry(1.15, 24, 24);
  const kalashaMesh = new THREE.Mesh(kalashaGeo, goldKalasaMat);
  kalashaMesh.position.set(sanctumPos.x, plinthY + 21.3, sanctumPos.z);
  sanctumGroup.add(kalashaMesh);

  // Sacred Brass Trishula (Trident) at the Temple Apex
  const trishulaRodGeo = new THREE.CylinderGeometry(0.12, 0.12, 3.2, 12);
  const trishulaRodMesh = new THREE.Mesh(trishulaRodGeo, goldKalasaMat);
  trishulaRodMesh.position.set(sanctumPos.x, plinthY + 23.2, sanctumPos.z);
  sanctumGroup.add(trishulaRodMesh);

  // Trident Prongs
  const prongGeo = new THREE.TorusGeometry(0.85, 0.09, 8, 16, Math.PI);
  prongGeo.rotateX(Math.PI);
  const prongMesh = new THREE.Mesh(prongGeo, goldKalasaMat);
  prongMesh.position.set(sanctumPos.x, plinthY + 24.5, sanctumPos.z);
  sanctumGroup.add(prongMesh);

  // Animated Saffron Temple Flag (Dhwaja) fluttering in breeze
  const flagGeo = new THREE.PlaneGeometry(2.0, 1.2, 8, 4);
  const flagMat = new THREE.MeshStandardMaterial({
    color: 0xF97316,
    side: THREE.DoubleSide,
    roughness: 0.35,
  });
  const flagMesh = new THREE.Mesh(flagGeo, flagMat);
  flagMesh.position.set(sanctumPos.x + 1.0, plinthY + 24.0, sanctumPos.z);
  flagMesh.name = 'templeFlag';
  sanctumGroup.add(flagMesh);

  // West Arched Portal / Entrance Porch with Ornate Brass Door
  const doorArchGeo = new THREE.BoxGeometry(1.8, 5.2, 3.8);
  const doorArchMesh = new THREE.Mesh(doorArchGeo, darkWoodMat);
  doorArchMesh.position.set(sanctumPos.x - 5.2, plinthY + 3.6, sanctumPos.z);
  doorArchMesh.castShadow = true;
  sanctumGroup.add(doorArchMesh);

  // Brass Door Trim & Ornate Handle
  const doorGiltGeo = new THREE.BoxGeometry(0.2, 4.4, 3.2);
  const doorGiltMesh = new THREE.Mesh(doorGiltGeo, goldKalasaMat);
  doorGiltMesh.position.set(sanctumPos.x - 6.0, plinthY + 3.6, sanctumPos.z);
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

  // Akhanda Jyoti: Warm golden sanctum glow
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
  tagLandmark(natmandirFloorMesh, {
    key: 'sanctum',
    name: 'Natmandir Assembly Hall',
    style: 'Orissa-Bengal Composite Pillared Pavilion',
    desc: 'Spacious pillared prayer and bhajan hall fronting the sanctum where pilgrims gather for daily aarti and devotional chanting.',
  });
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
  const numColonnadePillars = 28;

  for (let i = 0; i < numColonnadePillars; i++) {
    const angle = (i / numColonnadePillars) * Math.PI * 2;
    if (Math.abs(angle - Math.PI) < 0.22) continue; // Leave entrance open

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

    const stambhaGeo = new THREE.CylinderGeometry(0.35, 0.65, 6.2, 12);
    const stambhaMesh = new THREE.Mesh(stambhaGeo, whiteMarbleTrimMat);
    stambhaMesh.position.set(lx, 3.5, lz);
    stambhaMesh.castShadow = true;
    parikramaGroup.add(stambhaMesh);

    [2.2, 4.2, 5.8].forEach((ly) => {
      const bowlGeo = new THREE.TorusGeometry(0.75, 0.12, 6, 16);
      bowlGeo.rotateX(Math.PI / 2);
      const bowlMesh = new THREE.Mesh(bowlGeo, goldKalasaMat);
      bowlMesh.position.set(lx, ly, lz);
      parikramaGroup.add(bowlMesh);
    });

    const lampGlow = new THREE.PointLight(0xF59E0B, 1.2, 10);
    lampGlow.position.set(lx, 6.8, lz);
    parikramaGroup.add(lampGlow);
  });

  campusGroup.add(parikramaGroup);

  // =========================================================================
  // 5. KALYAN SAGAR SACRED LAKE, STEPPED STONE GHATS & TURTLE DECK
  // =========================================================================
  const lakeGroup = new THREE.Group();
  lakeGroup.name = 'kalyanSagarLakeComplex';

  // Sunken Lake Basin with Depth
  const basinGeo = new THREE.CylinderGeometry(18.5, 20.0, 2.8, 48);
  const basinMat = new THREE.MeshStandardMaterial({ color: 0x092D36, roughness: 0.9 });
  const basinMesh = new THREE.Mesh(basinGeo, basinMat);
  basinMesh.position.set(lakePos.x, -1.2, lakePos.z);
  lakeGroup.add(basinMesh);

  // Water Surface Plane (Translucent animated cyan-teal water)
  const lakeWaterGeo = new THREE.CylinderGeometry(18.2, 18.2, 0.2, 48);
  const lakeWaterMesh = new THREE.Mesh(lakeWaterGeo, waterMat);
  lakeWaterMesh.position.set(lakePos.x, 0.15, lakePos.z);
  lakeWaterMesh.name = 'kalyanWaterMesh';
  tagLandmark(lakeWaterMesh, {
    key: 'lake',
    name: 'Kalyan Sagar Sacred Lake',
    style: '6.4-Acre Historic Reservoir (1501 CE)',
    desc: 'Eastern holy lake sanctified by Maharaja Dhanya Manikya, famous for housing endangered sacred Bostami softshell turtles.',
  });
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

    if (i % 5 === 0) {
      const buoyGeo = new THREE.TorusGeometry(0.45, 0.12, 8, 16);
      const buoyMat = new THREE.MeshStandardMaterial({ color: 0xEA580C, roughness: 0.3 });
      const buoyMesh = new THREE.Mesh(buoyGeo, buoyMat);
      buoyMesh.position.set(px, 2.1, pz);
      lakeGroup.add(buoyMesh);
    }
  }

  // Wooden Turtle Observation & Feeding Deck extending over water
  const deckX = lakePos.x - 12.0;
  const deckZ = lakePos.z - 8.0;

  const deckPlankGeo = new THREE.BoxGeometry(6.5, 0.3, 5.0);
  const deckPlankMesh = new THREE.Mesh(deckPlankGeo, darkWoodMat);
  deckPlankMesh.position.set(deckX, 0.75, deckZ);
  deckPlankMesh.castShadow = true;
  tagLandmark(deckPlankMesh, {
    key: 'turtle_deck',
    name: 'Bostami Turtle Observation Deck',
    style: 'Lakefront Feeding Pavilion',
    desc: 'Wooden observation deck where devotees offer puffed rice (muri) to the sacred Nilssonia nigricans softshell tortoises.',
  });
  lakeGroup.add(deckPlankMesh);

  // Deck Pilings into Water
  [[-2.8, -2.0], [-2.8, 2.0], [2.8, -2.0], [2.8, 2.0]].forEach(([px, pz]) => {
    const pileGeo = new THREE.CylinderGeometry(0.18, 0.18, 2.5, 8);
    const pileMesh = new THREE.Mesh(pileGeo, darkWoodMat);
    pileMesh.position.set(deckX + px, -0.3, deckZ + pz);
    lakeGroup.add(pileMesh);
  });

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

    // Shell
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
  // 6. SINGH DWAR (WEST ROYAL GATEWAY & SECURITY ENTRY)
  // =========================================================================
  const gopuramGroup = new THREE.Group();
  gopuramGroup.name = 'westToranaGopuram';

  const gX = gopuramPos.x;
  const gZ = gopuramPos.z;

  // Twin Flanking Terracotta Gateway Towers (Octagonal Manikya royal design)
  [-4.8, 4.8].forEach((offsetZ) => {
    const pylonLower = new THREE.Mesh(new THREE.BoxGeometry(4.2, 6.0, 3.6), terracottaMat);
    pylonLower.position.set(gX, 3.0, gZ + offsetZ);
    pylonLower.castShadow = true;
    gopuramGroup.add(pylonLower);

    const pylonUpper = new THREE.Mesh(new THREE.BoxGeometry(3.4, 4.2, 2.8), terracottaMat);
    pylonUpper.position.set(gX, 8.1, gZ + offsetZ);
    pylonUpper.castShadow = true;
    gopuramGroup.add(pylonUpper);

    // Domed Chhatri Cap with Golden Finial
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
  tagLandmark(lintelMesh, {
    key: 'gopuram',
    name: 'Singh Dwar (West Royal Gate)',
    style: 'Tripura Manikya Fortified Gateway',
    desc: 'Main ceremonial pedestrian entrance along NH-8 corridor, featuring baggage check, shoe deposit counters, and computerized turnstiles.',
  });
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

  const hallBase = new THREE.Mesh(new THREE.BoxGeometry(18.0, 5.0, 11.0), terracottaMat);
  hallBase.position.set(aX, 2.5, aZ);
  hallBase.castShadow = true;
  hallBase.receiveShadow = true;
  tagLandmark(hallBase, {
    key: 'annadanam',
    name: 'Sri Annapurna Dining Hall',
    style: 'Mahaprasad Free Kitchen Complex',
    desc: 'Free community kitchen serving hot consecrated Anna-Prasad to over 3,000 devotees daily from 12:30 PM to 02:30 PM.',
  });
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
  // 8. SACRED PEEPAL / BANYAN TREE WITH CIRCULAR STONE CHABUTRA PLATFORM
  // =========================================================================
  const treeGroup = new THREE.Group();
  treeGroup.name = 'sacredPeepalChabutra';

  const treeX = sanctumPos.x - 22.0;
  const treeZ = sanctumPos.z + 18.0;

  // Circular Stone Chabutra (Sitting & Prayer Platform)
  const chabutraGeo = new THREE.CylinderGeometry(4.2, 4.5, 0.9, 24);
  const chabutraMesh = new THREE.Mesh(chabutraGeo, whiteMarbleTrimMat);
  chabutraMesh.position.set(treeX, 0.45, treeZ);
  chabutraMesh.receiveShadow = true;
  treeGroup.add(chabutraMesh);

  // Ancient Banyan Trunk with Aerial Prop Roots
  const banyanTrunkGeo = new THREE.CylinderGeometry(0.9, 1.4, 4.8, 12);
  const banyanTrunkMesh = new THREE.Mesh(banyanTrunkGeo, darkWoodMat);
  banyanTrunkMesh.position.set(treeX, 3.0, treeZ);
  banyanTrunkMesh.castShadow = true;
  treeGroup.add(banyanTrunkMesh);

  // Broad Spreading Canopy
  const canopyGeo1 = new THREE.SphereGeometry(4.5, 16, 12);
  canopyGeo1.scale(1.4, 0.7, 1.3);
  const canopyMat1 = new THREE.MeshStandardMaterial({ color: 0x2D5A27, roughness: 0.8 });
  const canopyMesh1 = new THREE.Mesh(canopyGeo1, canopyMat1);
  canopyMesh1.position.set(treeX, 6.4, treeZ);
  canopyMesh1.castShadow = true;
  treeGroup.add(canopyMesh1);

  campusGroup.add(treeGroup);

  // =========================================================================
  // 9. DIWALI MELA FESTIVAL GROUNDS & COOPERATIVE PRASAD STALLS
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
    const table = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.0, 2.2), darkWoodMat);
    table.position.set(sp.x, 0.5, sp.z);
    table.castShadow = true;
    melaGroup.add(table);

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
  // 10. CAMPUS PERIMETER LOW BALUSTRADE (Airy open sightlines into light sky)
  // =========================================================================
  const envGroup = new THREE.Group();
  envGroup.name = 'campusPerimeterEnvironment';

  // Low decorative terracotta-and-marble balustrade wall (1.2m height)
  const lowWallMat = new THREE.MeshStandardMaterial({ color: 0xA63F28, roughness: 0.7 });
  const wallSections = [
    { w: 104, h: 1.2, d: 0.8, x: 0, z: -35.5 }, // North Wall
    { w: 104, h: 1.2, d: 0.8, x: 0, z: 35.5 },  // South Wall
    { w: 0.8, h: 1.2, d: 70, x: -51.5, z: 0 },  // West Wall
    { w: 0.8, h: 1.2, d: 70, x: 51.5, z: 0 },   // East Wall
  ];
  wallSections.forEach((ws) => {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(ws.w, ws.h, ws.d), lowWallMat);
    wall.position.set(ws.x, ws.h / 2, ws.z);
    wall.castShadow = true;
    wall.receiveShadow = true;
    envGroup.add(wall);

    // White marble coping cap
    const cap = new THREE.Mesh(new THREE.BoxGeometry(ws.w, 0.15, ws.d + 0.2), whiteMarbleTrimMat);
    cap.position.set(ws.x, ws.h + 0.08, ws.z);
    envGroup.add(cap);
  });

  // Stylized Tripura Cypress & Champak Trees along perimeter
  const treePositions = [
    { x: -44, z: -28 }, { x: -36, z: -30 }, { x: -22, z: -31 }, { x: 8, z: -30 },
    { x: 32, z: -28 }, { x: 44, z: -20 }, { x: 44, z: 12 }, { x: 40, z: 28 },
    { x: -44, z: 26 }, { x: -32, z: 28 }, { x: -16, z: 30 }, { x: 2, z: 30 },
  ];

  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x422818, roughness: 0.9 });
  const foliageMat1 = new THREE.MeshStandardMaterial({ color: 0x2A5822, roughness: 0.75 });
  const foliageMat2 = new THREE.MeshStandardMaterial({ color: 0x3C6E33, roughness: 0.7 });

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
