/**
 * ENTRADA PRINCIPAL DEL UNIVERSO ROMÁNTICO 3D
 * Inicialización de todos los módulos, ciclo de animación (rAF) y
 * gestión de rendimiento y ciclo de vida de la pestaña.
 */

class RomanticUniverseApp {
    constructor() {
        this.config = window.ROMANTIC_CONFIG;
        this.isPaused = false;
        this.clock = new THREE.Clock();

        this.sceneManager = null;
        this.planet = null;
        this.rings = null;
        this.starfield = null;
        this.particles = null;
        this.phrasesManager = null;
        this.ui = null;

        this.init();
    }

    init() {
        const container = document.getElementById('canvas-container');

        // 1. Iniciar Escena, Cámara y Renderizador
        this.sceneManager = new RomanticUniverseScene(container, this.config);

        // 2. Iniciar Planeta Central
        this.planet = new RomanticPlanet(this.sceneManager.scene, this.config);

        // 3. Iniciar Anillos y Órbitas
        this.rings = new RomanticRings(this.sceneManager.scene, this.config);

        // 4. Iniciar Estrellas, Nebulosas y Estrellas Fugaces
        this.starfield = new RomanticStarfield(this.sceneManager.scene, this.config);

        // 5. Iniciar Corazones y Polvo Cósmico Flotante
        this.particles = new RomanticParticles(this.sceneManager.scene, this.config);

        // 6. Iniciar Frases Románticas en 3D
        this.phrasesManager = new RomanticPhrases(this.sceneManager.scene, this.config, this.particles);

        // 7. Iniciar Interfaz de Usuario y Eventos
        this.ui = new RomanticUI(this);

        // 8. Gestión de pausa cuando la pestaña del navegador no está activa (Optimización de GPU)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.wasPausedBeforeHide = this.isPaused;
                this.isPaused = true;
            } else {
                if (!this.wasPausedBeforeHide) {
                    this.isPaused = false;
                }
                this.clock.getDelta(); // Limpiar salto de tiempo acumulado
            }
        });

        // 9. Iniciar bucle de animación
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);

        console.log("✨ Universo Romántico 3D inicializado con éxito ✨");
    }

    animate() {
        requestAnimationFrame(this.animate);

        const delta = Math.min(this.clock.getDelta(), 0.1); // Evitar saltos de tiempo grandes

        // 1. Actualizar escena y controles de cámara
        this.sceneManager.update(delta);

        // 2. Actualizar componentes si no está en pausa manual
        if (this.planet) {
            this.planet.update(delta, this.isPaused);
        }

        if (this.rings) {
            this.rings.update(delta, this.isPaused);
        }

        if (this.starfield) {
            this.starfield.update(delta, this.isPaused);
        }

        if (this.particles) {
            this.particles.update(delta, this.isPaused);
        }

        if (this.phrasesManager) {
            this.phrasesManager.update(delta, this.isPaused);
        }

        // 3. Renderizar cuadro (con Bloom neón)
        this.sceneManager.render();
    }
}

// Iniciar aplicación una vez cargado el DOM
window.addEventListener('DOMContentLoaded', () => {
    window.romanticUniverse = new RomanticUniverseApp();
});
