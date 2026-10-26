import * as THREE from 'three';

export class HouseStructure {
  public group: THREE.Group;
  public groundSlab: THREE.Mesh;
  public groundColumns: THREE.Group;
  public firstFloorBeamsAndSlab: THREE.Group;
  public groundBrickWalls: THREE.Group;
  public firstFloorColumns: THREE.Group;
  public firstFloorWalls: THREE.Group;
  public roofSlabAndPergola: THREE.Group;
  public scaffolding: THREE.Group;
  public siteMaterials: THREE.Group;

  // Grid coordinates matching FoundationStage
  private columnCoords = [
    { x: -5, z: -4 },
    { x: -1.5, z: -4 },
    { x: 2, z: -4 },
    { x: 5.5, z: -4 },

    { x: -5, z: 0 },
    { x: -1.5, z: 0 },
    { x: 2, z: 0 },
    { x: 5.5, z: 0 },

    { x: -5, z: 4 },
    { x: -1.5, z: 4 },
    { x: 2, z: 4 },
    { x: 5.5, z: 4 },
  ];

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'HouseStructure';

    this.groundColumns = new THREE.Group();
    this.firstFloorBeamsAndSlab = new THREE.Group();
    this.groundBrickWalls = new THREE.Group();
    this.firstFloorColumns = new THREE.Group();
    this.firstFloorWalls = new THREE.Group();
    this.roofSlabAndPergola = new THREE.Group();
    this.scaffolding = new THREE.Group();
    this.siteMaterials = new THREE.Group();

    // 1. Ground Floor RCC Slab
    const slabGeo = new THREE.BoxGeometry(11.4, 0.2, 8.8);
    const concreteMat = new THREE.MeshStandardMaterial({
      color: 0x989892,
      roughness: 0.65,
      metalness: 0.05,
    });
    this.groundSlab = new THREE.Mesh(slabGeo, concreteMat);
    this.groundSlab.position.set(0.25, 0.5, 0);
    this.groundSlab.castShadow = true;
    this.groundSlab.receiveShadow = true;
    this.group.add(this.groundSlab);

    this.group.add(this.groundColumns);
    this.group.add(this.firstFloorBeamsAndSlab);
    this.group.add(this.groundBrickWalls);
    this.group.add(this.firstFloorColumns);
    this.group.add(this.firstFloorWalls);
    this.group.add(this.roofSlabAndPergola);
    this.group.add(this.scaffolding);
    this.group.add(this.siteMaterials);

