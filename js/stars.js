/**
 * SISTEMA DE ESTRELLAS, NEBULOSAS Y ESTRELLAS FUGACES
 * Miles de estrellas parpadeantes en 3D, polvo cósmico / nebulosas románticas
 * y estrellas fugaces periódicas con estela de luz.
 */

class RomanticStarfield {
    constructor(scene, config) {
        this.scene = scene;
        this.config = config.stars;
        this.group = new THREE.Group();
        this.shootingStars = [];
        this.time = 0;

        this.init();
    }

    init() {
        // 1. Campo de estrellas principal con shader de parpadeo suave
        this.createTwinklingStars();

        // 2. Nubes de nebulosa y polvo cósmico
        this.createNebulaClouds();

        // 3. Sistema de estrellas fugaces
        if (this.config.shootingStarsEnabled) {
            this.initShootingStars();
        }

        this.scene.add(this.group);
    }

    createTwinklingStars() {
        const count = this.config.count;
        const spread = this.config.spreadRadius;

        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const phases = new Float32Array(count);

        // Paleta de estrellas románticas
        const colorPalette = [
            new THREE.Color('#ffffff'), // Blanco puro
            new THREE.Color('#ffe6f2'), // Rosa pálido
            new THREE.Color('#e0b0ff'), // Lavanda
            new THREE.Color('#ff99c8'), // Rosa chicle
            new THREE.Color('#b3ecff')  // Celeste estelar
        ];

        for (let i = 0; i < count; i++) {
            // Distribución esférica en el espacio profundo
            const u = Math.random();
            const v = Math.random();
            const theta = u * 2.0 * Math.PI;
            const phi = Math.acos(2.0 * v - 1.0);
            const r = Math.cbrt(Math.random()) * spread + 45; // Evitar el centro cercano al planeta

            const sinPhi = Math.sin(phi);
            positions[i * 3] = r * sinPhi * Math.cos(theta);
            positions[i * 3 + 1] = r * sinPhi * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);

            // Color aleatorio de la paleta
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            // Tamaño variado
            sizes[i] = Math.random() < 0.88 
                ? (0.8 + Math.random() * 1.6) 
                : (2.2 + Math.random() * 2.4); // Algunas estrellas más grandes y destacadas

            // Fase inicial de parpadeo
            phases[i] = Math.random() * Math.PI * 2;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));

        // Shader personalizado para parpadeo fluido sin coste de CPU
        const starShader = {
            uniforms: {
                uTime: { value: 0 },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
                uTexture: { value: this.generateStarSprite() }
            },
            vertexShader: `
                uniform float uTime;
                uniform float uPixelRatio;
                attribute float size;
                attribute float phase;
                varying vec3 vColor;
                varying float vAlpha;

                void main() {
                    vColor = color;

                    // Parpadeo suave armónico
                    float twinkle = 0.55 + 0.45 * sin(uTime * 2.2 + phase);
                    vAlpha = twinkle;

                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * twinkle * uPixelRatio * (280.0 / -mvPosition.z);
                    gl_PointSize = clamp(gl_PointSize, 1.0, 36.0);

                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform sampler2D uTexture;
                varying vec3 vColor;
                varying float vAlpha;

                void main() {
                    vec4 texColor = texture2D(uTexture, gl_PointCoord);
                    gl_FragColor = vec4(vColor * texColor.rgb, texColor.a * vAlpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        };

        this.starMaterial = new THREE.ShaderMaterial({
            uniforms: starShader.uniforms,
            vertexShader: starShader.vertexShader,
            fragmentShader: starShader.fragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            vertexColors: true
        });

        this.starPoints = new THREE.Points(geometry, this.starMaterial);
        this.group.add(this.starPoints);
    }

    createNebulaClouds() {
        const count = this.config.nebulaParticles || 500;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        const nebulaColors = [
            new THREE.Color('#380036'),
            new THREE.Color('#4a0044'),
            new THREE.Color('#2d054d'),
            new THREE.Color('#10002b'),
            new THREE.Color('#ff007f')
        ];

        for (let i = 0; i < count; i++) {
            // Nubes en bandas elípticas distantes
            const angle = Math.random() * Math.PI * 2;
            const dist = 140 + Math.random() * 260;
            const spreadY = (Math.random() - 0.5) * 160;

            positions[i * 3] = dist * Math.cos(angle) + (Math.random() - 0.5) * 40;
            positions[i * 3 + 1] = spreadY;
            positions[i * 3 + 2] = dist * Math.sin(angle) + (Math.random() - 0.5) * 40;

            const c = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
            colors[i * 3] = c.r;
            colors[i * 3 + 1] = c.g;
            colors[i * 3 + 2] = c.b;

            sizes[i] = 45 + Math.random() * 75;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const nebulaTex = this.generateNebulaTexture();
        const material = new THREE.PointsMaterial({
            size: 65,
            map: nebulaTex,
            vertexColors: true,
            transparent: true,
            opacity: 0.22,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.nebulaPoints = new THREE.Points(geometry, material);
        this.group.add(this.nebulaPoints);
    }

    initShootingStars() {
        // Pool de estrellas fugaces
        this.shootingStarPool = [];
        for (let i = 0; i < 4; i++) {
            const star = this.createShootingStarMesh();
            star.visible = false;
            this.group.add(star);
            this.shootingStarPool.push({
                mesh: star,
                active: false,
                life: 0,
                maxLife: 1.2,
                velocity: new THREE.Vector3()
            });
        }

        this.lastShootingStarTime = 0;
    }

    createShootingStarMesh() {
        // Línea con gradiente desvanecido para la estela de la estrella fugaz
        const length = 22.0;
        const positions = new Float32Array([
            0, 0, 0,
            -length, -length * 0.5, length * 0.3
        ]);
        const colors = new Float32Array([
            1.0, 1.0, 1.0,  // Cabeza blanca brillante
            1.0, 0.4, 0.7   // Cola rosa desvanecida
        ]);

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
            linewidth: 2
        });

        return new THREE.Line(geometry, material);
    }

    triggerShootingStar() {
        const available = this.shootingStarPool.find(s => !s.active);
        if (!available) return;

        // Posición de inicio aleatoria en el hemisferio superior
        const startX = (Math.random() - 0.5) * 350;
        const startY = 80 + Math.random() * 120;
        const startZ = (Math.random() - 0.5) * 300;

        available.mesh.position.set(startX, startY, startZ);

        // Velocidad diagonal hacia abajo
        available.velocity.set(
            -180 - Math.random() * 80,
            -90 - Math.random() * 50,
            50 + Math.random() * 50
        );

        available.life = 0;
        available.maxLife = 0.9 + Math.random() * 0.6;
        available.active = true;
        available.mesh.visible = true;
    }

    generateStarSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.2, 'rgba(255, 215, 235, 0.9)');
        grad.addColorStop(0.5, 'rgba(255, 100, 180, 0.35)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);

        // Destellos en cruz (difracción estelar brillante)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(32, 8);
        ctx.lineTo(32, 56);
        ctx.moveTo(8, 32);
        ctx.lineTo(56, 32);
        ctx.stroke();

        return new THREE.CanvasTexture(canvas);
    }

    generateNebulaTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');

        const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        grad.addColorStop(0.3, 'rgba(220, 100, 200, 0.5)');
        grad.addColorStop(0.6, 'rgba(100, 20, 140, 0.2)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 128, 128);

        return new THREE.CanvasTexture(canvas);
    }

    update(delta, isPaused) {
        if (!isPaused) {
            this.time += delta;

            // Rotación orbital muy lenta de todo el firmamento
            this.group.rotation.y += 0.00015;
            this.group.rotation.x = Math.sin(this.time * 0.05) * 0.02;

            // Actualizar tiempo en shader de estrellas para parpadeo
            if (this.starMaterial && this.starMaterial.uniforms) {
                this.starMaterial.uniforms.uTime.value = this.time;
            }

            // Actualizar estrellas fugaces
            const now = performance.now();
            if (now - this.lastShootingStarTime > (this.config.shootingStarFrequency || 3200)) {
                this.triggerShootingStar();
                this.lastShootingStarTime = now + (Math.random() - 0.5) * 1500;
            }

            this.shootingStarPool.forEach(star => {
                if (star.active) {
                    star.life += delta;
                    star.mesh.position.addScaledVector(star.velocity, delta);

                    // Curva de opacidad (aparición rápida, fade out suave)
                    const progress = star.life / star.maxLife;
                    if (progress >= 1.0) {
                        star.active = false;
                        star.mesh.visible = false;
                    } else {
                        const alpha = Math.sin(progress * Math.PI);
                        star.mesh.material.opacity = alpha * 0.95;
                    }
                }
            });
        }
    }
}
