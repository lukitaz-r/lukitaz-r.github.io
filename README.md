# Portfolio Personal - Lukitaz

Portfolio personal con integración dinámica de proyectos desde GitHub.

## 🚀 Características

- **Integración con GitHub API**: Los proyectos se cargan automáticamente desde tu cuenta de GitHub
- **Actualización automática**: No necesitas editar el HTML manualmente cuando publicas nuevos proyectos
- **Diseño moderno**: Interfaz con gradientes, animaciones y efectos hover
- **Responsive**: Se adapta a diferentes tamaños de pantalla

## 📋 Configuración

### Cambiar el usuario de GitHub

Edita el archivo `js/github-projects.js` y cambia la constante `GITHUB_USERNAME`:

```javascript
const GITHUB_USERNAME = 'tu-usuario-github'; // Cambia esto por tu username
```

### Personalizar lenguajes y colores

En el mismo archivo puedes personalizar:

1. **Mapeo de lenguajes a clases CSS** (`languageClassMap`)
2. **Iconos por lenguaje** (`languageIcons`)

## 🎨 Personalización de estilos

Los estilos están en `css/index.css`. Puedes modificar:

- Variables de color en `:root`
- Efectos hover de los tags de tecnologías
- Animaciones y transiciones

## 📁 Estructura del proyecto

```
lukitaz-r.github.io/
├── index.html          # Página principal
├── css/
│   └── index.css      # Estilos
├── js/
│   └── github-projects.js  # Lógica de integración con GitHub API
│   └── scroll-effects.js  # Efectos de scroll
└── README.md          # Este archivo
```

## 🔧 Cómo funciona

1. Al cargar la página, `github-projects.js` hace una petición a la API de GitHub
2. Obtiene todos tus repositorios públicos (excluyendo forks y archivados)
3. Para cada repositorio, obtiene los lenguajes utilizados
4. Genera dinámicamente las tarjetas de proyecto con:
   - Nombre del repositorio
   - Descripción
   - Lenguajes utilizados
   - Número de estrellas y forks
   - Enlace al repositorio

## 🌐 Despliegue

Este sitio está diseñado para GitHub Pages. Para desplegarlo:

1. Sube los archivos a un repositorio llamado `tu-usuario.github.io`
2. Habilita GitHub Pages en la configuración del repositorio
3. Tu sitio estará disponible en `https://tu-usuario.github.io`

## 📝 Notas

- La API de GitHub tiene un límite de 60 peticiones por hora para usuarios no autenticados
- Los repositorios se ordenan por fecha de actualización (más recientes primero)
- Se filtran automáticamente los forks y repositorios archivados
