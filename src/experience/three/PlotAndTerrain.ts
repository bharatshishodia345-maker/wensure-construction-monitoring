import * as THREE from 'three';

export class PlotAndTerrain {
  public group: THREE.Group;
  public blueprintGrid: THREE.GridHelper;
  public plotBoundary: THREE.LineSegments;
  public groundMesh: THREE.Mesh;
  public roadMesh: THREE.Mesh;
  public surroundingHills: THREE.Group;
  public surveyPegs: THREE.Group;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'PlotAndTerrain';

    // 1. Natural Ground Terrain (Warm earthy soil / dry grass tone)
    const groundGeo = new THREE.PlaneGeometry(120, 120, 48, 48);
    // Add subtle procedural undulation to outer terrain
    const pos = groundGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const distFromCenter = Math.sqrt(x * x + y * y);
      if (distFromCenter > 16) {
        // Natural terrain rolling hills beyond the plot
        const wave = Math.sin(x * 0.1) * Math.cos(y * 0.1) * 1.4;
        pos.setZ(i, wave);
      }
    }
    groundGeo.computeVertexNormals();

    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x5a4f43, // Earthy brown soil
      roughness: 0.88,
      metalness: 0.05,
    });
    this.groundMesh = new THREE.Mesh(groundGeo, groundMat);
    this.groundMesh.rotation.x = -Math.PI / 2;
    this.groundMesh.receiveShadow = true;
    this.group.add(this.groundMesh);

    // 2. Front Access Road (Asphalt road leading to site)
    const roadGeo = new THREE.PlaneGeometry(120, 8);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x2d3032, // Dark asphalt
      roughness: 0.75,
      metalness: 0.1,
    });
    this.roadMesh = new THREE.Mesh(roadGeo, roadMat);
    this.roadMesh.rotation.x = -Math.PI / 2;
    this.roadMesh.position.set(0, 0.02, 18);
    this.roadMesh.receiveShadow = true;
    this.group.add(this.roadMesh);

    // Road markings (Subtle dashed center line)
    const stripeGeo = new THREE.PlaneGeometry(120, 0.25);
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0xcccccc });
    const stripeMesh = new THREE.Mesh(stripeGeo, stripeMat);
    stripeMesh.rotation.x = -Math.PI / 2;
    stripeMesh.position.set(0, 0.03, 18);
    this.group.add(stripeMesh);

    // 3. Residential Construction Plot Pad (Excavation area: 18m x 16m)
    const padGeo = new THREE.PlaneGeometry(20, 18);
    const padMat = new THREE.MeshStandardMaterial({
      color: 0x6e5c4a, // Prepared compaction soil
      roughness: 0.9,
    });
    const padMesh = new THREE.Mesh(padGeo, padMat);
    padMesh.rotation.x = -Math.PI / 2;
    padMesh.position.set(0, 0.02, 1);
    padMesh.receiveShadow = true;
    this.group.add(padMesh);

    // 4. Glowing Blueprint Grid (Scene 1 transition onto the ground)
    this.blueprintGrid = new THREE.GridHelper(20, 20, 0x178f88, 0x116c67);
    this.blueprintGrid.position.set(0, 0.04, 1);
    (this.blueprintGrid.material as THREE.Material).transparent = true;
    (this.blueprintGrid.material as THREE.Material).opacity = 0.85;
    this.group.add(this.blueprintGrid);

    // 5. Plot Boundary Lines (Survey string outline)
    const boundaryPoints = [
      new THREE.Vector3(-10, 0.06, -8),
      new THREE.Vector3(10, 0.06, -8),
      new THREE.Vector3(10, 0.06, 10),
      new THREE.Vector3(-10, 0.06, 10),
      new THREE.Vector3(-10, 0.06, -8),
    ];
    const boundaryGeo = new THREE.BufferGeometry().setFromPoints(boundaryPoints);
    const boundaryMat = new THREE.LineBasicMaterial({
      color: 0x178f88,
      linewidth: 2,
    });
    this.plotBoundary = new THREE.LineSegments(boundaryGeo, boundaryMat);
    this.group.add(this.plotBoundary);

    // 6. Survey Corner Pegs (Wooden stakes with neon survey flags)
    this.surveyPegs = new THREE.Group();
    const pegGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.8, 8);
    const pegMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.8 });
    const flagGeo = new THREE.BoxGeometry(0.2, 0.15, 0.02);
    const flagMat = new THREE.MeshBasicMaterial({ color: 0xff3b30 });

    const cornerCoords = [
      [-10, -8],
      [10, -8],
      [10, 10],
      [-10, 10],
    ];

    cornerCoords.forEach(([x, z]) => {
      const peg = new THREE.Mesh(pegGeo, pegMat);
      peg.position.set(x, 0.4, z);
      peg.castShadow = true;

      const flag = new THREE.Mesh(flagGeo, flagMat);
      flag.position.set(x + 0.1, 0.75, z);
      this.surveyPegs.add(peg);
      this.surveyPegs.add(flag);
    });
    this.group.add(this.surveyPegs);

    // 7. Surrounding Environment (Distant low-poly hills and stylized trees)
    this.surroundingHills = new THREE.Group();
    this.createDistantScenery();
    this.group.add(this.surroundingHills);
  }

  private createDistantScenery() {
    // Distant background hills
    const hillMat = new THREE.MeshStandardMaterial({
      color: 0x3d4a3b, // Distant foliage green
      roughness: 0.95,
      metalness: 0.0,
    });

    const hillPositions = [
      { x: -50, z: -50, r: 24, h: 12 },
      { x: 30, z: -60, r: 30, h: 16 },
      { x: -65, z: 10, r: 28, h: 14 },
      { x: 55, z: -20, r: 22, h: 10 },
      { x: 65, z: 40, r: 26, h: 11 },
    ];

    hillPositions.forEach((h) => {
      const geo = new THREE.ConeGeometry(h.r, h.h, 12);
      const mesh = new THREE.Mesh(geo, hillMat);
      mesh.position.set(h.x, h.h / 2 - 1, h.z);
      this.surroundingHills.add(mesh);
    });

    // Stylized perimeter trees
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3728, roughness: 0.9 });
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x2d4f36, roughness: 0.8 });

    const treePositions = [
      [-22, -12], [-24, -4], [-22, 6], [-25, 14],
      [22, -14], [24, -2], [23, 8], [25, 15],
      [-14, -22], [-4, -24], [6, -23], [15, -24]
    ];

    treePositions.forEach(([tx, tz]) => {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 2.8, 6), trunkMat);
      trunk.position.y = 1.4;
      trunk.castShadow = true;
      tree.add(trunk);

      const foliage = new THREE.Mesh(new THREE.DodecahedronGeometry(1.6, 1), foliageMat);
      foliage.position.y = 3.6;
      foliage.castShadow = true;
      tree.add(foliage);

      tree.position.set(tx, 0, tz);
      this.surroundingHills.add(tree);
    });
  }

  public update(scrollProgress: number) {
    // Scene 1: Blueprint grid sweeps in from 0.0 to 0.15
    if (scrollProgress < 0.15) {
      const t = Math.min(1, Math.max(0, scrollProgress / 0.12));
      const mat = this.blueprintGrid.material as THREE.Material;
      mat.opacity = 0.2 + t * 0.7;
      this.blueprintGrid.scale.set(0.2 + t * 0.8, 1, 0.2 + t * 0.8);
    } else {
      // Fade out blueprint as actual physical house forms
      const fade = Math.max(0, 1 - (scrollProgress - 0.15) * 4);
      (this.blueprintGrid.material as THREE.Material).opacity = fade * 0.9;
    }
  }
}
