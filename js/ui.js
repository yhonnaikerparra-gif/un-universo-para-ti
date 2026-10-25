/**
 * CONTROLADOR DE INTERFAZ DE USUARIO (UI & EVENTOS)
 * Gestiona el dock inferior, modales, drawer de personalización,
 * cambios de tema en vivo y respuestas interactivas a clics y toques.
 */

class RomanticUI {
    constructor(app) {
        this.app = app;
        this.config = window.ROMANTIC_CONFIG;

        // Elementos DOM
        this.btnMusic = document.getElementById('btn-music');
        this.musicIndicator = document.getElementById('music-indicator');
        this.btnPause = document.getElementById('btn-pause');
        this.pauseIcon = document.getElementById('pause-icon');
        this.playIcon = document.getElementById('play-icon');
        this.pauseText = document.getElementById('pause-text');

        this.btnLetter = document.getElementById('btn-letter');
        this.letterModal = document.getElementById('letter-modal');
        this.closeLetterBtn = document.getElementById('close-letter-btn');

        this.btnResetCam = document.getElementById('btn-reset-cam');
        this.btnSettings = document.getElementById('btn-settings');
        this.btnFullscreen = document.getElementById('btn-fullscreen');

        this.settingsDrawer = document.getElementById('settings-drawer');
        this.closeSettingsBtn = document.getElementById('close-settings-btn');

        this.phraseBubble = document.getElementById('phrase-bubble');
        this.phraseBubbleText = document.getElementById('phrase-bubble-text');
        this.bubbleTimeout = null;

        this.hintBadge = document.getElementById('hint-badge');

        this.init();
    }

    init() {
        this.setupLetterContent();
        this.bindEvents();
        this.bindSettings();

        // Ocultar suavemente el hint-badge tras 8 segundos
        setTimeout(() => {
            if (this.hintBadge) {
                this.hintBadge.style.opacity = '0';
                setTimeout(() => this.hintBadge.style.display = 'none', 600);
            }
        }, 8000);
    }

    setupLetterContent() {
        const titleEl = document.getElementById('letter-modal-title');
        const bodyEl = document.getElementById('letter-modal-body');
        const sigEl = document.getElementById('letter-modal-signature');
        const recipientEl = document.getElementById('recipient-name');

        if (titleEl) titleEl.innerText = this.config.letterTitle;
        if (sigEl) sigEl.innerText = this.config.sender;
        if (recipientEl) recipientEl.innerText = this.config.recipient;

        if (bodyEl) {
            bodyEl.innerHTML = '';
            (this.config.letterText || []).forEach(paragraph => {
                const p = document.createElement('p');
                p.innerText = paragraph;
                bodyEl.appendChild(p);
            });
        }
    }

