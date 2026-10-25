/**
 * MOTOR DE AUDIO AMBIENTAL ROMÁNTICO (Web Audio API)
 * Genera una atmósfera sonora espacial, relajante y emotiva con acordes etéreos,
 * campanillas celestiales y un suave latido de corazón.
 * Funciona 100% offline sin necesidad de archivos externos y también permite
 * cargar una canción personalizada (MP3/WAV).
 */

class RomanticAudioEngine {
    constructor() {
        this.ctx = null;
        this.isPlaying = false;
        this.masterGain = null;
        this.customAudio = null;
        this.useCustomAudio = false;
        this.timer = null;
        this.currentChordIndex = 0;
        this.volume = window.ROMANTIC_CONFIG?.audio?.volume ?? 0.5;

        // Progresión de acordes románticos celestiales (Frecuencias en Hz)
        // Acordes basados en escalas emotivas de ensueño: Ebmaj9 - Cm9 - Abmaj9 - Bbadd9
        this.chords = [
            [155.56, 233.08, 311.13, 392.00, 587.33], // Eb - Bb - Eb - G - D (Ebmaj9)
            [130.81, 196.00, 261.63, 311.13, 466.16], // C - G - C - Eb - Bb (Cm9)
            [103.83, 155.56, 207.65, 261.63, 415.30], // Ab - Eb - Ab - C - G (Abmaj7)
            [116.54, 174.61, 233.08, 349.23, 466.16]  // Bb - F - Bb - F - C (Bb9sus4)
        ];

        // Notas para el arpegio cristalino celestial
        this.melodyNotes = [
            587.33, 622.25, 783.99, 932.33, 1046.50, 1174.66, 1244.51, 1567.98
        ];
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();

            // Ganancia maestra
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

            // Filtro compresor suave para evitar distorsiones
            this.compressor = this.ctx.createDynamicsCompressor();
            this.compressor.threshold.setValueAtTime(-24, this.ctx.currentTime);
            this.compressor.knee.setValueAtTime(30, this.ctx.currentTime);
            this.compressor.ratio.setValueAtTime(12, this.ctx.currentTime);
            this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
            this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

            // Reverb simulado mediante delay suave y retroalimentación
            this.reverbDelay = this.ctx.createDelay();
            this.reverbDelay.delayTime.setValueAtTime(0.38, this.ctx.currentTime);

            this.reverbFeedback = this.ctx.createGain();
            this.reverbFeedback.gain.setValueAtTime(0.42, this.ctx.currentTime);

            this.reverbFilter = this.ctx.createBiquadFilter();
            this.reverbFilter.type = 'lowpass';
            this.reverbFilter.frequency.setValueAtTime(2500, this.ctx.currentTime);

            // Conexiones del bus de reverb
            this.reverbDelay.connect(this.reverbFilter);
            this.reverbFilter.connect(this.reverbFeedback);
            this.reverbFeedback.connect(this.reverbDelay);
            this.reverbFilter.connect(this.masterGain);

            this.masterGain.connect(this.compressor);
            this.compressor.connect(this.ctx.destination);

            // Viento cósmico sutil en segundo plano
            this.startCosmicWind();
        }

        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    startCosmicWind() {
        if (!this.ctx) return;
        try {
            const bufferSize = this.ctx.sampleRate * 2;
            const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

            // Generador de ruido rosa suave (pink noise)
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
                b6 = white * 0.115926;
            }

            const whiteNoise = this.ctx.createBufferSource();
            whiteNoise.buffer = noiseBuffer;
            whiteNoise.loop = true;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(380, this.ctx.currentTime);
            filter.Q.setValueAtTime(2.0, this.ctx.currentTime);

            // Modulación de frecuencia lenta para el viento cósmico
            const lfo = this.ctx.createOscillator();
            lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime);
            const lfoGain = this.ctx.createGain();
            lfoGain.gain.setValueAtTime(150, this.ctx.currentTime);
            lfo.connect(lfoGain);
            lfoGain.connect(filter.frequency);
            lfo.start();

            const windGain = this.ctx.createGain();
            windGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

