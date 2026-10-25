/**
 * SISTEMA DE PARTÍCULAS ROMÁNTICAS Y CORAZONES FLOTANTES
 * Corazones 3D flotantes con latido armónico, polvo cósmico de amor
 * y explosión interactiva de corazones al cliquear o mover el ratón.
 */

class RomanticParticles {
    constructor(scene, config) {
        this.scene = scene;
        this.config = config.particles;
        this.group = new THREE.Group();
        this.hearts = [];
        this.burstPool = [];
        this.time = 0;

        this.init();
    }

    init() {
        // 1. Crear corazones flotantes ascendentes
        this.createFloatingHearts();

        // 2. Crear polvo cósmico brillante
        this.createCosmicDust();

        // 3. Crear pool de partículas para explosiones de corazones al cliquear
        this.initBurstPool();

        this.scene.add(this.group);
    }

    createFloatingHearts() {
        const count = this.config.heartsCount || 80;
        const heartTexture = this.generateHeartTexture();

        for (let i = 0; i < count; i++) {
            const mat = new THREE.SpriteMaterial({
                map: heartTexture,
                color: new THREE.Color(this.getRandomHeartColor()),
                transparent: true,
                opacity: 0.35 + Math.random() * 0.55,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            const sprite = new THREE.Sprite(mat);
            const size = (this.config.heartSize || 3.0) * (0.6 + Math.random() * 1.0);
            sprite.scale.set(size, size, 1);

            // Distribución espacial en cilindro / esfera amplia
            const radius = 25 + Math.random() * 110;
            const angle = Math.random() * Math.PI * 2;
            const y = -80 + Math.random() * 160;

            sprite.position.set(
                radius * Math.cos(angle),
                y,
                radius * Math.sin(angle)
            );

            this.group.add(sprite);

            this.hearts.push({
                sprite: sprite,
                baseSize: size,
                speedY: (0.15 + Math.random() * 0.25) * (this.config.floatSpeed || 0.35),
                swaySpeed: 0.8 + Math.random() * 1.5,
                swayRadius: 0.2 + Math.random() * 0.6,
                pulseOffset: Math.random() * Math.PI * 2,
                orbitRadius: radius,
                orbitAngle: angle,
                orbitSpeed: (Math.random() - 0.5) * 0.002,
                initialY: y
            });
        }
    }

    createCosmicDust() {
        const count = this.config.cosmicDustCount || 450;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const originalPositions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);

        const palette = [
            new THREE.Color('#ff2a8d'),
            new THREE.Color('#ff80bf'),
            new THREE.Color('#e066ff'),
            new THREE.Color('#ffffff')
        ];

        for (let i = 0; i < count; i++) {
            const r = 20 + Math.random() * 130;
            const theta = Math.random() * Math.PI * 2;
            const y = (Math.random() - 0.5) * 120;

            const x = r * Math.cos(theta);
            const z = r * Math.sin(theta);

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            originalPositions[i * 3] = x;
            originalPositions[i * 3 + 1] = y;
            originalPositions[i * 3 + 2] = z;

            velocities[i * 3] = (Math.random() - 0.5) * 0.08;
            velocities[i * 3 + 1] = 0.05 + Math.random() * 0.12;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.08;

            const color = palette[Math.floor(Math.random() * palette.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const dustTexture = this.generateSparkleTexture();

        const material = new THREE.PointsMaterial({
            size: this.config.dustSize || 1.8,
            map: dustTexture,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.dustPoints = new THREE.Points(geometry, material);
        this.dustData = {
            count: count,
            positions: positions,
            originalPositions: originalPositions,
            velocities: velocities
        };

        this.group.add(this.dustPoints);
    }

    initBurstPool() {
        const poolSize = 60;
        const burstTex = this.generateHeartTexture();

        for (let i = 0; i < poolSize; i++) {
            const mat = new THREE.SpriteMaterial({
                map: burstTex,
                color: new THREE.Color('#ff3388'),
                transparent: true,
                opacity: 0,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            const sprite = new THREE.Sprite(mat);
            sprite.visible = false;
            this.group.add(sprite);

            this.burstPool.push({
                sprite: sprite,
                active: false,
                life: 0,
                maxLife: 1.0,
                velocity: new THREE.Vector3(),
                baseScale: 2.5
            });
        }
    }

    triggerBurst(position, count = 16) {
        let spawned = 0;
        for (let i = 0; i < this.burstPool.length && spawned < count; i++) {
            const p = this.burstPool[i];
            if (!p.active) {
                p.active = true;
                p.life = 0;
                p.maxLife = 0.8 + Math.random() * 0.6;
                p.sprite.visible = true;
                p.sprite.position.copy(position);

                // Explosión esférica tridimensional
                const speed = 12 + Math.random() * 22;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);

                p.velocity.set(
                    speed * Math.sin(phi) * Math.cos(theta),
                    speed * Math.sin(phi) * Math.sin(theta) + 4.0, // Impulso ascendente
                    speed * Math.cos(phi)
                );

                const s = 1.8 + Math.random() * 2.2;
                p.baseScale = s;
                p.sprite.scale.set(s, s, 1);
                p.sprite.material.color.set(this.getRandomHeartColor());

                spawned++;
            }
        }
    }

    getRandomHeartColor() {
        const colors = ['#ff2a8d', '#ff66b2', '#ff007f', '#e066ff', '#ffffff', '#ff99c8'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    generateHeartTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');

        ctx.save();
        ctx.translate(64, 64);
        ctx.shadowColor = '#ff2a8d';
        ctx.shadowBlur = 16;

        ctx.beginPath();
        const topCurveHeight = 24;
        ctx.moveTo(0, topCurveHeight);
        ctx.bezierCurveTo(0, 0, -38, 0, -38, -26);
        ctx.bezierCurveTo(-38, -50, 0, -62, 0, -82);
        ctx.bezierCurveTo(0, -62, 38, -50, 38, -26);
        ctx.bezierCurveTo(38, 0, 0, 0, 0, topCurveHeight);
        ctx.closePath();

        ctx.rotate(Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        ctx.restore();
        return new THREE.CanvasTexture(canvas);
    }

    generateSparkleTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.3, 'rgba(255, 150, 200, 0.8)');
        grad.addColorStop(0.7, 'rgba(255, 50, 150, 0.2)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);

        return new THREE.CanvasTexture(canvas);
    }

    update(delta, isPaused, mouseVector) {
        if (!isPaused) {
            this.time += delta;

            // 1. Animar corazones flotantes ascendentes
            this.hearts.forEach(h => {
                h.sprite.position.y += h.speedY;
                h.orbitAngle += h.orbitSpeed;

                // Suave vaivén lateral
                h.sprite.position.x = h.orbitRadius * Math.cos(h.orbitAngle) + Math.sin(this.time * h.swaySpeed) * h.swayRadius * 6;
                h.sprite.position.z = h.orbitRadius * Math.sin(h.orbitAngle) + Math.cos(this.time * h.swaySpeed) * h.swayRadius * 6;

                // Pulsación de latido de corazón
                const pulse = 1.0 + 0.22 * Math.sin(this.time * 3.5 + h.pulseOffset);
                h.sprite.scale.set(h.baseSize * pulse, h.baseSize * pulse, 1);

                // Reciclaje infinito al superar la altura máxima
                if (h.sprite.position.y > 85) {
                    h.sprite.position.y = -85;
                }
            });

            // 2. Animar polvo cósmico
            if (this.dustData) {
                const pos = this.dustData.positions;
                const orig = this.dustData.originalPositions;
                const count = this.dustData.count;

                for (let i = 0; i < count; i++) {
                    pos[i * 3 + 1] += this.dustData.velocities[i * 3 + 1];
                    pos[i * 3] += Math.sin(this.time + i) * 0.04;
                    pos[i * 3 + 2] += Math.cos(this.time + i) * 0.04;

                    if (pos[i * 3 + 1] > 65) {
                        pos[i * 3 + 1] = -65;
                    }
                }
                this.dustPoints.geometry.attributes.position.needsUpdate = true;
            }

            // 3. Animar partículas en explosión (bursts)
            this.burstPool.forEach(p => {
                if (p.active) {
                    p.life += delta;
                    if (p.life >= p.maxLife) {
                        p.active = false;
                        p.sprite.visible = false;
                    } else {
                        p.sprite.position.addScaledVector(p.velocity, delta);
                        // Fricción suave
                        p.velocity.multiplyScalar(0.96);

                        const progress = p.life / p.maxLife;
                        const alpha = 1.0 - progress;
                        p.sprite.material.opacity = alpha;

                        const scale = p.baseScale * (1.0 + progress * 0.5);
                        p.sprite.scale.set(scale, scale, 1);
                    }
                }
            });
        }
    }
}
