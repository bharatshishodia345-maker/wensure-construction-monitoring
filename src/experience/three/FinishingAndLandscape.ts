import * as THREE from 'three';

export class FinishingAndLandscape {
  public group: THREE.Group;

  // Architectural finishing elements
  public exteriorPlasterWalls: THREE.Group;
  public glassWindows: THREE.Group;
  public balconyRailings: THREE.Group;
  public teakLouvers: THREE.Group;
  public entranceDoor: THREE.Mesh;

  // Landscaping elements
  public manicuredLawn: THREE.Mesh;
  public paverDriveway: THREE.Mesh;
  public boundaryWallAndGate: THREE.Group;
  public gardenPlants: THREE.Group;

  // Architectural lighting elements
  public lightsGroup: THREE.Group;
  public warmSconces: THREE.PointLight[] = [];
  public interiorGlowLights: THREE.PointLight[] = [];
  public bollardLights: THREE.PointLight[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'FinishingAndLandscape';

    this.exteriorPlasterWalls = new THREE.Group();
    this.glassWindows = new THREE.Group();
    this.balconyRailings = new THREE.Group();
    this.teakLouvers = new THREE.Group();
    this.entranceDoor = new THREE.Mesh();
    this.boundaryWallAndGate = new THREE.Group();
    this.gardenPlants = new THREE.Group();
    this.lightsGroup = new THREE.Group();

    // 1. Manicured Green Lawn
    const lawnGeo = new THREE.PlaneGeometry(22, 20);
    const lawnMat = new THREE.MeshStandardMaterial({
      color: 0x3e6b3b, // Lush manicured grass green
      roughness: 0.8,
    });
    this.manicuredLawn = new THREE.Mesh(lawnGeo, lawnMat);
    this.manicuredLawn.rotation.x = -Math.PI / 2;
    this.manicuredLawn.position.set(0, 0.03, 1);
    this.manicuredLawn.receiveShadow = true;
    this.group.add(this.manicuredLawn);

    // 2. Modern Paver Driveway
    const drivewayGeo = new THREE.PlaneGeometry(5.2, 12);
    const drivewayMat = new THREE.MeshStandardMaterial({
      color: 0x828487, // Architectural stone pavers
      roughness: 0.65,
    });
    this.paverDriveway = new THREE.Mesh(drivewayGeo, drivewayMat);
    this.paverDriveway.rotation.x = -Math.PI / 2;
    this.paverDriveway.position.set(-5.5, 0.035, 9.5);
    this.paverDriveway.receiveShadow = true;
    this.group.add(this.paverDriveway);

    this.group.add(this.exteriorPlasterWalls);
    this.group.add(this.glassWindows);
    this.group.add(this.balconyRailings);
    this.group.add(this.teakLouvers);
    this.group.add(this.boundaryWallAndGate);
    this.group.add(this.gardenPlants);
    this.group.add(this.lightsGroup);

    this.buildPlasterFinishes();
    this.buildGlassWindows();
    this.buildBalconyRailings();
    this.buildTeakLouversAndDoor();
    this.buildBoundaryAndGate();
    this.buildGardenPlants();
    this.buildArchitecturalLights();
  }

