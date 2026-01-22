# Portfolio de Desarrollador Full Stack

Este es un portfolio web moderno y minimalista construido con **Vanilla JavaScript**, **Tailwind CSS** y **Vite**. Diseñado para ser ligero, rápido y fácil de personalizar.

El sitio obtiene dinámicamente la información de tus repositorios de GitHub, permitiendo que tu portfolio esté siempre actualizado con tu último trabajo.

## 🚀 Características

*   **Carga Dinámica:** Obtiene proyectos, perfil y tecnologías directamente desde la API de GitHub.
*   **Tema Oscuro:** Diseño elegante y profesional con un esquema de colores oscuros.
*   **Animaciones:** Efectos suaves de escritura (typewriter), palabras flotantes y transiciones.
*   **Responsive:** Totalmente adaptado a dispositivos móviles y de escritorio.
*   **Sin Frameworks Pesados:** Construido con JavaScript puro para máximo rendimiento.
*   **Integración con Multimedia:** Soporte para miniaturas y videos de proyectos (alojados en los propios repositorios).

## 🛠️ Tecnologías

*   **Core:** HTML5, CSS3, JavaScript (ES6+)
*   **Estilos:** Tailwind CSS (vía CDN para desarrollo rápido, adaptable para producción)
*   **Empaquetado:** Vite.js
*   **Iconos:** FontAwesome
*   **API:** GitHub REST API

## 📋 Requisitos Previos

*   Node.js (versión 14 o superior)
*   npm (normalmente viene con Node.js)

## 🔧 Instalación y Uso

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/lukitaz-r/lukitaz-r.github.io.git
    cd tu-repo
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Iniciar servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    Esto abrirá el proyecto en `http://localhost:5173`.

4.  **Construir para producción:**
    ```bash
    npm run build
    ```
    Los archivos generados estarán en la carpeta `dist/`.

## ⚙️ Configuración

El archivo principal de configuración es `src/config.js`. Aquí puedes personalizar:

*   **GITHUB_USERNAME:** Tu nombre de usuario de GitHub (para obtener repos).
*   **BACKGROUND_WORDS:** Palabras que flotan en el fondo del hero.
*   **TYPEWRITER_PHRASES:** Frases para el efecto de escritura.
*   **CERTIFICATES:** Lista de tus certificados.

### Estructura de Repositorios para el Portfolio

Para que tus proyectos luzcan mejor, el sistema busca una carpeta `.portfolio` en la rama por defecto de cada repositorio con los siguientes archivos (opcionales):

*   `.portfolio/thumbnail.png` (Imagen de portada)
*   `.portfolio/video.mp4` (Video de demostración)
*   `.portfolio/year` (Archivo de texto con el año, ej: "2024")

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Siéntete libre de usarlo y modificarlo para tu propio portfolio.