    bindEvents() {
        // 1. Música ambiental
        this.btnMusic.addEventListener('click', () => {
            if (window.romanticAudio) {
                const playing = window.romanticAudio.toggle();
                if (playing) {
                    this.musicIndicator.classList.add('playing');
                    this.btnMusic.classList.add('active');
                } else {
                    this.musicIndicator.classList.remove('playing');
                    this.btnMusic.classList.remove('active');
                }
            }
        });

        // 2. Pausar / Reanudar
        this.btnPause.addEventListener('click', () => {
            this.app.isPaused = !this.app.isPaused;
            if (this.app.isPaused) {
                this.pauseIcon.style.display = 'none';
                this.playIcon.style.display = 'block';
                this.pauseText.innerText = 'Reanudar';
                this.btnPause.classList.add('active');
            } else {
                this.pauseIcon.style.display = 'block';
                this.playIcon.style.display = 'none';
                this.pauseText.innerText = 'Pausar';
                this.btnPause.classList.remove('active');
            }
        });

        // 3. Carta de Amor Modal
        this.btnLetter.addEventListener('click', () => {
            this.openLetterModal();
        });

        this.closeLetterBtn.addEventListener('click', () => {
            this.closeLetterModal();
        });

        this.letterModal.addEventListener('click', (e) => {
            if (e.target === this.letterModal) {
                this.closeLetterModal();
            }
        });

        // 4. Centrar Cámara
        this.btnResetCam.addEventListener('click', () => {
            if (this.app.sceneManager) {
                this.app.sceneManager.resetCameraView();
            }
        });

        // 5. Drawer de Ajustes
        this.btnSettings.addEventListener('click', () => {
            this.settingsDrawer.classList.toggle('active');
            this.btnSettings.classList.toggle('active');
        });

        this.closeSettingsBtn.addEventListener('click', () => {
            this.settingsDrawer.classList.remove('active');
            this.btnSettings.classList.remove('active');
        });

        // 6. Pantalla Completa
        this.btnFullscreen.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.log("Fullscreen request failed:", err);
                });
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        });

        // 7. Raycasting y clics en el canvas
        const dom = this.app.sceneManager.renderer.domElement;
        let pointerDownX = 0;
        let pointerDownY = 0;

        dom.addEventListener('pointerdown', (e) => {
            pointerDownX = e.clientX;
            pointerDownY = e.clientY;
        });

        dom.addEventListener('pointerup', (e) => {
            // Verificar si fue un clic o un arrastre de órbita
            const dist = Math.hypot(e.clientX - pointerDownX, e.clientY - pointerDownY);
            if (dist < 6) {
                this.onCanvasClick(e);
            }
        });

        dom.addEventListener('pointermove', (e) => {
            this.onCanvasMouseMove(e);
        });

        // Cerrar burbuja al cliquear en ella
        this.phraseBubble.addEventListener('click', () => {
            this.phraseBubble.classList.remove('active');
        });
    }

    bindSettings() {
        // Añadir Frase Personalizada
        const inputPhrase = document.getElementById('input-new-phrase');
        const btnAddPhrase = document.getElementById('btn-add-phrase');

        const doAdd = () => {
            const val = inputPhrase.value.trim();
            if (val && this.app.phrasesManager) {
                this.app.phrasesManager.addCustomPhrase(val);
                this.showPhraseBubble(val, window.innerWidth / 2, window.innerHeight * 0.45);
                inputPhrase.value = '';
            }
        };

        btnAddPhrase.addEventListener('click', doAdd);
        inputPhrase.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') doAdd();
        });

        // Dedicatoria y Nombres
        const inputRecipient = document.getElementById('input-recipient');
        const inputSender = document.getElementById('input-sender');

        inputRecipient.addEventListener('input', (e) => {
            const val = e.target.value.trim() || 'Mi Amor';
            this.config.recipient = val;
            document.getElementById('recipient-name').innerText = val;
        });

        inputSender.addEventListener('input', (e) => {
            const val = e.target.value.trim() || 'Tuyo por Siempre';
            this.config.sender = val;
            document.getElementById('letter-modal-signature').innerText = val;
        });

        // Sliders de Velocidad y Escala
        const sliderSpeedPlanet = document.getElementById('slider-speed-planet');
        sliderSpeedPlanet.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            if (this.app.planet) this.app.planet.setRotationSpeed(val);
        });

        const sliderSpeedRings = document.getElementById('slider-speed-rings');
        const labelSpeedRings = document.getElementById('label-speed-rings');
        sliderSpeedRings.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            labelSpeedRings.innerText = `${val.toFixed(1)}x`;
            if (this.app.rings) this.app.rings.setSpeedMultiplier(val);
        });

        const sliderSizePlanet = document.getElementById('slider-size-planet');
        const labelSizePlanet = document.getElementById('label-size-planet');
        sliderSizePlanet.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            labelSizePlanet.innerText = val.toFixed(1);
            if (this.app.planet) this.app.planet.setRadius(val);
        });

        const sliderBloom = document.getElementById('slider-bloom');
        const labelBloom = document.getElementById('label-bloom');
        sliderBloom.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            labelBloom.innerText = val.toFixed(1);
            if (this.app.sceneManager) this.app.sceneManager.setBloomStrength(val);
        });

        // Sliders de Audio
        const sliderVolume = document.getElementById('slider-volume');
        const labelVolume = document.getElementById('label-volume');
        sliderVolume.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            labelVolume.innerText = `${Math.round(val * 100)}%`;
            if (window.romanticAudio) window.romanticAudio.setVolume(val);
        });

        const inputAudioFile = document.getElementById('input-audio-file');
        inputAudioFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && window.romanticAudio) {
                window.romanticAudio.loadCustomAudioFile(file);
                this.musicIndicator.classList.add('playing');
                this.btnMusic.classList.add('active');
            }
        });

        // Paletas de Color Temáticas
        const themeCards = document.querySelectorAll('.theme-card');
        themeCards.forEach(card => {
            card.addEventListener('click', () => {
                themeCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                const theme = card.dataset.theme;
                this.applyColorTheme(theme);
            });
        });
    }

    applyColorTheme(theme) {
        if (!this.app.planet) return;

        let core, rim, atmosphere;

        switch (theme) {
            case 'pink':
                core = '#0a0316';
                rim = '#ff2a8d';
                atmosphere = '#a82cff';
                document.documentElement.style.setProperty('--primary-neon', '#ff2a8d');
                break;
            case 'violet':
                core = '#070216';
                rim = '#b026ff';
                atmosphere = '#7b1fa2';
                document.documentElement.style.setProperty('--primary-neon', '#b026ff');
                break;
            case 'crimson':
                core = '#120005';
                rim = '#ff1744';
                atmosphere = '#ff5252';
                document.documentElement.style.setProperty('--primary-neon', '#ff1744');
                break;
            case 'cyan':
                core = '#010c17';
                rim = '#00f2fe';
                atmosphere = '#4facfe';
                document.documentElement.style.setProperty('--primary-neon', '#00f2fe');
                break;
        }

        this.app.planet.setColors(core, rim, atmosphere);
    }

    onCanvasMouseMove(e) {
        if (!this.app.phrasesManager || !this.app.sceneManager) return;
        const normX = (e.clientX / window.innerWidth) * 2 - 1;
        const normY = -(e.clientY / window.innerHeight) * 2 + 1;
        this.app.phrasesManager.checkIntersection(this.app.sceneManager.camera, normX, normY);
    }

    onCanvasClick(e) {
        if (!this.app.phrasesManager || !this.app.sceneManager) return;
        const normX = (e.clientX / window.innerWidth) * 2 - 1;
        const normY = -(e.clientY / window.innerHeight) * 2 + 1;

        const hit = this.app.phrasesManager.handleClick(this.app.sceneManager.camera, normX, normY);
        if (hit) {
            this.showPhraseBubble(hit.text, e.clientX, e.clientY);
        } else {
            // Si cliquea en el espacio, generar una pequeña ráfaga de corazones
            const vector = new THREE.Vector3(normX, normY, 0.5);
            vector.unproject(this.app.sceneManager.camera);
            const dir = vector.sub(this.app.sceneManager.camera.position).normalize();
            const distance = 45;
            const pos = this.app.sceneManager.camera.position.clone().add(dir.multiplyScalar(distance));

            if (this.app.particles) {
                this.app.particles.triggerBurst(pos, 12);
            }
        }
    }

    showPhraseBubble(text, screenX, screenY) {
        if (this.bubbleTimeout) clearTimeout(this.bubbleTimeout);

        this.phraseBubbleText.innerText = text;

        // Mantener dentro de los bordes de la pantalla
        const posX = Math.max(120, Math.min(window.innerWidth - 120, screenX));
        const posY = Math.max(90, Math.min(window.innerHeight - 80, screenY - 20));

        this.phraseBubble.style.left = `${posX}px`;
        this.phraseBubble.style.top = `${posY}px`;
        this.phraseBubble.classList.add('active');

        this.bubbleTimeout = setTimeout(() => {
            this.phraseBubble.classList.remove('active');
        }, 4200);
    }

    openLetterModal() {
        this.setupLetterContent();
        this.letterModal.classList.add('active');
    }

    closeLetterModal() {
        this.letterModal.classList.remove('active');
    }
}
