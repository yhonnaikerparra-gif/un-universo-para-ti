# ✨ Un Universo para Ti - 3D Interactivo ✨

Una experiencia web tridimensional, inmersiva y romántica inspirada en los universos espaciales del amor. Diseñada con **HTML5, CSS3 Glassmorphism, JavaScript moderno y Three.js**, con renderizado cinematográfico, postprocesamiento con efecto Bloom (resplandor de neón), física de partículas, síntesis de audio ambiental y cientos de frases románticas flotando en profundidad espacial.

---

## 🌟 Características Principales

### 1. Planeta Central Místico
- Esfera de **obsidiana brillante** con shader de superficie cósmica procedimental.
- **Shader de Fresnel (Rim Lighting)**: bordes incandescentes con brillo rosa neón y reflejos especulares.
- **Atmósfera luminosa pulsante**: halo de gas estelar que reacciona con un sutil latido armónico.
- Giro axial suave y continuo.

### 2. Anillos y Órbitas Tridimensionales
- **Anillo principal tipo disco**: bandas concéntricas translúcidas en degradado rosa neón, violeta y líneas de resplandor blanco con divisiones de Cassini.
- **Órbitas inclinadas en contra-rotación**: trayectorias de neón que giran a diferentes velocidades y ángulos tridimensionales.
- **Cinturón de polvo estelar**: más de 1,000 partículas orbitales brillantes.
- **Cinturón de corazones orbitales**: pequeños corazones que recorren una órbita elíptica inclinada mientras laten en tamaño.

### 3. Cientos de Frases Románticas Flotantes
- Más de **80 frases y palabras de amor** distribuidas orgánicamente en 3D (a diferentes alturas, radios y profundidades).
- **Efecto Parallax y Billboarding**: las frases siempre miran suavemente hacia la cámara y ondean con un movimiento cósmico armónico.
- **Interactividad total**: al pasar el cursor o cliquear una frase, se agranda, emite una ráfaga de corazones y abre una tarjeta de mensaje flotante.

### 4. Estrellas, Polvo Cósmico y Estrellas Fugaces
- **3,200+ estrellas en 3D** con shader personalizado de parpadeo armónico continuo.
- **Nubes de nebulosa** en tonos morados, magenta y cian profundo.
- **Estrellas fugaces periódicas**: cruzan la galaxia diagonalmente a gran velocidad dejando una estela luminosa con desvanecimiento gradual.
- **Polvo cósmico y ráfagas interactivas**: al hacer clic en cualquier lugar del espacio se genera una explosión de corazones flotantes.

### 5. Motor de Sonido Ambiental Romántico (Web Audio API)
- **100% autónomo y offline**: no depende de archivos de audio externos ni sufre bloqueos por CORS.
- Genera en tiempo real acordes celestiales envolventes (`Ebmaj9 - Cm9 - Abmaj7 - Bb9sus4`), arpegios de cajita de música / campanas de cristal, viento estelar suave y un sutil latido cardíaco.
- **Soporte para canción propia**: permite subir un archivo MP3/WAV o ajustar el volumen desde el panel de ajustes.

### 6. Controles e Interfaz Glassmorphism
- **Barra inferior (Dock)**:
  - 🎵 **Música**: Activar / Pausar con ecualizador animado.
  - ⏸️ **Pausar / Reanudar**: Detiene o reanuda el movimiento de todo el universo.
  - 💌 **Carta de Amor**: Abre una carta romántica personalizada con sello de cera.
  - 👁️ **Centrar**: Restablece suavemente la cámara al ángulo inicial.
  - ⚙️ **Ajustes**: Despliega el panel de personalización en vivo.
  - ⛶ **Pantalla Completa**: Modo cine inmersivo.
- **Panel de Personalización en Vivo**:
  - Lanzar frases personalizadas al instante en 3D con un clic.
  - Modificar nombres de la pareja y firma de la dedicatoria.
  - Cambiar paleta de colores en tiempo real (Rosa Neón, Violeta Místico, Fuego Pasión, Cielo Estelar).
  - Sliders para velocidad de rotación, velocidad de anillos, tamaño del planeta y resplandor neón (Bloom).

