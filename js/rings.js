/**
 * ANILLOS Y ÓRBITAS LUMINOSAS
 * Anillos elípticos luminosos, órbitas inclinadas en diferentes direcciones,
 * cinturones de partículas estelares y pequeños corazones orbitales.
 */

class RomanticRings {
    constructor(scene, config) {
        this.scene = scene;
        this.config = config.rings;
        this.group = new THREE.Group();
        this.ringsList = [];
        this.particleBelts = [];
        this.orbitalHearts = [];
        this.speedMultiplier = this.config.speedMultiplier ?? 1.0;

        this.init();
    }

    init() {
        // 1. Crear anillos principales y órbitas inclinadas desde la configuración
        this.config.items.forEach((item, index) => {
            if (item.particleCount) {
                this.createParticleBelt(item, index);
            } else {
                this.createLuminousRing(item, index);
            }
        });

        // 2. Crear una órbita especial con pequeños corazones luminosos
        this.createHeartOrbitalBelt();

        this.scene.add(this.group);
    }

    createLuminousRing(item, index) {
        const inner = item.innerRadius;
        const outer = item.outerRadius;
        const width = outer - inner;

        let mesh;

        if (width > 3.0) {
            // Anillo principal ancho tipo disco con bandas concéntricas nítidas
            const geometry = new THREE.RingGeometry(inner, outer, 128, 8);
            const ringTex = this.generateRingTexture(item.color1, item.color2);

            const material = new THREE.MeshBasicMaterial({
                map: ringTex,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.9,
                depthWrite: false
            });

            mesh = new THREE.Mesh(geometry, material);
            mesh.rotation.x = Math.PI / 2;
        } else {
            // Anillo tubular delgado (órbita de neón radiante)
            const midRadius = (inner + outer) / 2;
            const tubeRadius = Math.max(0.12, width / 4);
            const geometry = new THREE.TorusGeometry(midRadius, tubeRadius, 16, 128);

            const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color(item.color1),
                transparent: true,
                opacity: item.opacity || 0.85,
                blending: THREE.AdditiveBlending
            });

