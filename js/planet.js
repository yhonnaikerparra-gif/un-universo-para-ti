/**
 * PLANETA CENTRAL ROMÁNTICO
 * Planeta esférico oscuro con superficie brillante, reflejos rojizos/rosados,
 * shader de Fresnel para bordes incandescentes y atmósfera luminosa pulsante.
 */

class RomanticPlanet {
    constructor(scene, config) {
        this.scene = scene;
        this.config = config.planet;
        this.group = new THREE.Group();
        this.mesh = null;
        this.atmosphereMesh = null;
        this.time = 0;

        this.init();
    }

    init() {
        const radius = this.config.radius;

        // 1. Textura procedimental para la superficie con remolinos de mármol cósmico
        const surfaceTexture = this.generateSurfaceTexture();

        // 2. Shader personalizado para el planeta central
        // Mantiene el centro oscuro/obsidiana y resalta los bordes en rosa neón
        const planetShader = {
            uniforms: {
                uTime: { value: 0 },
                uMap: { value: surfaceTexture },
                uCoreColor: { value: new THREE.Color(this.config.coreColor || '#070210') },
                uRimColor: { value: new THREE.Color(this.config.rimColor || '#ff2a8d') },
                uSpecularColor: { value: new THREE.Color(this.config.specularColor || '#ff80bf') },
                uGlowIntensity: { value: this.config.glowIntensity || 1.4 }
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vViewPosition;
                varying vec2 vUv;

                void main() {
                    vUv = uv;
                    vNormal = normalize(normalMatrix * normal);
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    vViewPosition = -mvPosition.xyz;
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform float uTime;
                uniform sampler2D uMap;
                uniform vec3 uCoreColor;
                uniform vec3 uRimColor;
                uniform vec3 uSpecularColor;
                uniform float uGlowIntensity;

                varying vec3 vNormal;
                varying vec3 vViewPosition;
                varying vec2 vUv;

                void main() {
                    vec3 viewDir = normalize(vViewPosition);
                    vec3 norm = normalize(vNormal);

                    // Mapeo de textura animada sutilmente
                    vec2 animatedUv = vec2(vUv.x + uTime * 0.008, vUv.y);
                    vec4 texColor = texture2D(uMap, animatedUv);

                    // Efecto Fresnel puro: 0.0 en el centro hacia la cámara, 1.0 en el borde silueta
                    float fresnel = 1.0 - max(dot(viewDir, norm), 0.0);
                    float rim = pow(fresnel, 3.8) * uGlowIntensity;

                    // Reflejo especular satinado / brillo elegante
                    vec3 lightDir = normalize(vec3(1.2, 1.0, 1.8));
                    vec3 halfDir = normalize(lightDir + viewDir);
                    float spec = pow(max(dot(norm, halfDir), 0.0), 48.0) * 0.45;

                    // Latido armónico muy sutil
                    float pulse = 1.0 + 0.04 * sin(uTime * 2.2);

                    // Base: color oscuro profundo mezclado con la textura de mármol cósmico
                    vec3 base = mix(uCoreColor, texColor.rgb * 0.35, 0.5);

                    // Borde incandescente en rosa neón / carmesí
                    vec3 finalColor = base;
                    finalColor += uRimColor * rim * pulse;
                    finalColor += uSpecularColor * spec;

                    gl_FragColor = vec4(finalColor, 1.0);
                }
            `
        };

        const geometry = new THREE.SphereGeometry(radius, 64, 64);
        this.planetMaterial = new THREE.ShaderMaterial({
            uniforms: planetShader.uniforms,
            vertexShader: planetShader.vertexShader,
            fragmentShader: planetShader.fragmentShader
        });

        this.mesh = new THREE.Mesh(geometry, this.planetMaterial);
        this.group.add(this.mesh);

        // 3. Atmósfera exterior luminosa (Halo resplandeciente en el borde)
        const atmosphereRadius = radius * (this.config.atmosphereScale || 1.15);
        const atmosphereGeo = new THREE.SphereGeometry(atmosphereRadius, 64, 64);

        const atmosphereShader = {
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: new THREE.Color(this.config.atmosphereColor || '#a82cff') },
                uRimColor: { value: new THREE.Color(this.config.rimColor || '#ff2a8d') }
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vViewPosition;

                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    vViewPosition = -mvPosition.xyz;
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform float uTime;
                uniform vec3 uColor;
                uniform vec3 uRimColor;
                varying vec3 vNormal;
                varying vec3 vViewPosition;

                void main() {
                    vec3 viewDir = normalize(vViewPosition);
                    vec3 norm = normalize(vNormal);

                    // El halo brilla ÚNICAMENTE en la silueta tangencial
                    float fresnel = 1.0 - max(dot(norm, viewDir), 0.0);
                    float intensity = pow(fresnel, 3.2);

                    // Pulso suave
                    float pulse = 1.0 + 0.05 * sin(uTime * 2.5);

                    vec3 color = mix(uColor, uRimColor, 0.45);
                    gl_FragColor = vec4(color, intensity * 0.7 * pulse);
                }
            `,
            side: THREE.FrontSide,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false
        };

        this.atmosphereMaterial = new THREE.ShaderMaterial({
            uniforms: atmosphereShader.uniforms,
            vertexShader: atmosphereShader.vertexShader,
            fragmentShader: atmosphereShader.fragmentShader,
            side: atmosphereShader.side,
            blending: atmosphereShader.blending,
            transparent: atmosphereShader.transparent,
            depthWrite: atmosphereShader.depthWrite
        });

        this.atmosphereMesh = new THREE.Mesh(atmosphereGeo, this.atmosphereMaterial);
        this.group.add(this.atmosphereMesh);

        this.scene.add(this.group);
    }

    generateSurfaceTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        // Fondo oscuro obsidiana / violeta profundo
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, '#06010d');
        grad.addColorStop(0.3, '#10031c');
        grad.addColorStop(0.5, '#1e052d');
        grad.addColorStop(0.7, '#0d0217');
        grad.addColorStop(1, '#05010a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Vetas fluidas de nebulosa interior
        for (let i = 0; i < 40; i++) {
            ctx.save();
            ctx.beginPath();
            const y = Math.random() * canvas.height;
            ctx.moveTo(0, y);

            const cp1x = canvas.width * 0.25;
            const cp1y = y + (Math.random() - 0.5) * 140;
            const cp2x = canvas.width * 0.75;
            const cp2y = y + (Math.random() - 0.5) * 140;
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, canvas.width, y + (Math.random() - 0.5) * 80);

            const colors = [
                'rgba(255, 42, 141, 0.14)',
                'rgba(160, 40, 240, 0.12)',
                'rgba(255, 100, 180, 0.1)',
                'rgba(200, 20, 100, 0.15)'
            ];
            ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
            ctx.lineWidth = 14 + Math.random() * 30;
            ctx.filter = 'blur(12px)';
            ctx.stroke();
            ctx.restore();
        }

        // Puntos de luz estelar incrustados en la superficie
        for (let i = 0; i < 120; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const r = Math.random() * 2.0 + 0.5;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 180, 220, 0.5)' : 'rgba(255, 255, 255, 0.7)';
            ctx.fill();
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        return texture;
    }

