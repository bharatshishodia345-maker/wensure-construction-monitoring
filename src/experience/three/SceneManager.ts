import * as THREE from 'three';
import { PlotAndTerrain } from './PlotAndTerrain';
import { FoundationStage } from './FoundationStage';
import { HouseStructure } from './HouseStructure';
import { Workers } from './Workers';
import { FinishingAndLandscape } from './FinishingAndLandscape';
import { soundEngine } from '../audio/soundEngine';

export interface CameraWaypoint {
  pos: THREE.Vector3;
  target: THREE.Vector3;
}

export class SceneManager {
  public container: HTMLElement;
  public renderer: THREE.WebGLRenderer;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;

  // Lighting
  private ambientLight: THREE.AmbientLight;
  private dirLight: THREE.DirectionalLight;
  private hemiLight: THREE.HemisphereLight;

  // Scene submodules
  public plotAndTerrain: PlotAndTerrain;
  public foundationStage: FoundationStage;
  public houseStructure: HouseStructure;
  public workers: Workers;
  public finishingAndLandscape: FinishingAndLandscape;

  // Scroll state & interpolation
  private targetProgress: number = 0;
  private currentProgress: number = 0;
  private currentCameraPos = new THREE.Vector3(22, 26, 30);
  private currentCameraTarget = new THREE.Vector3(0, 0.5, 0);

  private lastTime: number = performance.now() * 0.001;
  private startTime: number = performance.now() * 0.001;
  private animFrameId: number | null = null;
  private isDestroyed: boolean = false;
  private reducedMotion: boolean = false;

  constructor(container: HTMLElement) {
    this.container = container;

    // 1. Scene & Atmospheric Fog
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xdce7e8);
    this.scene.fog = new THREE.FogExp2(0xdce7e8, 0.012);