  private buildPlasterFinishes() {
    // Elegant off-white architectural stucco plaster
    const stuccoMat = new THREE.MeshStandardMaterial({
      color: 0xf5f3ee, // Crisp warm architectural off-white
      roughness: 0.45,
    });

    // Dark grey textured charcoal stone accent cladding
    const stoneCladMat = new THREE.MeshStandardMaterial({
      color: 0x2b3035,
      roughness: 0.6,
      metalness: 0.1,
    });

    // Front ground plaster skin (covers rough brickwork)
    const frontStucco = new THREE.Mesh(new THREE.BoxGeometry(3.3, 2.82, 0.28), stuccoMat);
    frontStucco.position.set(-3.25, 2.0, 4.02);
    frontStucco.castShadow = true;
    this.exteriorPlasterWalls.add(frontStucco);

    // Feature stone cladding wall flanking entrance
    const stoneWall = new THREE.Mesh(new THREE.BoxGeometry(2.4, 6.2, 0.3), stoneCladMat);
    stoneWall.position.set(0.6, 3.6, 4.05);
    stoneWall.castShadow = true;
    this.exteriorPlasterWalls.add(stoneWall);

    // First floor modern cantilever facade plaster
    const upperStucco = new THREE.Mesh(new THREE.BoxGeometry(6.6, 2.7, 0.28), stuccoMat);
    upperStucco.position.set(2.0, 5.2, 6.9);
    upperStucco.castShadow = true;
    this.exteriorPlasterWalls.add(upperStucco);

    // Side and rear plaster panels
    const leftPlaster = new THREE.Mesh(new THREE.BoxGeometry(0.28, 5.8, 8.0), stuccoMat);
    leftPlaster.position.set(-5.02, 3.6, 0);
    this.exteriorPlasterWalls.add(leftPlaster);

    const rightPlaster = new THREE.Mesh(new THREE.BoxGeometry(0.28, 5.8, 8.0), stuccoMat);
    rightPlaster.position.set(5.52, 3.6, 0);
    this.exteriorPlasterWalls.add(rightPlaster);
  }