            mesh = new THREE.Mesh(geometry, material);
            mesh.rotation.x = Math.PI / 2;
        }

        const pivot = new THREE.Group();
        pivot.rotation.x = item.tiltX || 0;
        pivot.rotation.z = item.tiltZ || 0;
        pivot.add(mesh);

        this.group.add(pivot);

        this.ringsList.push({
            pivot: pivot,
            mesh: mesh,
            rotSpeed: item.rotSpeed || 0.003
        });
    }

    createParticleBelt(item, index) {
        const count = item.particleCount;
        const radius = item.radius;
        const spread = item.spread;

        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const angles = new Float32Array(count);
        const speeds = new Float32Array(count);
        const radii = new Float32Array(count);
        const yOffsets = new Float32Array(count);

        const colorBase = new THREE.Color(item.color || '#ff80bf');
        const colorHighlight = new THREE.Color('#ffffff');

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const r = radius + (Math.random() - 0.5) * spread * 2;
            const y = (Math.random() - 0.5) * (spread * 0.5);

            positions[i * 3] = r * Math.cos(angle);
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = r * Math.sin(angle);

            const lerpFactor = Math.random();
            const c = colorBase.clone().lerp(colorHighlight, lerpFactor * 0.5);
            colors[i * 3] = c.r;
            colors[i * 3 + 1] = c.g;
            colors[i * 3 + 2] = c.b;

            sizes[i] = (item.size || 1.1) * (0.6 + Math.random() * 0.8);
            angles[i] = angle;
            radii[i] = r;
            yOffsets[i] = y;
            speeds[i] = (item.rotSpeed || 0.004) * (1 + (Math.random() - 0.5) * 0.2);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const particleTexture = this.generateGlowDotTexture();

        const material = new THREE.PointsMaterial({
            size: item.size || 0.9,
            map: particleTexture,
            vertexColors: true,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const points = new THREE.Points(geometry, material);

        const pivot = new THREE.Group();
        pivot.rotation.x = item.tiltX || 0;
        pivot.rotation.z = item.tiltZ || 0;
        pivot.add(points);

        this.group.add(pivot);

        this.particleBelts.push({
            pivot: pivot,
            points: points,
            geometry: geometry,
            count: count,
            angles: angles,
            radii: radii,
            yOffsets: yOffsets,
            speeds: speeds
        });
    }

    createHeartOrbitalBelt() {
        const heartCount = 20;
        const heartTexture = this.generateHeartTexture('#ff2a8d');
        const orbitRadius = 36.0;

        const group = new THREE.Group();
        group.rotation.x = -0.32;
        group.rotation.z = 0.42;

        const hearts = [];

        for (let i = 0; i < heartCount; i++) {
            const angle = (i / heartCount) * Math.PI * 2;
            const mat = new THREE.SpriteMaterial({
                map: heartTexture,
                color: 0xffffff,
                transparent: true,
                opacity: 0.85,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            const sprite = new THREE.Sprite(mat);
            const scale = 2.0 + Math.random() * 0.8;
            sprite.scale.set(scale, scale, 1);

            const x = orbitRadius * Math.cos(angle);
            const z = orbitRadius * Math.sin(angle);
            const y = Math.sin(angle * 3) * 1.2;

            sprite.position.set(x, y, z);
            group.add(sprite);

            hearts.push({
                sprite: sprite,
                baseAngle: angle,
                radius: orbitRadius,
                speed: 0.0035,
                baseScale: scale,
                pulseOffset: Math.random() * Math.PI * 2
            });
        }

        this.group.add(group);
        this.orbitalHeartsGroup = group;
        this.orbitalHearts = hearts;
    }

    generateRingTexture(color1Hex, color2Hex) {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
        grad.addColorStop(0.0, 'rgba(0,0,0,0)');
        grad.addColorStop(0.08, 'rgba(255, 20, 147, 0.2)');
        grad.addColorStop(0.22, color1Hex);
        grad.addColorStop(0.36, 'rgba(255, 64, 129, 0.8)');
        grad.addColorStop(0.48, color2Hex);
        grad.addColorStop(0.60, 'rgba(142, 36, 170, 0.45)');
        grad.addColorStop(0.72, color1Hex);
        grad.addColorStop(0.84, 'rgba(255, 105, 180, 0.6)');
        grad.addColorStop(0.94, 'rgba(255, 182, 193, 0.35)');
        grad.addColorStop(1.0, 'rgba(0,0,0,0)');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Línea sutil de resplandor rosa pálido (no blanco puro)
        ctx.fillStyle = 'rgba(255, 220, 235, 0.65)';
        ctx.fillRect(canvas.width * 0.35, 0, 2, canvas.height);
        ctx.fillRect(canvas.width * 0.74, 0, 1.5, canvas.height);

        // Ranuras translúcidas de división de Cassini
        ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        ctx.fillRect(canvas.width * 0.48, 0, 14, canvas.height);
        ctx.fillRect(canvas.width * 0.63, 0, 8, canvas.height);

        return new THREE.CanvasTexture(canvas);
    }

    generateGlowDotTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
        gradient.addColorStop(0.25, 'rgba(255, 180, 220, 0.7)');
        gradient.addColorStop(0.55, 'rgba(255, 42, 141, 0.25)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);

        return new THREE.CanvasTexture(canvas);
    }

    generateHeartTexture(colorHex) {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');

        ctx.save();
        ctx.translate(64, 64);

        ctx.shadowColor = colorHex;
        ctx.shadowBlur = 12;

        ctx.beginPath();
        const topCurveHeight = 24;
        ctx.moveTo(0, topCurveHeight);
        ctx.bezierCurveTo(0, 0, -38, 0, -38, -24);
        ctx.bezierCurveTo(-38, -48, 0, -60, 0, -78);
        ctx.bezierCurveTo(0, -60, 38, -48, 38, -24);
        ctx.bezierCurveTo(38, 0, 0, 0, 0, topCurveHeight);
        ctx.closePath();

        ctx.rotate(Math.PI);
        ctx.fillStyle = colorHex;
        ctx.fill();

        ctx.restore();
        return new THREE.CanvasTexture(canvas);
    }

    update(delta, isPaused) {
        if (isPaused) return;

        const mult = this.speedMultiplier;

        // 1. Rotar anillos luminosos
        this.ringsList.forEach(ring => {
            ring.mesh.rotation.z += ring.rotSpeed * mult;
        });

        // 2. Animar partículas en cinturones
        this.particleBelts.forEach(belt => {
            const positions = belt.geometry.attributes.position.array;
            const count = belt.count;

            for (let i = 0; i < count; i++) {
                belt.angles[i] += belt.speeds[i] * mult;
                const a = belt.angles[i];
                const r = belt.radii[i];

                positions[i * 3] = r * Math.cos(a);
                positions[i * 3 + 1] = belt.yOffsets[i] + Math.sin(a * 2) * 0.6;
                positions[i * 3 + 2] = r * Math.sin(a);
            }
            belt.geometry.attributes.position.needsUpdate = true;
        });

        // 3. Animar corazones orbitales
        if (this.orbitalHearts && this.orbitalHearts.length > 0) {
            const time = performance.now() * 0.001;
            this.orbitalHearts.forEach(item => {
                item.baseAngle += item.speed * mult;
                const a = item.baseAngle;
                const r = item.radius;

                item.sprite.position.x = r * Math.cos(a);
                item.sprite.position.z = r * Math.sin(a);
                item.sprite.position.y = Math.sin(a * 3) * 1.4;

                const pulse = 1 + 0.12 * Math.sin(time * 3 + item.pulseOffset);
                item.sprite.scale.set(item.baseScale * pulse, item.baseScale * pulse, 1);
            });
        }
    }

    setSpeedMultiplier(val) {
        this.speedMultiplier = val;
    }
}
