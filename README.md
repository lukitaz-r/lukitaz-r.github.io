# Portfolio Personal - Lukitaz

Portfolio personal con integración dinámica de proyectos desde GitHub y filtrado inteligente de tecnologías.

## 🚀 Características

- **Integración con GitHub API**: Los proyectos se cargan automáticamente desde tu cuenta de GitHub
- **Filtrado inteligente de topics**: Solo se muestran las tecnologías que dominas
- **Actualización automática**: No necesitas editar el HTML manualmente cuando publicas nuevos proyectos
- **Diseño moderno**: Interfaz con gradientes, animaciones neón y efectos hover
- **Responsive**: Se adapta a diferentes tamaños de pantalla
- **Layout centrado**: Las tarjetas se centran automáticamente en filas incompletas

## 🎯 Sistema de Filtrado de Technologies

El portfolio incluye un sistema que filtra automáticamente los **topics** de tus repositorios de GitHub y solo muestra aquellos que coinciden con las tecnologías que dominas.

### Tecnologías soportadas:
- JavaScript
- TypeScript
- Vite.js
- Node.js
- React
- Next.js
- MongoDB
- Discord.js
- HTML/HTML5
- CSS/CSS3
- Python

Para agregar más tecnologías, edita el array `VALID_TECHNOLOGIES` en `js/github-projects.js`.

## 📋 Configuración

### Cambiar el usuario de GitHub

Edita el archivo `js/github-projects.js` y cambia la constante en `CONFIG`:

```javascript
const CONFIG = {
  username: 'tu-usuario-github', // Cambia esto por tu username
  // ...
};
```

### Configurar token de GitHub (Opcional pero recomendado)

La API de GitHub tiene límites de tasa:
- **Sin autenticación**: 60 peticiones/hora
- **Con token**: 5,000 peticiones/hora

#### ⚠️ IMPORTANTE: Uso del Token

**Para GitHub Pages (sitios estáticos):**
- ❌ **NO** agregues el token directamente en el código
- Los archivos JavaScript son públicos y cualquiera puede ver tu token
- Sin token, el límite de 60 peticiones/hora es suficiente para portfolios personales

