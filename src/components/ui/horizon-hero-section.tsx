import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';

gsap.registerPlugin(ScrollTrigger);

interface ThreeRefs {
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;
  composer: EffectComposer | null;
  stars: THREE.Points[];
  nebulas: THREE.Mesh[];
  mountains: THREE.Mesh[];
  wave: THREE.Mesh | null;
  animationId: number | null;
  targetCameraX?: number;
  targetCameraY?: number;
  targetCameraZ?: number;
  locations?: number[];
}

export const Component = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollProgressRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const smoothCameraPos = useRef({ x: 0, y: 30, z: 300 });
  const mouseOffset = useRef({ x: 0, y: 0 });

  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const totalSections = 2;

  const threeRefs = useRef<ThreeRefs>({
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    stars: [],
    nebulas: [],
    mountains: [],
    wave: null,
    animationId: null
  });

  // Initialize Three.js
  useEffect(() => {
    const initThree = () => {
      const { current: refs } = threeRefs;

      // Scene setup
      refs.scene = new THREE.Scene();
      refs.scene.fog = new THREE.FogExp2(0x000000, 0.00025);

      // Camera
      refs.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
      );
      // Initialize camera at the starting Section 0 coordinates
      refs.camera.position.x = 0;
      refs.camera.position.y = 30;
      refs.camera.position.z = 300;

      refs.targetCameraX = 0;
      refs.targetCameraY = 30;
      refs.targetCameraZ = 300;

      // Renderer
      refs.renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current || undefined,
        antialias: true,
        alpha: true
      });
      refs.renderer.setSize(window.innerWidth, window.innerHeight);
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      refs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      refs.renderer.toneMappingExposure = 0.6;

      // Create scene elements
      createStarField();
      createNebula();
      createParticleWave();

      // Start animation
      animate();

      // Mark as ready after Three.js is initialized
      setIsReady(true);
    };

    const createStarField = () => {
      const { current: refs } = threeRefs;
      const starCount = 6000;

      for (let i = 0; i < 3; i++) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);

        for (let j = 0; j < starCount; j++) {
          positions[j * 3] = (Math.random() - 0.5) * 4000;
          positions[j * 3 + 1] = (Math.random() - 0.5) * 1400 + 100;
          positions[j * 3 + 2] = Math.random() * 3300 - 2500;

          const color = new THREE.Color();
          const colorChoice = Math.random();
          if (colorChoice < 0.7) {
            color.setHSL(0.55 + Math.random() * 0.1, 0.8, 0.8 + Math.random() * 0.2);
          } else if (colorChoice < 0.9) {
            color.setHSL(0.08, 0.8, 0.85);
          } else {
            color.setHSL(0.85, 0.8, 0.85);
          }

          colors[j * 3] = color.r;
          colors[j * 3 + 1] = color.g;
          colors[j * 3 + 2] = color.b;

          sizes[j] = Math.random() * 2.5 + 0.5;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            depth: { value: i }
          },
          vertexShader: `
            attribute vec3 color;
            varying vec3 vColor;
            varying float vDistToCamera;
            uniform float time;
            uniform float depth;
            
            void main() {
              vColor = color;
              vec3 pos = position;
              
              float offset = sin(time * 0.15 + depth * 5.0) * 15.0;
              pos.y += offset;
              
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              vDistToCamera = -mvPosition.z;
              
              gl_PointSize = clamp(2.5 * (300.0 / -mvPosition.z), 1.0, 12.0);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            varying float vDistToCamera;
            
            void main() {
              float dist = length(gl_PointCoord - vec2(0.5));
              if (dist > 0.5) discard;
              
              float opacity = 1.0 - smoothstep(0.1, 0.5, dist);
              float depthFade = smoothstep(15.0, 60.0, vDistToCamera);
              gl_FragColor = vec4(vColor, opacity * depthFade * 0.85);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });

        const stars = new THREE.Points(geometry, material);
        if (refs.scene) {
          refs.scene.add(stars);
        }
        refs.stars.push(stars);
      }
    };

    const createNebula = () => {
      const { current: refs } = threeRefs;

      const layers = [
        { z: -1050, color1: 0x0033ff, color2: 0xff0066, opacity: 0.3, speed: 0.5 },
        { z: -1400, color1: 0x00ffcc, color2: 0x6600ff, opacity: 0.2, speed: -0.3 }
      ];

      layers.forEach((layer) => {
        const geometry = new THREE.PlaneGeometry(8000, 4000, 50, 50);
        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            color1: { value: new THREE.Color(layer.color1) },
            color2: { value: new THREE.Color(layer.color2) },
            opacity: { value: layer.opacity }
          },
          vertexShader: `
            varying vec2 vUv;
            varying float vElevation;
            uniform float time;
            
            void main() {
              vUv = uv;
              vec3 pos = position;
              
              float elevation = sin(pos.x * 0.008 + time * ${layer.speed}) * cos(pos.y * 0.008 + time * ${layer.speed}) * 30.0;
              pos.z += elevation;
              vElevation = elevation;
              
              gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
          `,
          fragmentShader: `
            uniform vec3 color1;
            uniform vec3 color2;
            uniform float opacity;
            uniform float time;
            varying vec2 vUv;
            varying float vElevation;
            
            void main() {
              float mixFactor = sin(vUv.x * 8.0 + time) * cos(vUv.y * 8.0 + time);
              vec3 color = mix(color1, color2, mixFactor * 0.5 + 0.5);
              
              float alpha = opacity * (1.0 - length(vUv - 0.5) * 2.0);
              alpha *= 1.0 + vElevation * 0.008;
              
              gl_FragColor = vec4(color, alpha);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
          depthWrite: false
        });

        const nebula = new THREE.Mesh(geometry, material);
        nebula.position.z = layer.z;
        if (refs.scene) {
          refs.scene.add(nebula);
        }
        refs.nebulas.push(nebula);
      });
    };

    const createParticleWave = () => {
      const { current: refs } = threeRefs;

      const width = 3000;
      const depth = 3000;

      const geometry = new THREE.PlaneGeometry(width, depth, 80, 80);

      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          opacity: { value: 0.7 }
        },
        vertexShader: `
          uniform float time;
          varying vec2 vUv;
          varying float vElevation;
          varying float vDistToCamera;
          
          void main() {
            vUv = uv;
            vec3 pos = position;
            
            float distFromCenter = length(pos.xy);
            float wave1 = sin(pos.x * 0.005 + time * 1.0) * 35.0;
            float wave2 = cos(pos.y * 0.004 + time * 0.8) * 25.0;
            float ripple = sin(distFromCenter * 0.006 - time * 1.5) * 15.0;
            
            pos.z += wave1 + wave2 + ripple;
            vElevation = pos.z;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            vDistToCamera = -mvPosition.z;
            
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform float opacity;
          varying vec2 vUv;
          varying float vElevation;
          varying float vDistToCamera;
          
          void main() {
            vec2 grid = abs(fract(vUv * 50.0 - 0.5) - 0.5) / fwidth(vUv * 50.0);
            float line = min(grid.x, grid.y);
            float gridIntensity = 1.0 - min(line, 1.0);
            
            if (gridIntensity < 0.05) discard;
            
            vec3 finalColor = mix(vec3(0.0, 0.35, 1.0), vec3(0.95, 0.0, 0.6), vUv.x);
            
            finalColor += vec3(0.2, 0.5, 1.0) * max(0.0, (vElevation + 20.0) / 75.0);
            
            float edgeFade = smoothstep(0.0, 0.1, vUv.x) * (1.0 - smoothstep(0.9, 1.0, vUv.x)) *
                             smoothstep(0.0, 0.1, vUv.y) * (1.0 - smoothstep(0.9, 1.0, vUv.y));
            
            float depthFade = smoothstep(50.0, 250.0, vDistToCamera) * (1.0 - smoothstep(1200.0, 2500.0, vDistToCamera));
            
            gl_FragColor = vec4(finalColor, gridIntensity * opacity * edgeFade * depthFade * 0.7);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      const wave = new THREE.Mesh(geometry, material);
      wave.rotation.x = -Math.PI / 2;
      wave.position.y = -100;
      wave.position.z = -200;

      if (refs.scene) {
        refs.scene.add(wave);
      }
      refs.wave = wave;
    };

    const animate = () => {
      const { current: refs } = threeRefs;
      refs.animationId = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      refs.stars.forEach((starField) => {
        const material = starField.material as THREE.ShaderMaterial;
        if (material.uniforms && material.uniforms.time) {
          material.uniforms.time.value = time;
        }
      });

      refs.nebulas.forEach((nebula) => {
        const material = nebula.material as THREE.ShaderMaterial;
        if (material.uniforms && material.uniforms.time) {
          material.uniforms.time.value = time * 0.5;
        }
      });

      if (refs.wave) {
        const material = refs.wave.material as THREE.ShaderMaterial;
        if (material.uniforms && material.uniforms.time) {
          material.uniforms.time.value = time;
        }
      }

      if (refs.camera && refs.targetCameraX !== undefined && refs.targetCameraY !== undefined && refs.targetCameraZ !== undefined) {
        const smoothingFactor = 0.05;

        smoothCameraPos.current.x += (refs.targetCameraX - smoothCameraPos.current.x) * smoothingFactor;
        smoothCameraPos.current.y += (refs.targetCameraY - smoothCameraPos.current.y) * smoothingFactor;
        smoothCameraPos.current.z += (refs.targetCameraZ - smoothCameraPos.current.z) * smoothingFactor;

        const floatX = Math.sin(time * 0.1) * 2;
        const floatY = Math.cos(time * 0.15) * 1;

        refs.camera.position.x = smoothCameraPos.current.x + floatX + mouseOffset.current.x;
        refs.camera.position.y = smoothCameraPos.current.y + floatY + mouseOffset.current.y;
        refs.camera.position.z = smoothCameraPos.current.z;
        refs.camera.lookAt(0, 10, -600);
      }

      if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera);
      }
    };

    initThree();

    // Handle resize
    const handleResize = () => {
      const { current: refs } = threeRefs;
      if (refs.camera && refs.renderer) {
        refs.camera.aspect = window.innerWidth / window.innerHeight;
        refs.camera.updateProjectionMatrix();
        refs.renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      mouseOffset.current = { x: mouseX * 25, y: mouseY * 12 };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      const { current: refs } = threeRefs;

      if (refs.animationId) {
        cancelAnimationFrame(refs.animationId);
      }

      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);

      const safeDisposeMaterial = (material: THREE.Material | THREE.Material[]) => {
        if (Array.isArray(material)) {
          material.forEach(m => m.dispose());
        } else {
          material.dispose();
        }
      };

      // Dispose Three.js resources
      refs.stars.forEach(starField => {
        starField.geometry.dispose();
        safeDisposeMaterial(starField.material);
      });

      if (refs.wave) {
        refs.wave.geometry.dispose();
        safeDisposeMaterial(refs.wave.material);
      }

      refs.nebulas.forEach(nebula => {
        nebula.geometry.dispose();
        safeDisposeMaterial(nebula.material);
      });

      if (refs.renderer) {
        refs.renderer.dispose();
      }
    };
  }, []);

  // GSAP Animations - Run after component is ready
  useEffect(() => {
    if (!isReady) return;

    // Set initial states to prevent flash
    const menuEl = menuRef.current;
    const progressEl = scrollProgressRef.current;

    if (menuEl) gsap.set(menuEl, { visibility: 'visible' });
    if (progressEl) gsap.set(progressEl, { visibility: 'visible' });

    const tl = gsap.timeline();

    // Animate menu
    if (menuEl) {
      tl.from(menuEl, {
        x: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });
    }

    // Animate title and subtitle chars inside the first section
    if (containerRef.current) {
      const titleChars = containerRef.current.querySelectorAll('.hero-content.cosmos-content .title-char');
      const subtitleLines = containerRef.current.querySelectorAll('.hero-content.cosmos-content .subtitle-line');

      if (titleChars.length > 0) {
        tl.from(titleChars, {
          y: 200,
          opacity: 0,
          duration: 1.5,
          stagger: 0.05,
          ease: "power4.out"
        }, "-=0.5");
      }

      if (subtitleLines.length > 0) {
        tl.from(subtitleLines, {
          y: 50,
          opacity: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out"
        }, "-=0.8");
      }
    }

    // Animate scroll indicator
    if (progressEl) {
      tl.from(progressEl, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out"
      }, "-=0.5");
    }

    return () => {
      tl.kill();
    };
  }, [isReady]);

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const maxScroll = Math.max(documentHeight - windowHeight, 1);
      const progress = Math.min(scrollY / maxScroll, 1);

      setScrollProgress(progress);

      // Map progress to section indices (0, 1, 2)
      const totalSectionCount = totalSections + 1; // 3 sections total
      const newSection = Math.min(Math.floor(progress * totalSectionCount), totalSectionCount - 1);
      setCurrentSection(newSection);

      const { current: refs } = threeRefs;

      // Calculate smooth progress through sections for camera position mapping
      const totalProgress = progress * totalSections;
      const sectionProgress = totalProgress % 1;
      const currentSectionIndex = Math.min(Math.floor(totalProgress), totalSections);

      // Define camera positions for each section
      const cameraPositions = [
        { x: 0, y: 30, z: 300 },    // Section 0 - HORIZON
        { x: 0, y: 40, z: -50 },     // Section 1 - COSMOS
        { x: 0, y: 50, z: -700 }       // Section 2 - INFINITY
      ];

      // Get current and next positions
      const currentPos = cameraPositions[currentSectionIndex] || cameraPositions[0];
      const nextPos = cameraPositions[currentSectionIndex + 1] || currentPos;

      // Set target positions (actual smoothing happens in animate loop)
      refs.targetCameraX = currentPos.x + (nextPos.x - currentPos.x) * sectionProgress;
      refs.targetCameraY = currentPos.y + (nextPos.y - currentPos.y) * sectionProgress;
      refs.targetCameraZ = currentPos.z + (nextPos.z - currentPos.z) * sectionProgress;

      refs.nebulas.forEach((nebula, index) => {
        const baseZ = index === 0 ? -1050 : -1400;
        const scrollFactor = index === 0 ? 400 : 250;
        nebula.position.z = baseZ + progress * scrollFactor;
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Set initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalSections]);


  const splitTitle = (text: string) => {
    return text.split('').map((char, i) => (
      <span key={i} className="title-char inline-block whitespace-pre">
        {char}
      </span>
    ));
  };

  return (
    <div ref={containerRef} className="hero-container cosmos-style relative bg-black text-white w-full overflow-hidden">
      <canvas ref={canvasRef} className="hero-canvas fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" />

      {/* Side menu */}
      <div ref={menuRef} className="side-menu fixed left-8 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col items-center gap-6" style={{ visibility: 'hidden' }}>
        <div className="menu-icon flex flex-col gap-1.5 cursor-pointer group">
          <span className="w-6 h-0.5 bg-white transition-all group-hover:bg-accent"></span>
          <span className="w-4 h-0.5 bg-white transition-all group-hover:bg-accent align-self-start"></span>
          <span className="w-5 h-0.5 bg-white transition-all group-hover:bg-accent"></span>
        </div>
        <div className="vertical-text text-white/40 font-heading text-xs tracking-[0.3em] uppercase select-none [writing-mode:vertical-lr]">SPACE</div>
      </div>

      {/* Main content (Section 0) */}
      <div className="hero-content cosmos-content h-screen w-full flex flex-col items-center justify-center text-center px-4 relative z-10">
        <h1 className="hero-title text-5xl md:text-8xl font-black tracking-[0.25em] text-white uppercase select-none filter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          {splitTitle("SUBIN")}
        </h1>

        <div className="hero-subtitle cosmos-subtitle mt-6 max-w-xl text-gray-400 font-light text-base md:text-lg tracking-wider">
          <p className="subtitle-line leading-relaxed">
            Front-End Engineer & UI Specialist
          </p>
          <p className="subtitle-line leading-relaxed">
            Shaping the digital landscapes of tomorrow
          </p>
        </div>
      </div>

      {/* Scroll progress indicator */}
      <div ref={scrollProgressRef} className="scroll-progress fixed bottom-10 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-3" style={{ visibility: 'hidden' }}>
        <div className="scroll-text text-[10px] tracking-[0.3em] font-heading font-medium text-white/50 select-none">SCROLL</div>
        <div className="progress-track w-40 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div
            className="progress-fill h-full bg-gradient-to-r from-accent to-[#ff0066] transition-all duration-100"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
        <div className="section-counter font-mono text-xs tracking-wider text-white/60">
          {String(currentSection + 1).padStart(2, '0')} / 03
        </div>
      </div>

      {/* Additional sections for scrolling */}
      <div className="scroll-sections relative z-10">
        {[...Array(2)].map((_, i) => {
          const titles: Record<number, string> = {
            1: 'COSMOS',
            2: 'INFINITY'
          };

          const subtitles: Record<number, { line1: string; line2: string }> = {
            1: {
              line1: 'Building high-performance interfaces with React, TypeScript,',
              line2: 'and immersive 3D/WebGL animations.'
            },
            2: {
              line1: 'Where clean architecture, optimized systems,',
              line2: 'and pixel-perfect details merge into seamless user experiences.'
            }
          };

          const sectionIdx = i + 1;

          return (
            <section key={i} className="content-section h-screen w-full flex flex-col items-center justify-center text-center px-4">
              <h1 className="hero-title text-5xl md:text-8xl font-black tracking-[0.25em] text-white uppercase select-none filter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                {splitTitle(titles[sectionIdx] || 'DEFAULT')}
              </h1>

              <div className="hero-subtitle cosmos-subtitle mt-6 max-w-xl text-gray-400 font-light text-base md:text-lg tracking-wider">
                <p className="subtitle-line leading-relaxed">
                  {subtitles[sectionIdx]?.line1}
                </p>
                <p className="subtitle-line leading-relaxed">
                  {subtitles[sectionIdx]?.line2}
                </p>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
