import * as THREE from 'three';

export class Workers {
  public group: THREE.Group;

  // Worker 1: Active Construction Mason
  public masonGroup: THREE.Group;
  private masonRightArm: THREE.Group;
  private masonLeftArm: THREE.Group;
  private masonHead: THREE.Group;
  private trowelMesh: THREE.Mesh;

  // Worker 2: Site Supervisor / Project Auditor
  public supervisorGroup: THREE.Group;
  private supervisorRightArm: THREE.Group;
  private supervisorLeftArm: THREE.Group;
  private supervisorHead: THREE.Group;
  public tabletScreen: THREE.Mesh;
  public arScanBeam: THREE.Group;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'Workers';

    this.masonGroup = new THREE.Group();
    this.supervisorGroup = new THREE.Group();

    this.masonRightArm = new THREE.Group();
    this.masonLeftArm = new THREE.Group();
    this.masonHead = new THREE.Group();
    this.trowelMesh = new THREE.Mesh();

    this.supervisorRightArm = new THREE.Group();
    this.supervisorLeftArm = new THREE.Group();
    this.supervisorHead = new THREE.Group();
    this.tabletScreen = new THREE.Mesh();
    this.arScanBeam = new THREE.Group();

    this.group.add(this.masonGroup);
    this.group.add(this.supervisorGroup);

