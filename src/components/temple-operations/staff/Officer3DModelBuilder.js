import * as THREE from 'three';

/**
 * Officer3DModelBuilder:
 * Generates stylized 3D humanoid officer & volunteer models for the
 * Mata Tripura Sundari Temple Strategic Security & Pilgrim Deployment System.
 */

// Department color palette definitions
export const DEPARTMENT_CONFIGS = {
  Security: {
    hex: '#D97706', // Gold / Amber
    uniformHex: 0x55132D, // Burgundy
    accentHex: 0xF59E0B,
    label: 'Security & Police',
  },
  Crowd: {
    hex: '#A855F7', // Royal Purple
    uniformHex: 0x581C87,
    accentHex: 0xC084FC,
    label: 'Queue & Crowd Control',
  },
  Safety: {
    hex: '#EA580C', // Safety Orange
    uniformHex: 0xC2410C,
    accentHex: 0xFB923C,
    label: 'Lake & Safety Marshal',
  },
  Sevadal: {
    hex: '#10B981', // Emerald
    uniformHex: 0x065F46,
    accentHex: 0x34D399,
    label: 'Sevadal Volunteer',
  },
  Facilitation: {
    hex: '#2563EB', // Sapphire Blue
    uniformHex: 0x1E40AF,
    accentHex: 0x60A5FA,
    label: 'Help Desk & Yatri Care',
  },
  General: {
    hex: '#64748B',
    uniformHex: 0x334155,
    accentHex: 0x94A3B8,
    label: 'Campus Staff',
  },
};

export function getOfficerDepartment(team = '', role = '') {
  const combined = (team + ' ' + role).toLowerCase();
  if (combined.includes('security') || combined.includes('police')) return DEPARTMENT_CONFIGS.Security;
  if (combined.includes('crowd') || combined.includes('queue')) return DEPARTMENT_CONFIGS.Crowd;
  if (combined.includes('safety') || combined.includes('water') || combined.includes('ghat')) return DEPARTMENT_CONFIGS.Safety;
  if (combined.includes('volunteer') || combined.includes('sevadal') || combined.includes('facility')) return DEPARTMENT_CONFIGS.Sevadal;
  if (combined.includes('help desk') || combined.includes('facilitation') || combined.includes('yatri')) return DEPARTMENT_CONFIGS.Facilitation;
  return DEPARTMENT_CONFIGS.General;
}

/**
 * Builds a stylized 3D humanoid Officer mesh
 * @param {Object} member - Staff member data object
 * @param {Boolean} isSelected - Whether this officer is currently clicked/selected
 * @returns {THREE.Group}
 */