            whiteNoise.connect(filter);
            filter.connect(windGain);
            windGain.connect(this.masterGain);
            whiteNoise.start();
        } catch (e) {
            console.warn("Cosmic wind init notice:", e);
        }
    }

    playChord(frequencies, duration = 6.0) {
        if (!this.ctx || !this.isPlaying) return;

        const now = this.ctx.currentTime;

        frequencies.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            // Mezcla de ondas senoidales y triangulares cálidas
            osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
            // Microdesafinación para sonido celestial enriquecido
            osc.frequency.setValueAtTime(freq * (1 + (Math.random() - 0.5) * 0.003), now);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(600 + idx * 250, now);
            filter.frequency.exponentialRampToValueAtTime(350, now + duration);

            // Ataque suave, sostenido y decaimiento romántico
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.linearRampToValueAtTime(0.07 / frequencies.length, now + 1.8);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGain);
            gain.connect(this.reverbDelay);

            osc.start(now);
            osc.stop(now + duration + 0.1);
        });

        // Tocar suave arpegio de campana cósmica / cajita musical
        this.playArpeggios(now, duration);

        // Suave latido de corazón
        this.playHeartbeat(now + 1.0);
    }

    playArpeggios(startTime, totalDuration) {
        if (!this.ctx || !this.isPlaying) return;

        const noteCount = 4 + Math.floor(Math.random() * 4);
        for (let i = 0; i < noteCount; i++) {
            const noteTime = startTime + 0.6 + i * (0.45 + Math.random() * 0.3);
            if (noteTime > startTime + totalDuration - 1.2) break;

            const randomFreq = this.melodyNotes[Math.floor(Math.random() * this.melodyNotes.length)];
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(randomFreq, noteTime);

            gain.gain.setValueAtTime(0.0001, noteTime);
            gain.gain.linearRampToValueAtTime(0.035, noteTime + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 2.2);

            osc.connect(gain);
            gain.connect(this.masterGain);
            gain.connect(this.reverbDelay);

            osc.start(noteTime);
            osc.stop(noteTime + 2.3);
        }
    }

    playHeartbeat(time) {
        if (!this.ctx || !this.isPlaying) return;

        // Dos golpes característicos del latido cardíaco (lub-dub)
        [0, 0.28].forEach((offset, i) => {
            const t = time + offset;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(i === 0 ? 65 : 55, t);
            osc.frequency.exponentialRampToValueAtTime(35, t + 0.18);

            gain.gain.setValueAtTime(0.001, t);
            gain.gain.linearRampToValueAtTime(0.06, t + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(t);
            osc.stop(t + 0.26);
        });
    }

    playSparkleEffect() {
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            [1046.5, 1318.5, 1567.98, 2093.0].forEach((freq, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const t = now + i * 0.08;

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, t);

                gain.gain.setValueAtTime(0.0001, t);
                gain.gain.linearRampToValueAtTime(0.04, t + 0.03);
                gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);

                osc.connect(gain);
                gain.connect(this.masterGain);
                gain.connect(this.reverbDelay);

                osc.start(t);
                osc.stop(t + 0.95);
            });
        } catch (e) {
            console.warn("Sparkle audio error:", e);
        }
    }

    start() {
        this.init();
        this.isPlaying = true;

        if (this.useCustomAudio && this.customAudio) {
            this.customAudio.play().catch(e => console.log("Custom audio play error:", e));
            return;
        }

        const chordDuration = 5.2; // Segundos por acorde

        const tick = () => {
            if (!this.isPlaying) return;
            const chord = this.chords[this.currentChordIndex];
            this.playChord(chord, chordDuration);
            this.currentChordIndex = (this.currentChordIndex + 1) % this.chords.length;
            this.timer = setTimeout(tick, (chordDuration - 0.4) * 1000);
        };

        tick();
    }

    stop() {
        this.isPlaying = false;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        if (this.customAudio) {
            this.customAudio.pause();
        }
    }

    toggle() {
        if (this.isPlaying) {
            this.stop();
            return false;
        } else {
            this.start();
            return true;
        }
    }

    setVolume(val) {
        this.volume = Math.max(0, Math.min(1, val));
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        }
        if (this.customAudio) {
            this.customAudio.volume = this.volume;
        }
    }

    loadCustomAudioFile(file) {
        if (this.customAudio) {
            this.customAudio.pause();
        }
        const url = URL.createObjectURL(file);
        this.customAudio = new Audio(url);
        this.customAudio.loop = true;
        this.customAudio.volume = this.volume;
        this.useCustomAudio = true;

        if (this.isPlaying) {
            this.customAudio.play();
        }
    }
}

window.romanticAudio = new RomanticAudioEngine();
