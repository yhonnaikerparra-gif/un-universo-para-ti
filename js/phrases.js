/**
 * SISTEMA DE FRASES ROMÁNTICAS FLOTANTES EN 3D
 * Cientos de palabras y frases de amor distribuidas orgánicamente en el espacio,
 * con profundidad real, movimiento de vaivén, resplandor neón e interactividad.
 */

class RomanticPhrases {
    constructor(scene, config, particlesRef) {
        this.scene = scene;
        this.config = config.phrases;
        this.particles = particlesRef;
        this.group = new THREE.Group();
        this.phraseItems = [];
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2(-999, -999);
        this.hoveredItem = null;
        this.time = 0;
        this.textureCache = new Map();

        this.init();
    }

    init() {
        const phrasesList = this.config.list || [];
        const count = Math.min(this.config.spawnCount || 150, phrasesList.length * 3);

        for (let i = 0; i < count; i++) {
            const text = phrasesList[i % phrasesList.length];
            this.spawnPhrase(text, i, count);
        }

        this.scene.add(this.group);
    }

    spawnPhrase(text, index, total) {
        const color = this.config.colors[Math.floor(Math.random() * this.config.colors.length)];
        const texture = this.getOrCreateTextTexture(text, color);

        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            opacity: 0.85 + Math.random() * 0.15,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const sprite = new THREE.Sprite(material);

        const aspect = texture.image.width / texture.image.height;
        // Escala elegante y proporcionada (entre 1.1 y 1.9)
        const baseHeight = 1.1 + Math.random() * 0.8;
        const baseWidth = baseHeight * aspect;
        sprite.scale.set(baseWidth, baseHeight, 1);

        // Distribución toroidal y esférica alrededor del planeta
        // Radio entre 35 y 160 para que no choque contra el planeta ni quede fuera del universo
        const minR = this.config.minRadius || 36;
        const maxR = this.config.maxRadius || 170;
        const r = minR + Math.pow(Math.random(), 0.75) * (maxR - minR);

        const angle = Math.random() * Math.PI * 2;
        // Variación de altura orgánica
        const heightRange = this.config.heightRange || 110;
        const y = (Math.random() - 0.5) * heightRange * (0.35 + 0.65 * (1 - (r - minR) / (maxR - minR)));

        // Calcular posición espacial
        let x = r * Math.cos(angle);
        let z = r * Math.sin(angle);

        // Si la frase queda muy cerca de la posición inicial de la cámara (z ~ 75..95), desplazarla sutilmente
        if (Math.abs(x) < 20 && z > 50) {
            z = 40 + Math.random() * 15;
            x = (Math.random() > 0.5 ? 1 : -1) * (26 + Math.random() * 35);
        }

        sprite.position.set(x, y, z);

        const phraseData = {
            sprite: sprite,
            text: text,
            color: color,
            baseScaleX: baseWidth,
            baseScaleY: baseHeight,
            radius: r,
            angle: angle,
            orbitSpeed: (0.0004 + Math.random() * 0.001) * (Math.random() > 0.5 ? 1 : -1),
            initialY: y,
            swaySpeed: 0.7 + Math.random() * 1.3,
            swayAmp: 1.2 + Math.random() * 2.0,
            phaseOffset: Math.random() * Math.PI * 2,
            targetScaleMultiplier: 1.0,
            currentScaleMultiplier: 1.0
        };

        sprite.userData = phraseData;
        this.group.add(sprite);
        this.phraseItems.push(phraseData);

        return phraseData;
    }

    getOrCreateTextTexture(text, color) {
        const cacheKey = `${text}_${color}`;
        if (this.textureCache.has(cacheKey)) {
            return this.textureCache.get(cacheKey);
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const fontSize = 38;
        const fontFamily = "'Montserrat', 'Quicksand', 'Segoe UI', sans-serif";
        ctx.font = `600 ${fontSize}px ${fontFamily}`;

        const metrics = ctx.measureText(text);
        const textWidth = Math.ceil(metrics.width);
        const padX = 28;
        const padY = 20;

        canvas.width = textWidth + padX * 2;
        canvas.height = fontSize + padY * 2;

        ctx.font = `600 ${fontSize}px ${fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        // Resplandor neón
        ctx.shadowColor = color;
        ctx.shadowBlur = 14;
        ctx.fillStyle = color;
        ctx.fillText(text, cx, cy);

        // Núcleo blanco brillante
        ctx.shadowBlur = 3;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(text, cx, cy);

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        this.textureCache.set(cacheKey, texture);

        return texture;
    }

    addCustomPhrase(newText) {
        if (!newText || newText.trim() === '') return;
        const clean = newText.trim();
        const p = this.spawnPhrase(clean, this.phraseItems.length, this.phraseItems.length + 1);

        // Posicionar al frente visible
        p.radius = 38;
        p.sprite.position.set(
            (Math.random() - 0.5) * 20,
            4 + (Math.random() - 0.5) * 12,
            38
        );
        p.currentScaleMultiplier = 2.0;

        if (this.particles) {
            this.particles.triggerBurst(p.sprite.position, 28);
        }
        return p;
    }

    checkIntersection(camera, normalizedX, normalizedY) {
        this.mouse.x = normalizedX;
        this.mouse.y = normalizedY;

        this.raycaster.setFromCamera(this.mouse, camera);
        const sprites = this.phraseItems.map(item => item.sprite);
        const intersects = this.raycaster.intersectObjects(sprites, false);

        if (intersects.length > 0) {
            const hitSprite = intersects[0].object;
            const item = hitSprite.userData;

            if (this.hoveredItem !== item) {
                if (this.hoveredItem) {
                    this.hoveredItem.targetScaleMultiplier = 1.0;
                }
                this.hoveredItem = item;
                this.hoveredItem.targetScaleMultiplier = 1.4;
                document.body.style.cursor = 'pointer';
            }
            return item;
        } else {
            if (this.hoveredItem) {
                this.hoveredItem.targetScaleMultiplier = 1.0;
                this.hoveredItem = null;
                document.body.style.cursor = 'default';
            }
            return null;
        }
    }

    handleClick(camera, normalizedX, normalizedY) {
        const item = this.checkIntersection(camera, normalizedX, normalizedY);
        if (item) {
            if (this.particles) {
                this.particles.triggerBurst(item.sprite.position, 24);
            }
            if (window.romanticAudio) {
                window.romanticAudio.playSparkleEffect();
            }
            return item;
        }
        return null;
    }

    update(delta, isPaused) {
        if (!isPaused) {
            this.time += delta;

            for (let i = 0; i < this.phraseItems.length; i++) {
                const item = this.phraseItems[i];

                item.angle += item.orbitSpeed;
                item.sprite.position.x = item.radius * Math.cos(item.angle);
                item.sprite.position.z = item.radius * Math.sin(item.angle);

                const sway = Math.sin(this.time * item.swaySpeed + item.phaseOffset) * item.swayAmp;
                item.sprite.position.y = item.initialY + sway;

                item.currentScaleMultiplier += (item.targetScaleMultiplier - item.currentScaleMultiplier) * 0.15;
                item.sprite.scale.set(
                    item.baseScaleX * item.currentScaleMultiplier,
                    item.baseScaleY * item.currentScaleMultiplier,
                    1
                );
            }
        }
    }
}