export function buildOfficer3DModel(member, isSelected = false) {
  const dept = getOfficerDepartment(member.team, member.role);
  const officerGroup = new THREE.Group();
  officerGroup.name = `officer_${member.id}`;
  officerGroup.userData = {
    staffId: member.id,
    member,
    dept,
  };

  // Materials
  const uniformMat = new THREE.MeshStandardMaterial({
    color: dept.uniformHex,
    roughness: 0.6,
    metalness: 0.1,
  });

  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xD49B74,
    roughness: 0.8,
  });

  const bootMat = new THREE.MeshStandardMaterial({
    color: 0x1C1917,
    roughness: 0.9,
  });

  const hiVisMat = new THREE.MeshStandardMaterial({
    color: dept.accentHex,
    roughness: 0.3,
    metalness: 0.4,
    emissive: dept.accentHex,
    emissiveIntensity: 0.25,
  });

  const goldTrimMat = new THREE.MeshStandardMaterial({
    color: 0xFBBF24,
    metalness: 0.8,
    roughness: 0.2,
  });

  // 1. Tactical Boots
  [-0.22, 0.22].forEach((lx) => {
    const bootGeo = new THREE.BoxGeometry(0.24, 0.26, 0.42);
    const boot = new THREE.Mesh(bootGeo, bootMat);
    boot.position.set(lx, 0.13, 0.05);
    boot.castShadow = true;
    officerGroup.add(boot);
  });

  // 2. Trouser Legs
  [-0.22, 0.22].forEach((lx) => {
    const legGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.85, 8);
    const leg = new THREE.Mesh(legGeo, uniformMat);
    leg.position.set(lx, 0.68, 0);
    leg.castShadow = true;
    officerGroup.add(leg);
  });

  // 3. Torso / Uniform Jacket
  const torsoGeo = new THREE.BoxGeometry(0.72, 0.95, 0.44);
  const torso = new THREE.Mesh(torsoGeo, uniformMat);
  torso.position.set(0, 1.58, 0);
  torso.castShadow = true;
  officerGroup.add(torso);

  // Hi-Vis Reflective Shoulder Bands & Crest
  const bandGeo = new THREE.BoxGeometry(0.76, 0.22, 0.48);
  const band = new THREE.Mesh(bandGeo, hiVisMat);
  band.position.set(0, 1.72, 0);
  officerGroup.add(band);

  // Department Badge Crest on Chest
  const badgeGeo = new THREE.BoxGeometry(0.15, 0.18, 0.06);
  const badge = new THREE.Mesh(badgeGeo, goldTrimMat);
  badge.position.set(0.2, 1.72, 0.24);
  officerGroup.add(badge);

  // 4. Arms
  [-0.45, 0.45].forEach((ax) => {
    const armGeo = new THREE.CylinderGeometry(0.09, 0.11, 0.78, 8);
    const arm = new THREE.Mesh(armGeo, uniformMat);
    arm.position.set(ax, 1.52, 0);
    arm.castShadow = true;
    officerGroup.add(arm);

    // Hands
    const handGeo = new THREE.SphereGeometry(0.09, 8, 8);
    const hand = new THREE.Mesh(handGeo, skinMat);
    hand.position.set(ax, 1.08, 0);
    officerGroup.add(hand);
  });

  // 5. Walkie-Talkie Radio mounted on shoulder
  const radioGeo = new THREE.BoxGeometry(0.12, 0.26, 0.12);
  const radio = new THREE.Mesh(radioGeo, bootMat);
  radio.position.set(-0.28, 1.95, 0.12);
  officerGroup.add(radio);

  const antennaGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.35, 6);
  const antenna = new THREE.Mesh(antennaGeo, goldTrimMat);
  antenna.position.set(-0.28, 2.15, 0.12);
  officerGroup.add(antenna);

  // 6. Head & Face
  const headGeo = new THREE.SphereGeometry(0.25, 12, 12);
  const head = new THREE.Mesh(headGeo, skinMat);
  head.position.set(0, 2.32, 0);
  head.castShadow = true;
  officerGroup.add(head);

  // 7. Tactical Peaked Cap / Beret
  const capCrownGeo = new THREE.CylinderGeometry(0.32, 0.28, 0.2, 12);
  const capCrown = new THREE.Mesh(capCrownGeo, uniformMat);
  capCrown.position.set(0, 2.52, 0);
  officerGroup.add(capCrown);

  const capVisorGeo = new THREE.BoxGeometry(0.38, 0.04, 0.22);
  const capVisor = new THREE.Mesh(capVisorGeo, bootMat);
  capVisor.position.set(0, 2.45, 0.22);
  officerGroup.add(capVisor);

  // 8. Ground Radar Halo / Patrol Radius
  const radarRadius = isSelected ? 3.5 : 2.4;
  const radarGeo = new THREE.RingGeometry(radarRadius - 0.2, radarRadius, 32);
  radarGeo.rotateX(-Math.PI / 2);
  const radarMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(dept.hex),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: isSelected ? 0.85 : 0.45,
  });
  const radarMesh = new THREE.Mesh(radarGeo, radarMat);
  radarMesh.position.y = 0.08;
  radarMesh.name = 'radarHalo';
  officerGroup.add(radarMesh);

  // 9. Directional Vision / Patrol Cone (FOV)
  if (isSelected) {
    const fovGeo = new THREE.ConeGeometry(3.8, 4.2, 16, 1, false, -Math.PI / 4, Math.PI / 2);
    fovGeo.rotateX(Math.PI / 2);
    const fovMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(dept.hex),
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
    });
    const fovMesh = new THREE.Mesh(fovGeo, fovMat);
    fovMesh.position.set(0, 0.1, 2.2);
    fovMesh.name = 'visionCone';
    officerGroup.add(fovMesh);
  }

  // 10. Floating Holographic Beacon / Light Column above Head
  const beamHeight = isSelected ? 6.0 : 4.0;
  const beamGeo = new THREE.CylinderGeometry(0.08, 0.25, beamHeight, 12, 1, true);
  const beamMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(dept.hex),
    transparent: true,
    opacity: isSelected ? 0.75 : 0.35,
    side: THREE.DoubleSide,
  });
  const beamMesh = new THREE.Mesh(beamGeo, beamMat);
  beamMesh.position.y = 2.8 + beamHeight / 2;
  officerGroup.add(beamMesh);

  // Floating Status Emblem
  const emblemGeo = isSelected
    ? new THREE.OctahedronGeometry(0.55, 0)
    : new THREE.SphereGeometry(0.4, 12, 12);
  const emblemMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(dept.hex),
    emissive: new THREE.Color(dept.hex),
    emissiveIntensity: 0.8,
    roughness: 0.2,
    metalness: 0.8,
  });
  const emblem = new THREE.Mesh(emblemGeo, emblemMat);
  emblem.position.y = 2.8 + beamHeight;
  emblem.name = 'floatingEmblem';
  officerGroup.add(emblem);

  // 11. Large Invisible Hit-Test Cylinder for reliable mouse clicks
  const hitGeo = new THREE.CylinderGeometry(1.8, 1.8, 6.5, 12);
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const hitMesh = new THREE.Mesh(hitGeo, hitMat);
  hitMesh.position.y = 3.0;
  hitMesh.userData = { isOfficerClickable: true, staffId: member.id, member };
  officerGroup.add(hitMesh);

  // Scale adjustment for architectural proportions
  officerGroup.scale.set(1.15, 1.15, 1.15);

  return officerGroup;
}

