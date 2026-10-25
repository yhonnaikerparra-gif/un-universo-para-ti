/**
 * CONFIGURACIÓN DEL UNIVERSO ROMÁNTICO 3D
 * Puedes modificar libremente este archivo para personalizar nombres,
 * frases, colores, velocidades y música para esa persona especial.
 */

window.ROMANTIC_CONFIG = {
    // === DEDICATORIA PERSONAL ===
    recipient: "Mi Amor Eterno", // Nombre o apodo de tu pareja (ej: "Sofía", "Mi Princesa", etc.)
    sender: "Tuyo por Siempre",  // Tu nombre o firma
    letterTitle: "Para la dueña de mi universo",
    letterText: [
        "En la inmensidad de este espacio infinito, donde las estrellas nacen y mueren a lo largo de millones de años, mi corazón encontró su único y verdadero centro en ti.",
        "Cada palabra que ves orbitando en este universo representa un suspiro, un instante compartido y la certeza de que no existe rincón en la galaxia donde no elija estar a tu lado.",
        "Eres mi sol en las mañanas oscuras, mi estrella guía en la noche y el motivo por el cual la palabra 'amor' cobra todo su sentido. Gracias por hacer que mi vida se sienta mágica cada día.",
        "Te amo infinitamente, más allá del tiempo, la distancia y las estrellas."
    ],

    // === PLANETA CENTRAL ===
    planet: {
        radius: 13.5,                 // Tamaño del planeta esférico
        rotationSpeed: 0.0035,        // Velocidad de giro sobre su eje
        coreColor: '#0a0316',         // Color base del planeta (oscuro y profundo)
        rimColor: '#ff2d8d',          // Color del resplandor en los bordes (Fresnel rosa neón)
        atmosphereColor: '#a82cff',   // Color del halo atmosférico (violeta luminoso)
        specularColor: '#ff80bf',     // Reflejo especular
        glowIntensity: 1.5,           // Intensidad del resplandor
        atmosphereScale: 1.18         // Tamaño relativo de la atmósfera
    },

    // === ANILLOS Y ÓRBITAS ===
    rings: {
        speedMultiplier: 1.0,         // Multiplicador general de velocidad de los anillos
        items: [
            {
                name: "Anillo Principal",
                innerRadius: 18.0,
                outerRadius: 28.5,
                tiltX: 0.45,
                tiltZ: -0.25,
                rotSpeed: 0.004,
                color1: '#ff2a8d',    // Rosa neón
                color2: '#c850c0',    // Violeta degradado
                opacity: 0.85
            },
            {
                name: "Anillo Luminoso Fino",
                innerRadius: 29.5,
                outerRadius: 30.6,
                tiltX: 0.42,
                tiltZ: -0.22,
                rotSpeed: 0.005,
                color1: '#ff66b2',    // Rosa neón elegante
                color2: '#ff99cc',
                opacity: 0.75
            },
            {
                name: "Órbita Inclinada Violeta",
                innerRadius: 22.0,
                outerRadius: 23.5,
                tiltX: -0.65,
                tiltZ: 0.55,
                rotSpeed: -0.004,
                color1: '#9b30ff',    // Violeta eléctrico en contragiro
                color2: '#e066ff',
                opacity: 0.7
            },
            {
                name: "Órbita Cruzada Rosa",
                innerRadius: 33.0,
                outerRadius: 34.2,
                tiltX: 0.85,
                tiltZ: 0.35,
                rotSpeed: 0.003,
                color1: '#ff1493',
                color2: '#ff69b4',
                opacity: 0.65
            },
            {
                name: "Cinturón de Polvo Estelar",
                radius: 26.0,
                spread: 3.0,
                tiltX: 0.45,
                tiltZ: -0.25,
                particleCount: 1000,
                rotSpeed: 0.004,
                color: '#ffcce6',
                size: 0.95
            }
        ]
    },

    // === ESTRELLAS Y FONDO ===
    stars: {
        count: 3200,                  // Cantidad de estrellas en el espacio
        sizeMin: 0.8,
        sizeMax: 2.5,
        twinkleSpeed: 1.8,            // Velocidad de parpadeo
        spreadRadius: 450,            // Rango de distribución en el universo
        nebulaParticles: 600,         // Nubes de polvo cósmico / nebulosa
        nebulaColors: ['#380036', '#0cbaba', '#ff007f', '#260033'],
        shootingStarsEnabled: true,   // Estrellas fugaces periódicas
        shootingStarFrequency: 3000   // Frecuencia en ms
    },

    // === CORAZONES Y PARTÍCULAS ROMÁNTICAS ===
    particles: {
        heartsCount: 80,              // Cantidad de corazones 3D flotantes
        heartSize: 3.2,
        floatSpeed: 0.35,
        pulseSpeed: 2.0,
        cosmicDustCount: 500,         // Chispas de amor que flotan suavemente
        dustSize: 1.5,
        interactiveMouseBurst: true   // Generar corazones al mover/cliquear el cursor
    },

    // === FRASES ROMÁNTICAS FLOTANTES ===
    phrases: {
        spawnCount: 160,              // Cantidad de frases visibles en 3D
        minRadius: 32,                // Distancia mínima al planeta
        maxRadius: 180,               // Distancia máxima
        heightRange: 130,             // Variación vertical (eje Y)
        swaySpeed: 0.002,             // Velocidad del bamboleo orgánico
        colors: [
            '#ffffff',                // Blanco celestial
            '#ffb6c1',                // Rosa claro suave
            '#ff69b4',                // Rosa brillante
            '#ff1493',                // Magenta profundo
            '#e6b8ff',                // Lavanda
            '#ffe4e1'                 // Nácar romántico
        ],
        // Cientos de palabras y frases amorosas
        list: [
            "Te amo ❤️",
            "Mi vida ✨",
            "Mi cielo 🌌",
            "Mi estrella 💫",
            "Mi todo 💖",
            "Mi destino 🌙",
            "Alma mía 💕",
            "Mi tesoro 💎",
            "Eres mi luz 🌟",
            "Mi reina 👑",
            "Mi universo 🪐",
            "Para siempre ♾️",
            "Eres especial ✨",
            "Mi felicidad 😊",
            "Mi amor eterno 🌹",
            "Tú y yo 💖",
            "Siempre juntos 💫",
            "Eres mi hogar 🏡",
            "Mi mundo entero 🌍",
            "Latido de mi corazón 💓",
            "Bajo el mismo cielo 🌌",
            "Contigo todo es magia ✨",
            "Amor de mi vida ❤️",
            "Mi sueño hecho realidad 💫",
            "Mi razón de ser 🌸",
            "Eres perfecta 🌹",
            "Eres mi paz 🕊️",
            "Te elijo cada día 💍",
            "Cada segundo a tu lado ⏳",
            "Mi persona favorita ⭐",
            "Te amo infinitamente ♾️",
            "Amor infinito 💫",
            "Luz de mis ojos 👀",
            "Eres mi melodía 🎵",
            "Mi pensamiento constante 💭",
            "Haces mi mundo brillar ✨",
            "En cada latido 💗",
            "Desde el fondo de mi alma 🌹",
            "Mi casualidad favorita 🍀",
            "Universo de dos 🌌",
            "Mi infinito 💖",
            "Gracias por existir 🙏",
            "Tu sonrisa es mi sol ☀️",
            "Mi dulce amor 🍯",
            "Te amo más que ayer 📈",
            "Abrazo eterno 🫂",
            "Mi lugar seguro 🛡️",
            "Juntos por siempre ♾️",
            "Eres mi bendición ✨",
            "Contigo hasta el fin 🚀",
            "Eres pura magia 🪄",
            "Por un millón de vidas más ⏳",
            "Mi mayor tesoro 💎",
            "Nunca me cansaré de ti ❤️",
            "Me encantas 😍",
            "Mi niña hermosa 🌸",
            "Mi corazón es tuyo 💘",
            "Un amor sin final 💫",
            "Te adoro 💖",
            "Siempre a tu lado 🤝",
            "Eres mi constelación 🌌",
            "Iluminas mi oscuridad 💡",
            "Pedacito de cielo ☁️",
            "Mi mitad perfecta 🧩",
            "Eres increíble ⭐",
            "Quiero cuidarte siempre 🤍",
            "Eres arte 🎨",
            "Amor verdadero 💝",
            "En ti encontré todo 🗝️",
            "Tú eres mi hogar 🏠",
            "Mi ángel 🪽",
            "Te amo hoy y siempre 🌹",
            "Mi estrella polar 🧭",
            "Nuestras almas unidas 💫",
            "Mi refugio 🏰",
            "Dueña de mi corazón 👑",
            "Qué dicha coincidir contigo ✨",
            "Mi galaxia favorita 🪐",
            "Tu amor me da alas 🦋",
            "Te amo con locura 🔥",
            "Solo tú y nadie más 🔒",
            "Mi mejor capítulo 📖",
            "Eres mi milagro ✨",
            "Tú me completas 🧩",
            "Mi poesía favorita 📜",
            "Un amor para la historia 🏛️",
            "Bailar bajo las estrellas 🌠",
            "Tu mirada me hipnotiza ✨",
            "Eres mi canción favorita 🎶",
            "El amor de todas mis vidas ♾️",
            "Juntos contra el mundo 🛡️",
            "Eres mi mayor regalo 🎁",
            "Mi corazón late por ti 💓",
            "Quédate conmigo siempre 🌙",
            "Nunca dejes de sonreír ✨",
            "Eres el amor que siempre soñé 💭",
            "Eternamente enamorado 💕",
            "Mi cielo estrellado 🌌",
            "La luz de mi destino 🌟",
            "Tú eres mi principio y mi fin ♾️"
        ]
    },

    // === POST-PROCESAMIENTO Y EFECTOS VISUALES ===
    bloom: {
        enabled: true,
        strength: 1.0,                // Intensidad equilibrada del resplandor neón
        radius: 0.65,                 // Radio de dispersión de la luz
        threshold: 0.38               // Umbral de luminosidad para brillar (mantiene el planeta oscuro)
    },

    // === MOTOR DE AUDIO ROMÁNTICO ===
    audio: {
        enabled: false,               // Desactivado inicialmente (espera interacción del usuario)
        volume: 0.5,                  // Volumen (0 a 1)
        tempoBpm: 52                  // Tempo relajante de los acordes celestiales
    }
};