    // 2. Camera
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 300);
    this.camera.position.set(22, 26, 30);
    this.camera.lookAt(0, 0.5, 0);

    // 3. Renderer with Premium Settings
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    container.appendChild(this.renderer.domElement);

    // 4. Lighting Environment
    this.ambientLight = new THREE.AmbientLight(0xfff5e6, 0.65);
    this.scene.add(this.ambientLight);

    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.45);
    this.hemiLight.position.set(0, 50, 0);
    this.scene.add(this.hemiLight);

    this.dirLight = new THREE.DirectionalLight(0xfff0db, 1.3);
    this.dirLight.position.set(30, 45, 25);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.camera.near = 5;
    this.dirLight.shadow.camera.far = 120;
    this.dirLight.shadow.camera.left = -25;
    this.dirLight.shadow.camera.right = 25;
    this.dirLight.shadow.camera.top = 25;
    this.dirLight.shadow.camera.bottom = -25;
    this.dirLight.shadow.bias = -0.0004;
    this.scene.add(this.dirLight);

    // 5. Initialize 3D Visual Modules
    this.plotAndTerrain = new PlotAndTerrain();
    this.foundationStage = new FoundationStage();
    this.houseStructure = new HouseStructure();
    this.workers = new Workers();
    this.finishingAndLandscape = new FinishingAndLandscape();

    this.scene.add(this.plotAndTerrain.group);
    this.scene.add(this.foundationStage.group);
    this.scene.add(this.houseStructure.group);
    this.scene.add(this.workers.group);
    this.scene.add(this.finishingAndLandscape.group);

    // Initial update
    this.updateAllModules(0, 0);

    // Resize event
    window.addEventListener('resize', this.onResize);

    // Start render loop
    this.animate();
  }

  public setScrollProgress(progress: number) {
    this.targetProgress = Math.min(1.0, Math.max(0.0, progress));
  }

  public setReducedMotion(reduced: boolean) {
    this.reducedMotion = reduced;
  }

  public getScrollProgress(): number {
    return this.currentProgress;
  }

  private onResize = () => {
    if (this.isDestroyed || !this.container) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  // Compute camera position and target based on scroll progress
  private computeCameraWaypoint(p: number): CameraWaypoint {
    // Stage 1: The Beginning (0.00 -> 0.12)
    if (p <= 0.12) {
      const t = p / 0.12;
      return {
        pos: new THREE.Vector3().lerpVectors(
          new THREE.Vector3(22, 26, 32),
          new THREE.Vector3(16, 12, 22),
          t
        ),
        target: new THREE.Vector3().lerpVectors(
          new THREE.Vector3(0, 0.5, 0),
          new THREE.Vector3(0, 0.8, 1),
          t
        ),
      };
    }

    // Stage 2: The Foundation (0.12 -> 0.26)
    if (p <= 0.26) {
      const t = (p - 0.12) / 0.14;
      return {
        pos: new THREE.Vector3().lerpVectors(
          new THREE.Vector3(16, 12, 22),
          new THREE.Vector3(11, 4.5, 14),
          t
        ),
        target: new THREE.Vector3().lerpVectors(
          new THREE.Vector3(0, 0.8, 1),
          new THREE.Vector3(0.5, 0.4, 0),
          t
        ),
      };
    }

    // Stage 3: A Home Takes Shape (0.26 -> 0.42)
    if (p <= 0.42) {
      const t = (p - 0.26) / 0.16;
      return {
        pos: new THREE.Vector3().lerpVectors(
          new THREE.Vector3(11, 4.5, 14),
          new THREE.Vector3(16, 8.5, -8),
          t
        ),
        target: new THREE.Vector3().lerpVectors(
          new THREE.Vector3(0.5, 0.4, 0),
          new THREE.Vector3(0, 3.2, 0),
          t
        ),
      };
    }

    // Stage 4: The Site Supervisor (0.42 -> 0.56)
    if (p <= 0.56) {
      const t = (p - 0.42) / 0.14;
      return {
        pos: new THREE.Vector3().lerpVectors(
          new THREE.Vector3(16, 8.5, -8),
          new THREE.Vector3(-4.6, 2.4, 8.5), // Close up on supervisor tablet
          t
        ),
        target: new THREE.Vector3().lerpVectors(
          new THREE.Vector3(0, 3.2, 0),
          new THREE.Vector3(-3.5, 1.9, 5.5),
          t
        ),
      };
    }

    // Stage 5: The Transparency Moment (0.56 -> 0.70)
    if (p <= 0.70) {
      const t = (p - 0.56) / 0.14;
      return {
        pos: new THREE.Vector3().lerpVectors(
          new THREE.Vector3(-4.6, 2.4, 8.5),
          new THREE.Vector3(0, 5.2, 19.5), // Straight comparative view
          t
        ),
        target: new THREE.Vector3().lerpVectors(
          new THREE.Vector3(-3.5, 1.9, 5.5),
          new THREE.Vector3(0, 3.2, 0),
          t
        ),
      };
    }

    // Stage 6: The Home Comes To Life (0.70 -> 0.84)
    if (p <= 0.84) {
      const t = (p - 0.70) / 0.14;
      return {
        pos: new THREE.Vector3().lerpVectors(
          new THREE.Vector3(0, 5.2, 19.5),
          new THREE.Vector3(-14, 5.8, 16.5),
          t
        ),
        target: new THREE.Vector3(0, 3.0, 0),
      };
    }

    // Stage 7: The WENSURE Reveal (0.84 -> 0.94)
    if (p <= 0.94) {
      const t = (p - 0.84) / 0.10;
      // Majestic orbit around completed residence
      const angle = -Math.PI * 0.4 + t * Math.PI * 0.6;
      const radius = 20.0;
      return {
        pos: new THREE.Vector3(
          Math.sin(angle) * radius,
          5.0 - t * 1.5,
          Math.cos(angle) * radius
        ),
        target: new THREE.Vector3(0, 2.8, 1.5),
      };
    }

    // Final Stage 8: Transition into WENSURE Login Screen (0.94 -> 1.00)
    const t = (p - 0.94) / 0.06;
    return {
      pos: new THREE.Vector3().lerpVectors(
        new THREE.Vector3(8, 3.5, 16),
        new THREE.Vector3(-0.5, 2.0, 7.2), // Approaching warmly lit entrance portal
        t
      ),
      target: new THREE.Vector3().lerpVectors(
        new THREE.Vector3(0, 2.8, 1.5),
        new THREE.Vector3(-0.7, 1.9, 4.0), // Main entrance door
        t
      ),
    };
  }

  // Update environmental lighting & atmosphere based on progress
  private updateAtmosphere(p: number) {
    if (p < 0.65) {
      // Daytime (Clear construction light)
      this.scene.background = new THREE.Color(0xdce7e8);
      (this.scene.fog as THREE.FogExp2).color.set(0xdce7e8);
      this.dirLight.color.set(0xfff0db);
      this.dirLight.intensity = 1.35;
      this.ambientLight.intensity = 0.65;
    } else if (p < 0.82) {
      // Golden Hour Sunset
      const t = (p - 0.65) / 0.17;
      const skyDay = new THREE.Color(0xdce7e8);
      const skySunset = new THREE.Color(0xef8c50);
      const currentSky = skyDay.clone().lerp(skySunset, t);

      this.scene.background = currentSky;
      (this.scene.fog as THREE.FogExp2).color.copy(currentSky);
      this.dirLight.color.set(0xffa726);
      this.dirLight.position.set(35, 18, 15);
      this.dirLight.intensity = 1.6;
      this.ambientLight.intensity = 0.55;
    } else {
      // Twilight Blue Hour / Evening (Deep sapphire sky + warm architectural lighting)
      const t = Math.min(1, (p - 0.82) / 0.14);
      const skySunset = new THREE.Color(0xef8c50);
      const skyNight = new THREE.Color(0x0c1524);
      const currentSky = skySunset.clone().lerp(skyNight, t);

      this.scene.background = currentSky;
      (this.scene.fog as THREE.FogExp2).color.copy(currentSky);
      this.dirLight.intensity = Math.max(0.15, 1.2 * (1 - t));
      this.ambientLight.intensity = Math.max(0.2, 0.45 * (1 - t * 0.5));
      this.ambientLight.color.set(0x4a6582);
    }
  }

  private updateAllModules(progress: number, elapsedTime: number) {
    this.plotAndTerrain.update(progress);
    this.foundationStage.update(progress);
    this.houseStructure.update(progress);
    this.workers.update(progress, elapsedTime);
    this.finishingAndLandscape.update(progress);
    this.updateAtmosphere(progress);
    soundEngine.updateScrollProgress(progress);
  }

  private animate = () => {
    if (this.isDestroyed) return;
    this.animFrameId = requestAnimationFrame(this.animate);

    const now = performance.now() * 0.001;
    this.lastTime = now;
    const elapsedTime = now - this.startTime;

    if (this.reducedMotion) {
      // Direct positioning without aggressive lerp or inertia for reduced motion
      this.currentProgress = this.targetProgress;
      const waypoint = this.computeCameraWaypoint(this.currentProgress);
      this.currentCameraPos.copy(waypoint.pos);
      this.currentCameraTarget.copy(waypoint.target);
    } else {
      // Smooth camera and progress interpolation (inertia damping)
      this.currentProgress += (this.targetProgress - this.currentProgress) * 0.08;

      const waypoint = this.computeCameraWaypoint(this.currentProgress);
      this.currentCameraPos.lerp(waypoint.pos, 0.09);
      this.currentCameraTarget.lerp(waypoint.target, 0.09);
    }

    this.camera.position.copy(this.currentCameraPos);
    this.camera.lookAt(this.currentCameraTarget);

    // Update all 3D modules with interpolated progress & time
    this.updateAllModules(this.currentProgress, elapsedTime);

    this.renderer.render(this.scene, this.camera);
  };

  public destroy() {
    this.isDestroyed = true;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    window.removeEventListener('resize', this.onResize);

    // Traverse and dispose all geometries and materials to prevent WebGL memory leaks
    if (this.scene) {
      this.scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) {
            object.geometry.dispose();
          }
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((mat) => {
                if (mat && typeof mat.dispose === 'function') mat.dispose();
              });
            } else if (typeof object.material.dispose === 'function') {
              object.material.dispose();
            }
          }
        }
      });
      this.scene.clear();
    }

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }
  }
}