### 7. Optimización y Diseño Adaptable (Responsive 9:16)
- **Soporte móvil vertical (9:16)**: encuadre automático con ajuste dinámico de campo visual (FOV) y distancia para pantallas de smartphone sin perder elementos.
- **Gestos táctiles**: arrastrar para orbitar y pellizcar para hacer zoom.
- **Optimización de GPU**: pausa inteligente automática cuando la pestaña del navegador está oculta (`visibilitychange`).

---

## 🚀 Cómo Ejecutar el Proyecto

### Opción 1: Apertura Directa en Navegador
Todas las librerías necesarias están incluidas localmente en la carpeta `libs/`. Simplemente haz doble clic en el archivo:
```
index.html
```
o ábrelo con cualquier navegador moderno (Edge, Chrome, Firefox, Brave, Safari).

### Opción 2: Con Servidor Local (Recomendado)
Para la experiencia óptima:

#### Con Python:
```bash
python -m http.server 8080
```
Luego abre tu navegador en: [http://localhost:8080](http://localhost:8080)

#### Con Node.js (npx):
```bash
npx serve .
```

---

## 🎨 Cómo Personalizar las Frases y el Mensaje

### Desde el Archivo de Configuración (`js/config.js`):
Puedes abrir `js/config.js` con cualquier editor de texto para cambiar:
1. **Dedicatoria y Carta**:
   ```javascript
   recipient: "Nombre de tu pareja",
   sender: "Tu nombre",
   letterTitle: "Para la dueña de mi universo",
   letterText: [
       "Párrafo 1 de tu carta...",
       "Párrafo 2..."
   ]
   ```
2. **Frases Flotantes**:
   En `ROMANTIC_CONFIG.phrases.list` puedes añadir o quitar todas las frases, palabras, apodos y emojis que desees.

### Desde la Misma Página Web:
Abre el universo en tu navegador, haz clic en el botón **"⚙️ Ajustes"** y podrás:
- Escribir una frase y presionar **"Lanzar 🚀"** para verla aparecer al instante flotando frente a ti.
- Cambiar el nombre de tu pareja y el tema de colores con vista previa inmediata.

---

## 📁 Estructura del Proyecto

```
universo-romantico-3d/
│
├── index.html            # Estructura principal, UI y enlaces a scripts
├── README.md             # Documentación e instrucciones
├── css/
│   └── style.css         # Glassmorphism, animaciones, tipografías y diseño responsive
├── js/
│   ├── config.js         # Parámetros editables (frases, colores, carta, velocidades)
│   ├── audio.js          # Sintetizador ambiental Web Audio API + reproductor
│   ├── planet.js         # Planeta central con shader Fresnel y atmósfera
│   ├── rings.js          # Anillos translúcidos, órbitas inclinadas y partículas
│   ├── stars.js          # Campo de 3200+ estrellas parpadeantes y estrellas fugaces
│   ├── particles.js      # Corazones 3D flotantes y ráfagas interactivas
│   ├── phrases.js        # Gestor de frases 3D, billboarding y raycasting de clics
│   ├── scene.js          # Three.js Scene, Camera, OrbitControls y UnrealBloomPass
│   ├── ui.js             # Eventos de UI, dock, drawer, modal y clics
│   └── main.js           # Bucle de animación (rAF) y ciclo de vida
└── libs/
    ├── three.min.js      # Three.js r128 UMD
    ├── OrbitControls.js  # Controles de órbita y gestos táctiles
    ├── EffectComposer.js # Pipeline de postprocesamiento
    ├── RenderPass.js     # Render pass inicial
    ├── CopyShader.js     # Shader de copia
    ├── ShaderPass.js     # Shader pass
    ├── LuminosityHighPassShader.js # Filtro de luminancia para Bloom
    └── UnrealBloomPass.js# Resplandor neón Unreal Bloom
```

---

*Desarrollado con amor y tecnología 3D para una experiencia espacial mágica e inolvidable.* ✨🪐❤️