    this.buildMason();
    this.buildSupervisor();
  }

  // =========================================================================
  // WORKER 1: CONSTRUCTION MASON (Actively building with trowel & bricks)
  // =========================================================================
  private buildMason() {
    // Scaled realistically: ~1.8m tall, located on ground level near right facade wall
    this.masonGroup.position.set(3.2, 0.5, 4.3);
    this.masonGroup.rotation.y = -Math.PI * 0.75; // Facing the wall section

    // Materials
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xc68b59, roughness: 0.7 });
    const vestOrange = new THREE.MeshStandardMaterial({ color: 0xff6b22, roughness: 0.6 }); // High-vis orange vest
    const reflectiveSilver = new THREE.MeshStandardMaterial({ color: 0xd9e2ec, roughness: 0.2, metalness: 0.8 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x263238, roughness: 0.85 }); // Utility work denim
    const bootsMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.9 }); // Leather boots
    const helmetYellow = new THREE.MeshStandardMaterial({ color: 0xfbc02d, roughness: 0.35, metalness: 0.1 }); // Safety yellow
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x90a4ae, roughness: 0.2, metalness: 0.9 });
    const woodHandle = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.7 });

    // 1. Legs and Boots
    const bootGeo = new THREE.BoxGeometry(0.18, 0.14, 0.32);
    const leftBoot = new THREE.Mesh(bootGeo, bootsMat);
    leftBoot.position.set(-0.16, 0.07, 0.04);
    leftBoot.castShadow = true;
    this.masonGroup.add(leftBoot);

    const rightBoot = new THREE.Mesh(bootGeo, bootsMat);
    rightBoot.position.set(0.16, 0.07, -0.06);
    rightBoot.castShadow = true;
    this.masonGroup.add(rightBoot);

    // Pant legs
    const legGeo = new THREE.CylinderGeometry(0.11, 0.1, 0.75, 8);
    const leftLeg = new THREE.Mesh(legGeo, pantsMat);
    leftLeg.position.set(-0.16, 0.48, 0.02);
    leftLeg.castShadow = true;
    this.masonGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, pantsMat);
    rightLeg.position.set(0.16, 0.48, -0.04);
    rightLeg.castShadow = true;
    this.masonGroup.add(rightLeg);

    // Pelvis & Utility Belt
    const pelvisGeo = new THREE.BoxGeometry(0.44, 0.2, 0.26);
    const pelvis = new THREE.Mesh(pelvisGeo, pantsMat);
    pelvis.position.set(0, 0.9, 0);
    this.masonGroup.add(pelvis);

    const beltGeo = new THREE.BoxGeometry(0.46, 0.06, 0.28);
    const beltMat = new THREE.MeshStandardMaterial({ color: 0x1b1b1b, roughness: 0.8 });
    const belt = new THREE.Mesh(beltGeo, beltMat);
    belt.position.set(0, 0.98, 0);
    this.masonGroup.add(belt);

    // 2. Torso (Leaned forward slightly in working posture)
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 1.0, 0);
    torsoGroup.rotation.x = 0.12; // Slight forward work posture

    const chestGeo = new THREE.BoxGeometry(0.46, 0.52, 0.28);
    const chest = new THREE.Mesh(chestGeo, vestOrange);
    chest.position.set(0, 0.26, 0);
    chest.castShadow = true;
    torsoGroup.add(chest);

    // High-vis reflective stripes across chest
    const stripeGeo = new THREE.BoxGeometry(0.47, 0.06, 0.29);
    const stripe1 = new THREE.Mesh(stripeGeo, reflectiveSilver);
    stripe1.position.set(0, 0.32, 0);
    torsoGroup.add(stripe1);

    const stripe2 = new THREE.Mesh(stripeGeo, reflectiveSilver);
    stripe2.position.set(0, 0.18, 0);
    torsoGroup.add(stripe2);

    // 3. Head & Yellow Hard Hat
    this.masonHead.position.set(0, 0.58, 0.04);

    const neckGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.12, 8);
    const neck = new THREE.Mesh(neckGeo, skinMat);
    neck.position.y = 0.06;
    this.masonHead.add(neck);

    const headGeo = new THREE.SphereGeometry(0.13, 12, 12);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.set(0, 0.18, 0);
    head.scale.set(0.9, 1.05, 0.95);
    head.castShadow = true;
    this.masonHead.add(head);

    // Safety Hard Hat with brim
    const helmetDomeGeo = new THREE.SphereGeometry(0.155, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2);
    const helmet = new THREE.Mesh(helmetDomeGeo, helmetYellow);
    helmet.position.set(0, 0.22, 0);
    this.masonHead.add(helmet);

    const brimGeo = new THREE.CylinderGeometry(0.18, 0.19, 0.02, 12);
    const brim = new THREE.Mesh(brimGeo, helmetYellow);
    brim.position.set(0, 0.22, 0.02);
    this.masonHead.add(brim);

    torsoGroup.add(this.masonHead);

    // 4. Arms & Hands
    // Left Arm (Holding resting brick/spirit level)
    this.masonLeftArm.position.set(-0.27, 0.44, 0);
    const leftArmUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.32, 8), vestOrange);
    leftArmUpper.position.set(-0.06, -0.14, 0.05);
    leftArmUpper.rotation.z = 0.3;
    this.masonLeftArm.add(leftArmUpper);

    const leftForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.3, 8), skinMat);
    leftForearm.position.set(-0.06, -0.36, 0.2);
    leftForearm.rotation.x = -0.9;
    this.masonLeftArm.add(leftForearm);

    // Spirit level held in left hand
    const levelGeo = new THREE.BoxGeometry(0.04, 0.07, 0.38);
    const levelMat = new THREE.MeshStandardMaterial({ color: 0x00e676, roughness: 0.4 });
    const spiritLevel = new THREE.Mesh(levelGeo, levelMat);
    spiritLevel.position.set(-0.08, -0.42, 0.35);
    spiritLevel.rotation.y = 0.2;
    this.masonLeftArm.add(spiritLevel);

    torsoGroup.add(this.masonLeftArm);

    // Right Arm (Active mason arm wielding the trowel)
    this.masonRightArm.position.set(0.27, 0.44, 0);
    const rightArmUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.32, 8), vestOrange);
    rightArmUpper.position.set(0.06, -0.14, 0.08);
    rightArmUpper.rotation.z = -0.25;
    this.masonRightArm.add(rightArmUpper);

    const rightForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.32, 8), skinMat);
    rightForearm.position.set(0.08, -0.32, 0.22);
    rightForearm.rotation.x = -1.1;
    this.masonRightArm.add(rightForearm);

    // Triangular Brick Trowel
    const trowelGroup = new THREE.Group();
    trowelGroup.position.set(0.1, -0.42, 0.35);

    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.14, 6), woodHandle);
    handle.rotation.x = Math.PI / 2;
    trowelGroup.add(handle);

    // Triangular steel blade
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, 0);
    bladeShape.lineTo(0.08, -0.2);
    bladeShape.lineTo(-0.08, -0.2);
    bladeShape.closePath();

    const bladeGeo = new THREE.ShapeGeometry(bladeShape);
    this.trowelMesh = new THREE.Mesh(bladeGeo, steelMat);
    this.trowelMesh.rotation.x = -Math.PI / 2;
    this.trowelMesh.position.set(0, -0.02, 0.08);
    trowelGroup.add(this.trowelMesh);

    this.masonRightArm.add(trowelGroup);
    torsoGroup.add(this.masonRightArm);

    this.masonGroup.add(torsoGroup);

    // Mortar bucket next to mason
    const bucketGeo = new THREE.CylinderGeometry(0.22, 0.17, 0.35, 10);
    const bucketMat = new THREE.MeshStandardMaterial({ color: 0x37474f, roughness: 0.6 });
    const bucket = new THREE.Mesh(bucketGeo, bucketMat);
    bucket.position.set(0.5, 0.17, 0.3);
    bucket.castShadow = true;
    this.masonGroup.add(bucket);

    // Mortar paste in bucket
    const mortarGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.04, 10);
    const mortarMat = new THREE.MeshStandardMaterial({ color: 0x8d8d82, roughness: 0.95 });
    const mortar = new THREE.Mesh(mortarGeo, mortarMat);
    mortar.position.set(0.5, 0.33, 0.3);
    this.masonGroup.add(mortar);
  }

  // =========================================================================
  // WORKER 2: SITE SUPERVISOR / CIVIL AUDITOR (Checking tablet, inspecting work)
  // =========================================================================
  private buildSupervisor() {
    // Scaled realistically: ~1.82m tall, positioned at observation vantage
    this.supervisorGroup.position.set(-3.8, 0.5, 5.8);
    this.supervisorGroup.rotation.y = Math.PI * 0.2; // Facing the building structure

    const skinMat = new THREE.MeshStandardMaterial({ color: 0xd29d74, roughness: 0.7 });
    const jacketTeal = new THREE.MeshStandardMaterial({ color: 0x178f88, roughness: 0.5 }); // WENSURE teal supervisor jacket
    const darkForest = new THREE.MeshStandardMaterial({ color: 0x17231f, roughness: 0.8 }); // WENSURE dark trousers
    const reflectiveWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.6 });
    const helmetWhite = new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.25, metalness: 0.15 }); // Engineer white hard hat
    const tabletFrameMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3, metalness: 0.8 });
    const tabletGlowMat = new THREE.MeshBasicMaterial({ color: 0x64ffda }); // Illuminated screen

    // 1. Legs and Clean Safety Shoes
    const shoeGeo = new THREE.BoxGeometry(0.17, 0.13, 0.31);
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0x2e1c14, roughness: 0.7 });
    const leftShoe = new THREE.Mesh(shoeGeo, shoeMat);
    leftShoe.position.set(-0.16, 0.065, 0.05);
    leftShoe.castShadow = true;
    this.supervisorGroup.add(leftShoe);

    const rightShoe = new THREE.Mesh(shoeGeo, shoeMat);
    rightShoe.position.set(0.16, 0.065, -0.04);
    rightShoe.castShadow = true;
    this.supervisorGroup.add(rightShoe);

    const legGeo = new THREE.CylinderGeometry(0.1, 0.09, 0.78, 8);
    const leftLeg = new THREE.Mesh(legGeo, darkForest);
    leftLeg.position.set(-0.16, 0.5, 0.03);
    leftLeg.castShadow = true;
    this.supervisorGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, darkForest);
    rightLeg.position.set(0.16, 0.5, -0.03);
    rightLeg.castShadow = true;
    this.supervisorGroup.add(rightLeg);

    // Pelvis
    const pelvis = new THREE.Mesh(new THREE.BoxGeometry(0.43, 0.2, 0.25), darkForest);
    pelvis.position.set(0, 0.92, 0);
    this.supervisorGroup.add(pelvis);

    // 2. Torso (Upright, professional auditor posture)
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 1.02, 0);

    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.54, 0.27), jacketTeal);
    chest.position.set(0, 0.27, 0);
    chest.castShadow = true;
    torsoGroup.add(chest);

    // WENSURE Auditor Badge on chest
    const badgeGeo = new THREE.BoxGeometry(0.08, 0.06, 0.02);
    const badgeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const badge = new THREE.Mesh(badgeGeo, badgeMat);
    badge.position.set(0.12, 0.38, 0.14);
    torsoGroup.add(badge);

    // Retroreflective silver stripes
    const stripeGeo = new THREE.BoxGeometry(0.47, 0.05, 0.28);
    const stripe = new THREE.Mesh(stripeGeo, reflectiveWhite);
    stripe.position.set(0, 0.2, 0);
    torsoGroup.add(stripe);

    // 3. Head & White Hard Hat
    this.supervisorHead.position.set(0, 0.6, 0.02);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.085, 0.12, 8), skinMat);
    neck.position.y = 0.06;
    this.supervisorHead.add(neck);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 12), skinMat);
    head.position.set(0, 0.18, 0);
    head.scale.set(0.9, 1.05, 0.95);
    head.castShadow = true;
    this.supervisorHead.add(head);

    // White Engineer Helmet
    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.155, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2), helmetWhite);
    helmet.position.set(0, 0.22, 0);
    this.supervisorHead.add(helmet);

    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.19, 0.02, 12), helmetWhite);
    brim.position.set(0, 0.22, 0.02);
    this.supervisorHead.add(brim);

    // Subtle dark safety glasses
    const glassesGeo = new THREE.BoxGeometry(0.18, 0.04, 0.05);
    const glassesMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1 });
    const glasses = new THREE.Mesh(glassesGeo, glassesMat);
    glasses.position.set(0, 0.18, 0.12);
    this.supervisorHead.add(glasses);

    torsoGroup.add(this.supervisorHead);

    // 4. Arms & Digital Audit Tablet
    // Left Arm (Holding the tablet base)
    this.supervisorLeftArm.position.set(-0.27, 0.46, 0);
    const leftUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.3, 8), jacketTeal);
    leftUpper.position.set(-0.04, -0.14, 0.08);
    leftUpper.rotation.x = 0.6;
    leftUpper.rotation.z = 0.3;
    this.supervisorLeftArm.add(leftUpper);

    const leftFore = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.3, 8), skinMat);
    leftFore.position.set(-0.02, -0.28, 0.24);
    leftFore.rotation.x = -1.25;
    leftFore.rotation.y = 0.3;
    this.supervisorLeftArm.add(leftFore);

    // The Digital Tablet (iPad Pro / Rugged Survey Tablet)
    const tabletGroup = new THREE.Group();
    tabletGroup.position.set(0, -0.34, 0.4);
    tabletGroup.rotation.x = -Math.PI * 0.35; // Tilted toward supervisor's eyes

    const tabletBody = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.28, 0.02), tabletFrameMat);
    tabletGroup.add(tabletBody);

    this.tabletScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.24), tabletGlowMat);
    this.tabletScreen.position.z = 0.012;
    tabletGroup.add(this.tabletScreen);

    // AR Survey Scanning Beam (Projects upward from tablet toward building column)
    this.arScanBeam = new THREE.Group();
    const beamGeo = new THREE.ConeGeometry(0.9, 4.2, 12, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x178f88,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    });
    const beamCone = new THREE.Mesh(beamGeo, beamMat);
    beamCone.position.set(0, 2.1, 0);
    beamCone.rotation.x = -Math.PI / 2;
    this.arScanBeam.add(beamCone);
    this.arScanBeam.position.set(0, 0, 0.1);
    tabletGroup.add(this.arScanBeam);

    this.supervisorLeftArm.add(tabletGroup);
    torsoGroup.add(this.supervisorLeftArm);

    // Right Arm (Finger tapping tablet screen)
    this.supervisorRightArm.position.set(0.27, 0.46, 0);
    const rightUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.3, 8), jacketTeal);
    rightUpper.position.set(0.04, -0.14, 0.08);
    rightUpper.rotation.x = 0.6;
    rightUpper.rotation.z = -0.3;
    this.supervisorRightArm.add(rightUpper);

    const rightFore = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.3, 8), skinMat);
    rightFore.position.set(0.02, -0.28, 0.24);
    rightFore.rotation.x = -1.35;
    rightFore.rotation.y = -0.4;
    this.supervisorRightArm.add(rightFore);

    torsoGroup.add(this.supervisorRightArm);

    this.supervisorGroup.add(torsoGroup);
  }

  // =========================================================================
  // ANIMATION & SCROLL CHOREOGRAPHY
  // =========================================================================
  public update(scrollProgress: number, elapsedTime: number) {
    // Workers are visible starting from foundation/structure stages (0.15) to finish
    const isVisible = scrollProgress > 0.12;
    this.group.visible = isVisible;
    if (!isVisible) return;

    // ----------------------------------------------------
    // WORKER 1 (MASON): Continuous realistic troweling/tapping
    // ----------------------------------------------------
    if (scrollProgress < 0.75) {
      // Active building phase
      const cycle = elapsedTime * 3.2;
      // Rhythmic arm motion: scoop, spread, tap brick
      this.masonRightArm.rotation.x = Math.sin(cycle) * 0.28;
      this.masonRightArm.rotation.z = Math.cos(cycle) * 0.15;
      this.trowelMesh.rotation.z = Math.sin(cycle) * 0.2;

      // Mason head looks down at brick line
      this.masonHead.rotation.x = 0.28 + Math.sin(cycle * 0.5) * 0.08;
      this.masonHead.rotation.y = Math.cos(cycle * 0.5) * 0.12;
    } else {
      // Completed phase (Scene 7): Mason standing proudly, admiring finished villa
      this.masonRightArm.rotation.x = 0;
      this.masonRightArm.rotation.z = 0;
      this.masonHead.rotation.x = -0.15; // Looking up at finished facade
      this.masonHead.rotation.y = 0.2;
    }

    // ----------------------------------------------------
    // WORKER 2 (SUPERVISOR): Inspection, checking tablet, AR beam
    // ----------------------------------------------------
    if (scrollProgress < 0.75) {
      const supCycle = elapsedTime * 1.8;
      // Supervisor alternates looking up at structure and down at tablet
      const lookLookCycle = Math.sin(supCycle);
      this.supervisorHead.rotation.x = lookLookCycle > 0 ? -0.25 : 0.32; // Tilt up to column vs down to screen
      this.supervisorHead.rotation.y = Math.sin(supCycle * 0.5) * 0.15;

      // Finger tapping on tablet
      this.supervisorRightArm.rotation.x = Math.sin(elapsedTime * 4.5) * 0.06;

      // Tablet pulsing screen
      const pulse = 0.6 + Math.sin(elapsedTime * 6) * 0.4;
      (this.tabletScreen.material as THREE.MeshBasicMaterial).color.setRGB(0.1, 0.8 * pulse + 0.2, 0.7 * pulse + 0.3);

      // AR Beam subtle scanning rotation
      this.arScanBeam.rotation.z = Math.sin(elapsedTime * 2.0) * 0.15;
      this.arScanBeam.visible = true;
    } else {
      // Finished phase: Supervisor verified completion with green tablet checkmark
      this.supervisorHead.rotation.x = -0.1;
      this.supervisorHead.rotation.y = -0.2;
      (this.tabletScreen.material as THREE.MeshBasicMaterial).color.setHex(0x00e676); // Green verified signoff
      this.arScanBeam.visible = false;
    }

    // Scene 4 specific: Supervisor turns slightly toward camera when camera zooms in
    if (scrollProgress >= 0.42 && scrollProgress <= 0.56) {
      const tScene4 = (scrollProgress - 0.42) / 0.14;
      this.supervisorGroup.rotation.y = Math.PI * 0.2 + Math.sin(tScene4 * Math.PI) * 0.35;
    }
  }
}