  private buildGlassWindows() {
    // Floor-to-ceiling high performance tinted architectural glass
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xd6eef8,
      transmission: 0.65,
      opacity: 0.85,
      transparent: true,
      roughness: 0.05,
      ior: 1.52,
      metalness: 0.1,
    });

    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a, // Slim profile matte black aluminum frames
      roughness: 0.3,
      metalness: 0.8,
    });

    // 1. Ground floor living room panoramic window (front right: 3.2m x 2.4m)
    const win1 = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.3, 0.08), glassMat);
    win1.position.set(3.8, 2.0, 4.02);
    this.glassWindows.add(win1);

    // Black frame
    const frame1 = new THREE.Mesh(new THREE.BoxGeometry(2.9, 2.4, 0.1), frameMat);
    frame1.position.set(3.8, 2.0, 4.01);
    this.glassWindows.add(frame1);

    // 2. First floor bedroom master corner glass window
    const win2 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.3, 0.08), glassMat);
    win2.position.set(-3.2, 5.2, 4.02);
    this.glassWindows.add(win2);

    const frame2 = new THREE.Mesh(new THREE.BoxGeometry(3.7, 2.4, 0.1), frameMat);
    frame2.position.set(-3.2, 5.2, 4.01);
    this.glassWindows.add(frame2);

    // 3. Cantilever balcony sliding glass doors
    const win3 = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.3, 0.08), glassMat);
    win3.position.set(2.0, 5.2, 4.02);
    this.glassWindows.add(win3);
  }

  private buildBalconyRailings() {
    // Minimalist glass balustrade with brushed stainless handrail
    const railGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.85,
      transparent: true,
      opacity: 0.7,
      roughness: 0.05,
    });

    const handrailMat = new THREE.MeshStandardMaterial({
      color: 0xc8cbd0, // Brushed stainless steel
      roughness: 0.25,
      metalness: 0.9,
    });

    // Front railing of cantilever balcony (Z = 7.0, X from -1.2 to 5.2)
    const glassPane = new THREE.Mesh(new THREE.BoxGeometry(6.4, 1.0, 0.04), railGlassMat);
    glassPane.position.set(2.0, 4.4, 7.0);
    this.balconyRailings.add(glassPane);

    const handrail = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 6.4, 8), handrailMat);
    handrail.rotation.z = Math.PI / 2;
    handrail.position.set(2.0, 4.92, 7.0);
    this.balconyRailings.add(handrail);

    // Side railing return
    const sideGlass = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.0, 2.4), railGlassMat);
    sideGlass.position.set(5.2, 4.4, 5.8);
    this.balconyRailings.add(sideGlass);
  }

  private buildTeakLouversAndDoor() {
    // Teak wooden vertical architectural louvers (Pune villa modern luxury accent)
    const teakMat = new THREE.MeshStandardMaterial({
      color: 0x6e4528, // Golden teak wood
      roughness: 0.5,
      metalness: 0.05,
    });

    for (let x = -4.5; x <= -2.0; x += 0.28) {
      const louver = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.4, 0.15), teakMat);
      louver.position.set(x, 5.2, 4.15);
      louver.castShadow = true;
      this.teakLouvers.add(louver);
    }

    // Grand Entrance Door (Pivot teak door at X = -0.6, Y = 1.9, Z = 4.02)
    const doorGeo = new THREE.BoxGeometry(1.4, 2.5, 0.08);
    this.entranceDoor = new THREE.Mesh(doorGeo, teakMat);
    this.entranceDoor.position.set(-0.7, 1.9, 4.03);
    this.entranceDoor.castShadow = true;

    // Brass long vertical pull handle
    const handleMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.2, 8), handleMat);
    handle.position.set(-0.15, 1.9, 4.1);
    this.teakLouvers.add(handle);
    this.teakLouvers.add(this.entranceDoor);
  }

  private buildBoundaryAndGate() {
    // Modern low boundary wall along front road
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xe8e6e1, roughness: 0.6 });
    const gateMat = new THREE.MeshStandardMaterial({ color: 0x1f2326, roughness: 0.4, metalness: 0.8 });

    // Left wall segment
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(6.5, 1.1, 0.25), wallMat);
    leftWall.position.set(-6.8, 0.55, 13.8);
    this.boundaryWallAndGate.add(leftWall);

    // Right wall segment
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(7.2, 1.1, 0.25), wallMat);
    rightWall.position.set(6.4, 0.55, 13.8);
    this.boundaryWallAndGate.add(rightWall);

    // Sliding metal entry gate
    const gate = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.3, 0.06), gateMat);
    gate.position.set(-1.0, 0.65, 13.8);
    this.boundaryWallAndGate.add(gate);
  }

  private buildGardenPlants() {
    // Tropical landscaping: Ornamental Palm Trees & Boxwood shrubs
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x544030, roughness: 0.85 });
    const frondMat = new THREE.MeshStandardMaterial({ color: 0x2c5c36, roughness: 0.6 });
    const shrubMat = new THREE.MeshStandardMaterial({ color: 0x33691e, roughness: 0.75 });

    // Two elegant date palms flanking entrance path
    const palmPositions = [
      { x: 3.5, z: 9.5, h: 4.8 },
      { x: 6.8, z: 7.2, h: 5.5 },
      { x: -7.5, z: 7.5, h: 4.2 },
    ];

    palmPositions.forEach((p) => {
      const palm = new THREE.Group();
      // Curved trunk
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.22, p.h, 7), trunkMat);
      trunk.position.y = p.h / 2;
      trunk.rotation.z = (Math.random() - 0.5) * 0.12;
      trunk.castShadow = true;
      palm.add(trunk);

      // Palm fronds crown
      for (let i = 0; i < 7; i++) {
        const frond = new THREE.Mesh(new THREE.ConeGeometry(0.8, 2.2, 5), frondMat);
        frond.rotation.x = Math.PI / 3;
        frond.rotation.y = (i * Math.PI * 2) / 7;
        frond.position.y = p.h;
        frond.castShadow = true;
        palm.add(frond);
      }

      palm.position.set(p.x, 0, p.z);
      this.gardenPlants.add(palm);
    });

    // Manicured spherical boxwood hedges along entry pathway
    for (let z = 6.0; z <= 12.0; z += 1.8) {
      const hedge1 = new THREE.Mesh(new THREE.SphereGeometry(0.42, 8, 8), shrubMat);
      hedge1.position.set(-2.4, 0.4, z);
      hedge1.castShadow = true;
      this.gardenPlants.add(hedge1);

      const hedge2 = new THREE.Mesh(new THREE.SphereGeometry(0.38, 8, 8), shrubMat);
      hedge2.position.set(1.4, 0.38, z);
      hedge2.castShadow = true;
      this.gardenPlants.add(hedge2);
    }
  }

  private buildArchitecturalLights() {
    // Warm architectural lighting (3000K warm LED)
    // 1. Entrance Wall Sconces (flanking main door)
    const sconcePositions = [
      { x: -1.6, y: 2.1, z: 4.2 },
      { x: 0.2, y: 2.1, z: 4.2 },
    ];

    sconcePositions.forEach((pos) => {
      const light = new THREE.PointLight(0xffa726, 0.0, 7, 1.8);
      light.position.set(pos.x, pos.y, pos.z);
      this.lightsGroup.add(light);
      this.warmSconces.push(light);

      // Visual luminaire fixture
      const fixture = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.2, 8),
        new THREE.MeshBasicMaterial({ color: 0xffe082 })
      );
      fixture.position.set(pos.x, pos.y, pos.z - 0.05);
      this.lightsGroup.add(fixture);
    });

    // 2. Interior warm glow lights (illuminating through large windows)
    const interiorPositions = [
      { x: 3.5, y: 2.4, z: 1.0 }, // Living room
      { x: 1.5, y: 5.4, z: 2.0 }, // Upper master suite
    ];

    interiorPositions.forEach((pos) => {
      const intLight = new THREE.PointLight(0xffb74d, 0.0, 10, 1.5);
      intLight.position.set(pos.x, pos.y, pos.z);
      this.lightsGroup.add(intLight);
      this.interiorGlowLights.push(intLight);
    });

    // 3. Garden pathway bollards
    const bollardZ = [7.5, 10.5];
    bollardZ.forEach((bz) => {
      const bLight = new THREE.PointLight(0xffcc80, 0.0, 4, 2.0);
      bLight.position.set(-2.4, 0.5, bz);
      this.lightsGroup.add(bLight);
      this.bollardLights.push(bLight);
    });
  }

  public update(scrollProgress: number) {
    // Finishes and landscape appear starting at progress 0.62
    // Scene 6: 0.65 to 0.82
    // Scene 7 & 8: 0.82 to 1.00 (Golden hour to evening twilight with lights at 100%)

    if (scrollProgress < 0.60) {
      this.exteriorPlasterWalls.scale.set(1, 0.001, 1);
      this.glassWindows.scale.set(1, 0.001, 1);
      this.balconyRailings.scale.set(1, 0.001, 1);
      this.teakLouvers.scale.set(1, 0.001, 1);
      this.boundaryWallAndGate.scale.set(1, 0.001, 1);
      this.gardenPlants.scale.set(1, 0.001, 1);
      this.manicuredLawn.scale.set(1, 0.001, 1);
      this.paverDriveway.scale.set(1, 0.001, 1);
      this.setLightsIntensity(0);
      return;
    }

    // Stucco plaster coating finishes walls
    const tPlaster = Math.min(1, Math.max(0, (scrollProgress - 0.60) / 0.08));
    this.exteriorPlasterWalls.scale.set(1, tPlaster, 1);

    // Windows & Railings install
    const tWin = Math.min(1, Math.max(0, (scrollProgress - 0.64) / 0.07));
    this.glassWindows.scale.set(1, tWin, 1);
    this.balconyRailings.scale.set(1, tWin, 1);

    // Teak louvers & Grand entrance
    const tLouver = Math.min(1, Math.max(0, (scrollProgress - 0.67) / 0.07));
    this.teakLouvers.scale.set(1, tLouver, 1);

    // Landscaping & Garden flourish
    const tGarden = Math.min(1, Math.max(0, (scrollProgress - 0.70) / 0.08));
    this.boundaryWallAndGate.scale.set(1, tGarden, 1);
    this.gardenPlants.scale.set(1, tGarden, 1);
    this.manicuredLawn.scale.set(1, tGarden, 1);
    this.paverDriveway.scale.set(1, tGarden, 1);

    // Architectural Lighting turns on as evening approaches (progress 0.76 to 1.0)
    if (scrollProgress >= 0.76) {
      const tLight = Math.min(1, (scrollProgress - 0.76) / 0.12);
      this.setLightsIntensity(tLight);
    } else {
      this.setLightsIntensity(0);
    }
  }

  private setLightsIntensity(factor: number) {
    this.warmSconces.forEach((l) => (l.intensity = factor * 2.8));
    this.interiorGlowLights.forEach((l) => (l.intensity = factor * 3.5));
    this.bollardLights.forEach((l) => (l.intensity = factor * 1.5));
  }
}