**Para usar token de forma segura:**
- ✅ Debes hacer el deploy en una plataforma que soporte **variables de entorno**
- Plataformas recomendadas:
  - [Vercel](https://vercel.com)
  - [Netlify](https://netlify.com)
  - [Railway](https://railway.app)

#### Pasos para usar token en Vercel/Netlify:

1. **Generar token de GitHub:**
   - Ve a GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click en "Generate new token (classic)"
   - Dale un nombre descriptivo (ej: "Portfolio API")
   - **No necesitas seleccionar ningún permiso** (solo para repos públicos)
   - Genera y copia el token

2. **Configurar variable de entorno en la plataforma:**
   - En Vercel/Netlify, ve a tu proyecto → Settings → Environment Variables
   - Agrega: `GITHUB_TOKEN` = `tu_token_aquí`
   - Redeploy tu proyecto

3. **El código ya está preparado:**
   ```javascript
   githubToken: process.env.GITHUB_TOKEN || ''
   ```

### Agregar topics a tus repositorios

Para que aparezcan en tu portfolio:

1. Ve a uno de tus repositorios en GitHub
2. Click en el ícono de engranaje (⚙️) junto a "About"
3. Agrega topics relevantes: `javascript`, `typescript`, `react`, `mongodb`, etc.
4. Los topics que coincidan con las tecnologías soportadas aparecerán automáticamente

## 🎨 Personalización de estilos

Los estilos están en `css/index.css`. Puedes modificar:

### Variables de color en `:root`
```css
:root {
  --negro: #0a0a0a;
  --morado-acento: #6b2d8a;
  /* ... más colores */
}
```

### Efectos hover de tecnologías
Cada tecnología tiene su propio hover effect con colores oficiales:
```css
.js:hover { background-color: #f0db4f; color: #323330; }
.react:hover { background-color: #61dbfb; color: #323330; }
.vite:hover { background: linear-gradient(45deg, #52bcff, #bd34fe); }
/* ... más tecnologías */
```

### Layout de tarjetas
Las tarjetas usan Flexbox para centrarse automáticamente:
```css
.card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
```

## 📁 Estructura del proyecto

```
lukitaz-r.github.io/
├── index.html              # Página principal
├── css/
│   └── index.css          # Estilos con variables CSS y animaciones
├── js/
│   ├── github-projects.js # Lógica de integración con GitHub API
│   └── scroll-effects.js  # Efectos de scroll del header
├── config.json            # Configuración (gitignored)
└── README.md              # Este archivo
```

## 🔧 Cómo funciona

1. **Carga de proyectos:**
   - `github-projects.js` hace peticiones a la API de GitHub
   - Obtiene todos tus repositorios públicos (excluyendo forks y archivados)
   - Para cada repositorio, obtiene los lenguajes y topics

2. **Filtrado inteligente:**
   - Lee los topics de cada repositorio
   - Filtra solo los que coinciden con `VALID_TECHNOLOGIES`
   - Normaliza nombres (ej: `nodejs` → `Node.js`)
   - Elimina duplicados

3. **Generación dinámica de tarjetas:**
   - Nombre del repositorio
   - Descripción
   - Topics filtrados con iconos de Devicon
   - Número de estrellas y forks
   - Enlace al repositorio

4. **Layout responsive:**
   - Máximo 3 tarjetas por fila
   - Las tarjetas sobrantes se centran automáticamente
   - Se adapta a móviles y tablets

## 🌐 Despliegue

### GitHub Pages (Sitio estático - Sin token)

1. Sube los archivos a un repositorio llamado `tu-usuario.github.io`
2. Habilita GitHub Pages en Settings → Pages
3. Tu sitio estará disponible en `https://tu-usuario.github.io`

**Limitaciones:**
- 60 peticiones/hora a la API de GitHub
- No puedes usar token de forma segura

### Vercel/Netlify (Con token y variables de entorno)

#### Vercel:
1. Conecta tu repositorio en [vercel.com](https://vercel.com)
2. Agrega variable de entorno: `GITHUB_TOKEN`
3. Deploy automático con cada push

#### Netlify:
1. Conecta tu repositorio en [netlify.com](https://netlify.com)
2. Agrega variable de entorno: `GITHUB_TOKEN`
3. Deploy automático con cada push

**Ventajas:**
- 5,000 peticiones/hora a la API
- Token seguro en variables de entorno
- Deploy automático
- HTTPS gratis
- Custom domains

## 📝 Notas técnicas

- **API Rate Limiting:**
  - Sin autenticación: 60 peticiones/hora
  - Con token: 5,000 peticiones/hora
  - El código incluye manejo de errores para límites excedidos

- **Optimizaciones:**
  - Las peticiones de lenguajes se hacen en paralelo con `Promise.all()`
  - Los repositorios se ordenan por fecha de actualización
  - Se filtran automáticamente forks y repos archivados

- **Accesibilidad:**
  - Etiquetas ARIA en elementos interactivos
  - Soporte para `prefers-reduced-motion`
  - Semantic HTML

- **Iconos:**
  - Se usan iconos de [Devicons](https://devicon.dev/)
  - CDN: `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css`

## 🛠️ Tecnologías utilizadas

- HTML5
- CSS3 (Custom Properties, Flexbox, Animations)
- JavaScript (ES6+, Fetch API, Async/Await)
- GitHub REST API v3
- Devicon (iconos de tecnologías)
- Google Fonts (Montserrat)

## 📄 Licencia

Este proyecto es de código abierto. Siéntete libre de usarlo como base para tu propio portfolio.

---

**Desarrollado por Luca Ramirez** | [GitHub](https://github.com/lukitaz-r)