    update(delta, isPaused) {
        if (!isPaused) {
            this.time += delta;

            this.mesh.rotation.y += this.config.rotationSpeed;
            this.atmosphereMesh.rotation.y += this.config.rotationSpeed * 0.8;

            if (this.planetMaterial.uniforms) {
                this.planetMaterial.uniforms.uTime.value = this.time;
            }
            if (this.atmosphereMaterial.uniforms) {
                this.atmosphereMaterial.uniforms.uTime.value = this.time;
            }
        }
    }

    setRadius(newRadius) {
        this.config.radius = newRadius;
        this.mesh.geometry.dispose();
        this.mesh.geometry = new THREE.SphereGeometry(newRadius, 64, 64);

        const atmoRadius = newRadius * (this.config.atmosphereScale || 1.15);
        this.atmosphereMesh.geometry.dispose();
        this.atmosphereMesh.geometry = new THREE.SphereGeometry(atmoRadius, 64, 64);
    }

    setColors(core, rim, atmosphere) {
        if (core) this.planetMaterial.uniforms.uCoreColor.value.set(core);
        if (rim) {
            this.planetMaterial.uniforms.uRimColor.value.set(rim);
            this.atmosphereMaterial.uniforms.uRimColor.value.set(rim);
        }
        if (atmosphere) this.atmosphereMaterial.uniforms.uColor.value.set(atmosphere);
    }

    setRotationSpeed(speed) {
        this.config.rotationSpeed = speed;
    }
}
