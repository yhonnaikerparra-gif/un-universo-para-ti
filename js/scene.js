/**
 * GESTOR DE ESCENA 3D, CÁMARA, RENDERIZADOR Y EFECTOS POST-PROCESAMIENTO
 * Configuración de Three.js, OrbitControls y UnrealBloomPass para resplandor neón.
 */

class RomanticUniverseScene {
    constructor(container, config) {
        this.container = container;
        this.config = config;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.composer = null;
        this.bloomPass = null;
        this.useBloom = config.bloom?.enabled ?? true;

        this.defaultCameraPos = new THREE.Vector3(0, 24, 75);
        this.targetCameraPos = this.defaultCameraPos.clone();
        this.isResettingCamera = false;

        this.init();
    }

    init() {
        const width = this.container.clientWidth || window.innerWidth;
        const height = this.container.clientHeight || window.innerHeight;
        const aspect = width / height;

        // 1. Escena
        this.scene = new THREE.Scene();
        // Fondo espacial azul-negro profundo con gradiente de niebla cósmica
        this.scene.background = new THREE.Color('#03010b');
        this.scene.fog = new THREE.FogExp2('#03010b', 0.0022);

        // 2. Cámara (ajuste inteligente para pantallas 9:16 de móvil o panorámicas de PC)
        const fov = aspect < 1.0 ? 68 : 55; // Mayor FOV en vertical para encuadrar los anillos
        this.camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1500);

        if (aspect < 1.0) {
            // En móvil, alejar un poco la cámara para mantener la composición
            this.defaultCameraPos.set(0, 30, 95);
        } else {
            this.defaultCameraPos.set(0, 22, 75);
        }
        this.camera.position.copy(this.defaultCameraPos);

        // 3. Luces cinematográficas
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
        this.scene.add(ambientLight);

        // Luz estelar puntual desde el frente superior para reflejos sobre el planeta
        const starLight = new THREE.DirectionalLight(0xffd5ec, 1.2);
        starLight.position.set(40, 50, 60);
        this.scene.add(starLight);

        // Luz secundaria de contra en tono violeta
        const rimLight = new THREE.DirectionalLight(0x9b30ff, 1.0);
        rimLight.position.set(-50, -30, -50);
        this.scene.add(rimLight);

        // 4. Renderizador WebGL
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.15;
        this.container.appendChild(this.renderer.domElement);

        // 5. Controles de órbita (Arrastre, rotación, zoom y soporte táctil)
        if (THREE.OrbitControls) {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.045;
            this.controls.rotateSpeed = 0.65;
            this.controls.zoomSpeed = 0.8;
            this.controls.minDistance = 22;
            this.controls.maxDistance = 240;
            this.controls.maxPolarAngle = Math.PI * 0.92;
            this.controls.minPolarAngle = Math.PI * 0.08;
            this.controls.target.set(0, 0, 0);
        }

        // 6. Post-procesamiento: UnrealBloomPass para brillo neón
        this.setupPostProcessing(width, height);

        // 7. Evento redimensión
        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupPostProcessing(width, height) {
        if (!THREE.EffectComposer || !THREE.RenderPass || !THREE.UnrealBloomPass) {
            console.warn("Librerías de postprocesado no disponibles. Usando renderizado estándar.");
            this.useBloom = false;
            return;
        }

        try {
            const renderTarget = new THREE.WebGLRenderTarget(width, height, {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat
            });

            this.composer = new THREE.EffectComposer(this.renderer, renderTarget);

            const renderPass = new THREE.RenderPass(this.scene, this.camera);
            this.composer.addPass(renderPass);

            const bloomConfig = this.config.bloom || {};
            const resolution = new THREE.Vector2(width, height);
            const strength = bloomConfig.strength ?? 1.5;
            const radius = bloomConfig.radius ?? 0.75;
            const threshold = bloomConfig.threshold ?? 0.18;

            this.bloomPass = new THREE.UnrealBloomPass(resolution, strength, radius, threshold);
            this.composer.addPass(this.bloomPass);
        } catch (e) {
            console.error("Error al configurar UnrealBloomPass:", e);
            this.useBloom = false;
        }
    }

    onWindowResize() {
        const width = this.container.clientWidth || window.innerWidth;
        const height = this.container.clientHeight || window.innerHeight;
        const aspect = width / height;

        this.camera.aspect = aspect;
        this.camera.fov = aspect < 1.0 ? 68 : 55;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        if (this.composer) {
            this.composer.setSize(width, height);
        }
    }

    resetCameraView() {
        this.isResettingCamera = true;
    }

    update(delta) {
        if (this.controls) {
            this.controls.update();
        }

        // Suave transición si se pulsó resetear vista
        if (this.isResettingCamera) {
            this.camera.position.lerp(this.defaultCameraPos, 0.05);
            if (this.controls) {
                this.controls.target.lerp(new THREE.Vector3(0, 0, 0), 0.05);
            }
            if (this.camera.position.distanceTo(this.defaultCameraPos) < 0.2) {
                this.camera.position.copy(this.defaultCameraPos);
                this.isResettingCamera = false;
            }
        }
    }

    render() {
        if (this.useBloom && this.composer) {
            this.composer.render();
        } else {
            this.renderer.render(this.scene, this.camera);
        }
    }

    setBloomStrength(val) {
        if (this.bloomPass) {
            this.bloomPass.strength = val;
        }
    }

    toggleBloom(enabled) {
        this.useBloom = enabled;
    }
}
