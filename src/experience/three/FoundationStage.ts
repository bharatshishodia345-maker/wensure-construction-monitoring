import * as THREE from 'three';

export class FoundationStage {
  public group: THREE.Group;
  public excavationTrenches: THREE.Group;
  public concreteFootings: THREE.Group;
  public rebarCages: THREE.Group;
  public plinthBeams: THREE.Group;

  // Key column grid points for a 14m x 12m villa (G+1)
  // X: -5, -1.5, 2, 5.5
  // Z: -4, 0, 4
  public columnPoints = [
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
    this.group.name = 'FoundationStage';

    this.excavationTrenches = new THREE.Group();
    this.concreteFootings = new THREE.Group();
    this.rebarCages = new THREE.Group();
    this.plinthBeams = new THREE.Group();

    this.group.add(this.excavationTrenches);
    this.group.add(this.concreteFootings);
    this.group.add(this.rebarCages);
    this.group.add(this.plinthBeams);

    this.buildExcavation();
    this.buildFootings();
    this.buildRebar();
    this.buildPlinthBeams();
  }

  private buildExcavation() {
    // Soil excavation trenches around footings
    const trenchMat = new THREE.MeshStandardMaterial({
      color: 0x3d2b1f, // Dark freshly excavated earth
      roughness: 0.95,
    });

    const gravelMat = new THREE.MeshStandardMaterial({
      color: 0x8a857b, // Aggregate gravel bed (PCC base)
      roughness: 0.9,
    });

    this.columnPoints.forEach((pt) => {
      // Trench pit (1.6m x 1.6m x 0.4m deep)
      const pitGeo = new THREE.BoxGeometry(1.6, 0.4, 1.6);
      const pit = new THREE.Mesh(pitGeo, trenchMat);
      pit.position.set(pt.x, -0.2, pt.z);
      pit.receiveShadow = true;
      this.excavationTrenches.add(pit);

      // Gravel bed inside pit
      const gravelGeo = new THREE.BoxGeometry(1.4, 0.08, 1.4);
      const gravel = new THREE.Mesh(gravelGeo, gravelMat);
      gravel.position.set(pt.x, -0.16, pt.z);
      gravel.receiveShadow = true;
      this.excavationTrenches.add(gravel);
    });
  }

  private buildFootings() {
    // Stepped concrete isolated footings
    const concreteMat = new THREE.MeshStandardMaterial({
      color: 0x9e9e98, // Structural cured concrete
      roughness: 0.7,
      metalness: 0.05,
    });

    this.columnPoints.forEach((pt) => {
      // Base pad: 1.2m x 0.3m x 1.2m
      const padGeo = new THREE.BoxGeometry(1.2, 0.3, 1.2);
      const pad = new THREE.Mesh(padGeo, concreteMat);
      pad.position.set(pt.x, 0.05, pt.z);
      pad.castShadow = true;
      pad.receiveShadow = true;
      this.concreteFootings.add(pad);

      // Column pedestal stub
      const pedGeo = new THREE.BoxGeometry(0.5, 0.35, 0.5);
      const ped = new THREE.Mesh(pedGeo, concreteMat);
      ped.position.set(pt.x, 0.32, pt.z);
      ped.castShadow = true;
      ped.receiveShadow = true;
      this.concreteFootings.add(ped);
    });
  }

  private buildRebar() {
    // Steel reinforcement rebar cages emerging from footings
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x61666d, // Ribbed rebar steel
      roughness: 0.35,
      metalness: 0.85,
    });

    const stirrupMat = new THREE.MeshStandardMaterial({
      color: 0xc45c26, // Rust-inhibitor / primer coated tie rings
      roughness: 0.4,
      metalness: 0.7,
    });

    this.columnPoints.forEach((pt) => {
      const cage = new THREE.Group();
      cage.position.set(pt.x, 0, pt.z);

      // 4 vertical rebar rods per column
      const rodGeo = new THREE.CylinderGeometry(0.018, 0.018, 3.8, 6);
      const offsets = [
        [-0.15, -0.15],
        [0.15, -0.15],
        [0.15, 0.15],
        [-0.15, 0.15],
      ];

      offsets.forEach(([ox, oz]) => {
        const rod = new THREE.Mesh(rodGeo, steelMat);
        rod.position.set(ox, 1.9, oz);
        rod.castShadow = true;
        cage.add(rod);
      });

      // Horizontal rebar stirrup ties (rings every 0.35m)
      const ringGeo = new THREE.TorusGeometry(0.2, 0.012, 4, 8);
      for (let y = 0.4; y <= 3.6; y += 0.35) {
        const ring = new THREE.Mesh(ringGeo, stirrupMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(0, y, 0);
        cage.add(ring);
      }

      this.rebarCages.add(cage);
    });
  }

  private buildPlinthBeams() {
    // Concrete plinth beams connecting columns at ground level
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0x9e9e98,
      roughness: 0.7,
      metalness: 0.05,
    });

    // Longitudinal beams along X (connecting -5 to 5.5) at Z = -4, 0, 4
    [-4, 0, 4].forEach((z) => {
      const beamGeo = new THREE.BoxGeometry(10.8, 0.3, 0.35);
      const beam = new THREE.Mesh(beamGeo, plinthMat);
      beam.position.set(0.25, 0.35, z);
      beam.castShadow = true;
      beam.receiveShadow = true;
      this.plinthBeams.add(beam);
    });

    // Transverse beams along Z (connecting -4 to 4) at X = -5, -1.5, 2, 5.5
    [-5, -1.5, 2, 5.5].forEach((x) => {
      const beamGeo = new THREE.BoxGeometry(0.35, 0.3, 8.2);
      const beam = new THREE.Mesh(beamGeo, plinthMat);
      beam.position.set(x, 0.35, 0);
      beam.castShadow = true;
      beam.receiveShadow = true;
      this.plinthBeams.add(beam);
    });
  }

  public update(scrollProgress: number) {
    // Scene 2 is active from progress 0.10 to 0.30
    // Stage 1: Excavation appears (0.10 to 0.16)
    if (scrollProgress < 0.10) {
      this.excavationTrenches.scale.set(1, 0.001, 1);
      this.concreteFootings.scale.set(1, 0.001, 1);
      this.rebarCages.scale.set(1, 0.001, 1);
      this.plinthBeams.scale.set(1, 0.001, 1);
    } else {
      // Excavation scale Y
      const tEx = Math.min(1, Math.max(0, (scrollProgress - 0.10) / 0.05));
      this.excavationTrenches.scale.set(1, tEx, 1);

      // Footings rise (0.13 to 0.19)
      const tFt = Math.min(1, Math.max(0, (scrollProgress - 0.13) / 0.06));
      this.concreteFootings.scale.set(1, tFt, 1);
      this.concreteFootings.position.y = (tFt - 1) * 0.3;

      // Rebar cages rise (0.16 to 0.24)
      const tRb = Math.min(1, Math.max(0, (scrollProgress - 0.16) / 0.07));
      this.rebarCages.scale.set(1, tRb, 1);

      // Plinth beams form (0.20 to 0.28)
      const tPb = Math.min(1, Math.max(0, (scrollProgress - 0.20) / 0.07));
      this.plinthBeams.scale.set(1, tPb, 1);
    }
  }
}