    this.buildGroundColumns(concreteMat);
    this.buildFirstFloorBeamsAndSlab(concreteMat);
    this.buildGroundBrickWalls();
    this.buildFirstFloorColumns(concreteMat);
    this.buildFirstFloorWalls();
    this.buildRoofSlabAndPergola(concreteMat);
    this.buildScaffolding();
    this.buildSiteMaterials();
  }

  private buildGroundColumns(mat: THREE.Material) {
    // 12 RCC columns (0.35m x 0.35m x 3.0m high)
    const colGeo = new THREE.BoxGeometry(0.35, 3.0, 0.35);
    this.columnCoords.forEach((pt) => {
      const col = new THREE.Mesh(colGeo, mat);
      col.position.set(pt.x, 2.1, pt.z);
      col.castShadow = true;
      col.receiveShadow = true;
      this.groundColumns.add(col);
    });
  }

  private buildFirstFloorBeamsAndSlab(mat: THREE.Material) {
    // Beams (connecting column tops at Y = 3.6m)
    [-4, 0, 4].forEach((z) => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(11.2, 0.4, 0.35), mat);
      b.position.set(0.25, 3.6, z);
      b.castShadow = true;
      this.firstFloorBeamsAndSlab.add(b);
    });

    [-5, -1.5, 2, 5.5].forEach((x) => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.4, 8.4), mat);
      b.position.set(x, 3.6, 0);
      b.castShadow = true;
      this.firstFloorBeamsAndSlab.add(b);
    });

    // First Floor Slab with modern cantilevered balcony projecting outward at front (Z > 4)
    // Main slab: 11.4m x 0.22m x 9.2m
    const slab1 = new THREE.Mesh(new THREE.BoxGeometry(11.4, 0.22, 9.2), mat);
    slab1.position.set(0.25, 3.75, 0);
    slab1.castShadow = true;
    slab1.receiveShadow = true;
    this.firstFloorBeamsAndSlab.add(slab1);

    // Cantilever Balcony slab projecting 2.2m beyond front
    const balcSlab = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.2, 2.4), mat);
    balcSlab.position.set(2.0, 3.75, 5.8);
    balcSlab.castShadow = true;
    balcSlab.receiveShadow = true;
    this.firstFloorBeamsAndSlab.add(balcSlab);
  }

  private buildGroundBrickWalls() {
    // Rich terracotta clay brick masonry material
    const brickMat = new THREE.MeshStandardMaterial({
      color: 0xa85338, // Terracotta construction brick
      roughness: 0.85,
    });

    // Back wall sections (Z = -4) with window cutout
    const backWall1 = new THREE.Mesh(new THREE.BoxGeometry(4.5, 2.8, 0.25), brickMat);
    backWall1.position.set(-3.25, 2.0, -4);
    backWall1.castShadow = true;
    this.groundBrickWalls.add(backWall1);

    const backWall2 = new THREE.Mesh(new THREE.BoxGeometry(4.5, 2.8, 0.25), brickMat);
    backWall2.position.set(3.75, 2.0, -4);
    backWall2.castShadow = true;
    this.groundBrickWalls.add(backWall2);

    // Left wall sections (X = -5)
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.25, 2.8, 7.8), brickMat);
    leftWall.position.set(-5, 2.0, 0);
    leftWall.castShadow = true;
    this.groundBrickWalls.add(leftWall);

    // Right wall sections (X = 5.5)
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.25, 2.8, 7.8), brickMat);
    rightWall.position.set(5.5, 2.0, 0);
    rightWall.castShadow = true;
    this.groundBrickWalls.add(rightWall);

    // Front facade walls (Z = 4) leaving entrance portico and large front window
    const frontWall1 = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.8, 0.25), brickMat);
    frontWall1.position.set(-3.25, 2.0, 4);
    frontWall1.castShadow = true;
    this.groundBrickWalls.add(frontWall1);

    const frontWall2 = new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.8, 0.25), brickMat);
    frontWall2.position.set(3.8, 2.0, 4);
    frontWall2.castShadow = true;
    this.groundBrickWalls.add(frontWall2);

    // Interior partition wall
    const interiorWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.8, 4.0), brickMat);
    interiorWall.position.set(-1.5, 2.0, -1.8);
    interiorWall.castShadow = true;
    this.groundBrickWalls.add(interiorWall);
  }

  private buildFirstFloorColumns(mat: THREE.Material) {
    const colGeo = new THREE.BoxGeometry(0.35, 2.8, 0.35);
    // Key columns continuing to upper level
    const upperColCoords = [
      { x: -5, z: -4 },
      { x: -1.5, z: -4 },
      { x: 2, z: -4 },
      { x: 5.5, z: -4 },
      { x: -5, z: 0 },
      { x: 2, z: 0 },
      { x: 5.5, z: 0 },
      { x: -5, z: 4 },
      { x: 2, z: 4 },
      { x: 5.5, z: 4 },
      // Cantilever balcony corner columns
      { x: 5.25, z: 6.8 },
      { x: -1.25, z: 6.8 },
    ];

    upperColCoords.forEach((pt) => {
      const col = new THREE.Mesh(colGeo, mat);
      col.position.set(pt.x, 5.25, pt.z);
      col.castShadow = true;
      this.firstFloorColumns.add(col);
    });
  }

  private buildFirstFloorWalls() {
    const brickMat = new THREE.MeshStandardMaterial({
      color: 0x9b4d35,
      roughness: 0.85,
    });

    // Upper walls framing bedrooms and modern balcony access
    const upperLeft = new THREE.Mesh(new THREE.BoxGeometry(0.25, 2.6, 7.8), brickMat);
    upperLeft.position.set(-5, 5.15, 0);
    upperLeft.castShadow = true;
    this.firstFloorWalls.add(upperLeft);

    const upperBack = new THREE.Mesh(new THREE.BoxGeometry(10.2, 2.6, 0.25), brickMat);
    upperBack.position.set(0.25, 5.15, -4);
    upperBack.castShadow = true;
    this.firstFloorWalls.add(upperBack);

    const upperRight = new THREE.Mesh(new THREE.BoxGeometry(0.25, 2.6, 7.8), brickMat);
    upperRight.position.set(5.5, 5.15, 0);
    upperRight.castShadow = true;
    this.firstFloorWalls.add(upperRight);
  }

  private buildRoofSlabAndPergola(mat: THREE.Material) {
    // Upper roof slab
    const roofGeo = new THREE.BoxGeometry(11.8, 0.22, 9.4);
    const roof = new THREE.Mesh(roofGeo, mat);
    roof.position.set(0.25, 6.65, 0);
    roof.castShadow = true;
    this.roofSlabAndPergola.add(roof);

    // Parapet safety wall around terrace
    const parapetMat = new THREE.MeshStandardMaterial({ color: 0x8d8d87, roughness: 0.8 });
    const parFront = new THREE.Mesh(new THREE.BoxGeometry(11.8, 0.6, 0.2), parapetMat);
    parFront.position.set(0.25, 7.05, 4.6);
    this.roofSlabAndPergola.add(parFront);

    // Modern architectural wooden pergola over terrace
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x5a3d28, // Teak wood finish
      roughness: 0.6,
    });

    for (let x = -2; x <= 4.5; x += 0.9) {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.24, 5.0), woodMat);
      beam.position.set(x, 7.25, 1.8);
      beam.castShadow = true;
      this.roofSlabAndPergola.add(beam);
    }
  }

  private buildScaffolding() {
    // Realistic metal tube construction scaffolding
    const pipeMat = new THREE.MeshStandardMaterial({
      color: 0x6e7880, // Galvanized steel tubes
      roughness: 0.4,
      metalness: 0.8,
    });

    const netMat = new THREE.MeshStandardMaterial({
      color: 0x1f5e3b, // Green construction safety debris netting
      transparent: true,
      opacity: 0.45,
      roughness: 0.9,
    });

    // Flank right side scaffolding
    const pipeGeoV = new THREE.CylinderGeometry(0.03, 0.03, 7.0, 6);
    const pipeGeoH = new THREE.CylinderGeometry(0.025, 0.025, 8.5, 6);

    for (let z = -3.8; z <= 4.2; z += 2.0) {
      [6.4, 7.4].forEach((x) => {
        const vPipe = new THREE.Mesh(pipeGeoV, pipeMat);
        vPipe.position.set(x, 3.5, z);
        this.scaffolding.add(vPipe);
      });
    }

    // Horizontal runners
    for (let y = 1.2; y <= 6.5; y += 1.8) {
      const hPipe1 = new THREE.Mesh(pipeGeoH, pipeMat);
      hPipe1.rotation.x = Math.PI / 2;
      hPipe1.position.set(6.4, y, 0.2);
      this.scaffolding.add(hPipe1);

      const hPipe2 = new THREE.Mesh(pipeGeoH, pipeMat);
      hPipe2.rotation.x = Math.PI / 2;
      hPipe2.position.set(7.4, y, 0.2);
      this.scaffolding.add(hPipe2);
    }

    // Safety debris netting sheet
    const netMesh = new THREE.Mesh(new THREE.PlaneGeometry(8.2, 5.4), netMat);
    netMesh.position.set(7.42, 3.8, 0.2);
    netMesh.rotation.y = -Math.PI / 2;
    this.scaffolding.add(netMesh);
  }

  private buildSiteMaterials() {
    // Organized construction materials on the site ground
    // 1. Stack of red clay bricks on wooden pallet
    const palletMat = new THREE.MeshStandardMaterial({ color: 0x7c5e42, roughness: 0.85 });
    const palletGeo = new THREE.BoxGeometry(1.4, 0.15, 1.4);
    const pallet = new THREE.Mesh(palletGeo, palletMat);
    pallet.position.set(-7.5, 0.1, 4.5);
    this.siteMaterials.add(pallet);

    const brickStackMat = new THREE.MeshStandardMaterial({ color: 0xb55333, roughness: 0.9 });
    const brickStack = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 1.2), brickStackMat);
    brickStack.position.set(-7.5, 0.62, 4.5);
    brickStack.castShadow = true;
    this.siteMaterials.add(brickStack);

    // 2. Sand heap (conical aggregate pile)
    const sandMat = new THREE.MeshStandardMaterial({ color: 0xb09868, roughness: 0.95 });
    const sandPile = new THREE.Mesh(new THREE.ConeGeometry(1.6, 0.9, 12), sandMat);
    sandPile.position.set(-7.8, 0.45, 1.5);
    sandPile.castShadow = true;
    this.siteMaterials.add(sandPile);

    // 3. Stacks of cement bags on pallet
    const cementBagMat = new THREE.MeshStandardMaterial({ color: 0x6e7175, roughness: 0.7 });
    for (let layer = 0; layer < 4; layer++) {
      const bag = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.18, 0.5), cementBagMat);
      bag.position.set(8.2, 0.12 + layer * 0.18, 5.5);
      bag.castShadow = true;
      this.siteMaterials.add(bag);
    }
  }

  public update(scrollProgress: number) {
    // Construction sequence:
    // 0.24 - 0.32: Ground slab and columns rise
    // 0.30 - 0.40: First floor beams, slab, and brick walls emerge
    // 0.38 - 0.48: First floor columns & walls
    // 0.46 - 0.55: Roof slab & pergola
    // 0.68+: Scaffolding dismantled as building is completed!

    if (scrollProgress < 0.22) {
      this.groundSlab.scale.set(1, 0.001, 1);
      this.groundColumns.scale.set(1, 0.001, 1);
      this.firstFloorBeamsAndSlab.scale.set(1, 0.001, 1);
      this.groundBrickWalls.scale.set(1, 0.001, 1);
      this.firstFloorColumns.scale.set(1, 0.001, 1);
      this.firstFloorWalls.scale.set(1, 0.001, 1);
      this.roofSlabAndPergola.scale.set(1, 0.001, 1);
      this.scaffolding.scale.set(1, 0.001, 1);
      return;
    }

    // Ground slab
    const tSlab0 = Math.min(1, Math.max(0, (scrollProgress - 0.22) / 0.04));
    this.groundSlab.scale.set(1, tSlab0, 1);

    // Ground columns
    const tCol0 = Math.min(1, Math.max(0, (scrollProgress - 0.24) / 0.06));
    this.groundColumns.scale.set(1, tCol0, 1);
    this.groundColumns.position.y = (tCol0 - 1) * 1.5;

    // Ground brick walls
    const tWall0 = Math.min(1, Math.max(0, (scrollProgress - 0.28) / 0.08));
    this.groundBrickWalls.scale.set(1, tWall0, 1);
    this.groundBrickWalls.position.y = (tWall0 - 1) * 1.4;

    // First floor beams and slab
    const tSlab1 = Math.min(1, Math.max(0, (scrollProgress - 0.32) / 0.06));
    this.firstFloorBeamsAndSlab.scale.set(1, tSlab1, 1);

    // Upper columns
    const tCol1 = Math.min(1, Math.max(0, (scrollProgress - 0.36) / 0.06));
    this.firstFloorColumns.scale.set(1, tCol1, 1);
    this.firstFloorColumns.position.y = (tCol1 - 1) * 1.4;

    // Upper walls
    const tWall1 = Math.min(1, Math.max(0, (scrollProgress - 0.40) / 0.07));
    this.firstFloorWalls.scale.set(1, tWall1, 1);

    // Roof & Pergola
    const tRoof = Math.min(1, Math.max(0, (scrollProgress - 0.44) / 0.08));
    this.roofSlabAndPergola.scale.set(1, tRoof, 1);

    // Scaffolding: rises during active build (0.28 to 0.4), then dismantles/fades away after finishing (0.68)
    if (scrollProgress >= 0.26 && scrollProgress < 0.68) {
      const tScaff = Math.min(1, (scrollProgress - 0.26) / 0.06);
      this.scaffolding.scale.set(1, tScaff, 1);
      this.scaffolding.visible = true;
    } else if (scrollProgress >= 0.68) {
      // Dismantled scaffolding for finished home reveal
      const tFade = Math.max(0, 1 - (scrollProgress - 0.68) / 0.06);
      this.scaffolding.scale.set(1, tFade, 1);
      this.scaffolding.visible = tFade > 0.01;
    } else {
      this.scaffolding.scale.set(1, 0.001, 1);
      this.scaffolding.visible = false;
    }

    // Site materials clean up around progress 0.68
    if (scrollProgress >= 0.68) {
      const tClean = Math.max(0, 1 - (scrollProgress - 0.68) / 0.05);
      this.siteMaterials.scale.set(tClean, tClean, tClean);
      this.siteMaterials.visible = tClean > 0.01;
    } else {
      this.siteMaterials.scale.set(1, 1, 1);
      this.siteMaterials.visible = true;
    }
  }
}