/**
 * Builds the Holographic "Ghost" Officer cursor model that follows the mouse
 * when in Deployment or Repositioning mode
 * @returns {THREE.Group}
 */
export function buildHolographicDeployGhost() {
  const ghostGroup = new THREE.Group();
  ghostGroup.name = 'deployGhostCursor';

  const ghostMat = new THREE.MeshBasicMaterial({
    color: 0x38BDF8, // Electric Cyan
    wireframe: true,
    transparent: true,
    opacity: 0.8,
  });

  const solidGlowMat = new THREE.MeshBasicMaterial({
    color: 0x0284C7,
    transparent: true,
    opacity: 0.45,
  });

  // Body silhouette
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.6, 0.4), ghostMat);
  body.position.y = 1.2;
  ghostGroup.add(body);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), ghostMat);
  head.position.y = 2.3;
  ghostGroup.add(head);

  // Targeting Bullseye on Ground
  const ring1 = new THREE.Mesh(new THREE.RingGeometry(1.8, 2.1, 32), solidGlowMat);
  ring1.rotateX(-Math.PI / 2);
  ring1.position.y = 0.05;
  ghostGroup.add(ring1);

  const ring2 = new THREE.Mesh(new THREE.RingGeometry(0.4, 0.6, 24), solidGlowMat);
  ring2.rotateX(-Math.PI / 2);
  ring2.position.y = 0.06;
  ghostGroup.add(ring2);

  // Vertical Target Laser
  const laser = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 12, 8), solidGlowMat);
  laser.position.y = 6.0;
  ghostGroup.add(laser);

  ghostGroup.visible = false;
  return ghostGroup;
}

