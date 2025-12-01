/**
 * GitHub Projects Loader - Optimized
 * Carga y renderiza proyectos desde la API de GitHub
 */
// ========================================
//              CONFIGURACIÓN
// ========================================
const dotenv = require('dotenv');
dotenv.config();
const CONFIG = {
  username: 'lukitaz-r',
  apiUrl: 'https://api.github.com/users/lukitaz-r/repos',
  maxLanguageTags: 4,
  maxTopicTags: 4,
  sortBy: 'updated',
  perPage: 100,
  // Token de GitHub (OPCIONAL) - Aumenta el límite de peticiones a la API
  // Para obtener un token: GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic)
  // NO requiere permisos especiales, solo para peticiones públicas
  githubToken: process.env.GITHUB_TOKEN || '', // Dejar vacío si no deseas usar autenticación
};

// Tecnologías válidas basadas en la sección "Tecnologías" del portfolio
// Los topics de GitHub que coincidan con estas se mostrarán en las tarjetas
const VALID_TECHNOLOGIES = [
  'javascript',
  'typescript',
  'vitejs',
  'node.js',
  'nodejs',
  'react',
  'reactjs',
  'react.js',
  'next.js',
  'nextjs',
  'mongodb',
  'mongo',
  'discord.js',
  'discordjs',
  'html',
  'html5',
  'css',
  'css3',
  'python'
].map(tech => tech.toLowerCase());

// ========================================
// MAPEOS DE DATOS
// ========================================
const languageClassMap = {
  'JavaScript': 'js',
  'TypeScript': 'ts',
  'Vite.js': 'vite',
  'Node.js': 'node',
  'React': 'react',
  'Next.js': 'next',
  'MongoDB': 'mongo',
  'HTML': 'html',
  'CSS': 'css',
  'Python': 'py',
  'Discord.js': 'discord',
  'Java': 'java',
  'C++': 'cpp',
  'C#': 'csharp',
  'PHP': 'php',
  'Ruby': 'ruby',
  'Go': 'go',
  'Rust': 'rust'
};

// Mapeo de lenguajes a iconos de Ionicons
const languageIconsMap = {
  'JavaScript': 'devicon-javascript-plain',
  'TypeScript': 'devicon-typescript-plain', 
  'Python': 'devicon-python-plain',
  'HTML': 'devicon-html5-plain',
  'CSS': 'devicon-css3-plain',
  'Java': 'devicon-java-plain',
  'React': 'devicon-react-plain',
  'Discord.js': 'devicon-discordjs-plain',
  'MongoDB': 'devicon-mongodb-plain',
  'Vite.js': 'devicon-vitejs-plain',
  'Vue': 'devicon-vuejs-plain',
  'Angular': 'devicon-angularjs-plain',
  'Node.js': 'devicon-nodejs-plain',
  'PHP': 'devicon-php-plain',
  'Ruby': 'devicon-ruby-plain',
  'Swift': 'devicon-swift-plain',
  'C': 'devicon-c-plain',
  'C++': 'devicon-cplusplus-plain',
  'C#': 'devicon-csharp-plain',
  'Go': 'devicon-go-plain',
  'Rust': 'devicon-rust-plain',
  'Kotlin': 'devicon-kotlin-plain',
  'Dart': 'devicon-dart-plain',
  'Shell': 'terminal-plain',
  'PowerShell': 'terminal-plain',
  'Dockerfile': 'cube-plain',
  'default': 'code-plain'
};

const languageIcons = {
  'JavaScript': 'https://cdn-icons-png.flaticon.com/512/5968/5968292.png',
  'TypeScript': 'https://cdn-icons-png.flaticon.com/512/5968/5968381.png',
  'Python': 'https://cdn-icons-png.flaticon.com/512/5968/5968350.png',
  'HTML': 'https://cdn-icons-png.flaticon.com/512/5968/5968267.png',
  'CSS': 'https://cdn-icons-png.flaticon.com/512/5968/5968242.png',
  'Java': 'https://cdn-icons-png.flaticon.com/512/5968/5968282.png',
  'C++': 'https://cdn-icons-png.flaticon.com/512/6132/6132222.png',
  'C#': 'https://cdn-icons-png.flaticon.com/512/6132/6132221.png',
  'PHP': 'https://cdn-icons-png.flaticon.com/512/5968/5968332.png',
  'Ruby': 'https://cdn-icons-png.flaticon.com/512/5968/5968350.png',
  'Go': 'https://cdn-icons-png.flaticon.com/512/919/919833.png',
  'Rust': 'https://cdn-icons-png.flaticon.com/512/5968/5968520.png',
  'default': 'https://cdn-icons-png.flaticon.com/512/25/25231.png'
};

// ========================================
// FUNCIONES DE API
// ========================================

/**
 * Crea los headers para las peticiones a la API de GitHub
 * @returns {Object} Headers de la petición
 */
function getGitHubHeaders() {
  const headers = {
    'Accept': 'application/vnd.github.v3+json'
  };
  
  // Agregar token de autenticación si está configurado
  if (CONFIG.githubToken && CONFIG.githubToken.trim() !== '') {
    headers['Authorization'] = `token ${CONFIG.githubToken}`;
  }
  
  return headers;
}

/**
 * Obtiene los repositorios desde la API de GitHub
 * @returns {Promise<Array>} Array de repositorios
 */
async function fetchGitHubRepos() {
  try {
    const url = `${CONFIG.apiUrl}?sort=${CONFIG.sortBy}&per_page=${CONFIG.perPage}`;
    const response = await fetch(url, {
      headers: getGitHubHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const repos = await response.json();
    
    // Filtrar repos archivados y forks
    return repos.filter(repo => !repo.fork && !repo.archived);
  } catch (error) {
    console.error('Error al obtener repositorios:', error);
    throw error;
  }
}

/**
 * Obtiene los lenguajes de un repositorio
 * @param {string} languagesUrl - URL de la API de lenguajes
 * @returns {Promise<Object>} Objeto con lenguajes y sus bytes
 */
async function fetchRepoLanguages(languagesUrl) {
  try {
    const response = await fetch(languagesUrl, {
      headers: getGitHubHeaders()
    });
    if (!response.ok) return {};
    
    return await response.json();
  } catch (error) {
    console.error('Error al obtener lenguajes:', error);
    return {};
  }
}

/**
 * Obtiene lenguajes para múltiples repositorios en paralelo
 * @param {Array} repos - Array de repositorios
 * @returns {Promise<Array>} Array de objetos con repo y sus lenguajes
 */
async function fetchAllLanguages(repos) {
  const promises = repos.map(async (repo) => {
    const languages = await fetchRepoLanguages(repo.languages_url);
    return { repo, languages };
  });
  
  return Promise.all(promises);
}

/**
 * Filtra los topics de un repositorio para mostrar solo tecnologías válidas
 * @param {Array} topics - Array de topics del repositorio
 * @returns {Array} Topics filtrados y normalizados
 */
function filterValidTopics(topics) {
  if (!topics || !Array.isArray(topics) || topics.length === 0) {
    return [];
  }
  
  // Normalizar topics: convertir a minúsculas y filtrar por tecnologías válidas
  const validTopics = topics
    .map(topic => topic.toLowerCase())
    .filter(topic => VALID_TECHNOLOGIES.includes(topic));
  
  // Normalizar nombres para mostrar (capitalización correcta)
  const topicMap = {
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'node.js': 'Node.js',
    'nodejs': 'Node.js',
    'react': 'React',
    'reactjs': 'React',
    'react.js': 'React',
    'next.js': 'Next.js',
    'nextjs': 'Next.js',
    'mongodb': 'MongoDB',
    'mongo': 'MongoDB',
    'discord.js': 'Discord.js',
    'discordjs': 'Discord.js',
    'html': 'HTML',
    'html5': 'HTML',
    'css': 'CSS',
    'css3': 'CSS',
    'python': 'Python',
    'vitejs': 'Vite.js'
  };
  
  // Eliminar duplicados (ej: nodejs y node.js se convierten en Node.js)
  const normalizedTopics = [...new Set(validTopics.map(topic => topicMap[topic] || topic))];
  
  return normalizedTopics.slice(0, CONFIG.maxTopicTags);
}

// ========================================
//        FUNCIONES DE RENDERIZADO
// ========================================

/**
 * Crea el HTML para los tags de lenguajes con iconos de Ionicons
 * @param {Object} languages - Objeto de lenguajes
 * @returns {string} HTML de los tags
 */
function createLanguageTags(languages) {
  return Object.keys(languages)
    .slice(0, CONFIG.maxLanguageTags)
    .map(lang => {
      const cssClass = languageClassMap[lang] || '';
      const iconName = languageIconsMap[lang] || languageIconsMap['default'];
      
      return `<span class="tag ${cssClass}">
        <i class="${iconName}"></i>
        ${escapeHtml(lang)}
      </span>`;
    })
    .join('');
}

/**
 * Crea el HTML para los tags de topics (tecnologías del repositorio)
 * @param {Array} topics - Array de topics filtrados
 * @returns {string} HTML de los tags de topics
 */
function createTopicTags(topics) {
  if (!topics || topics.length === 0) {
    return '';
  }
  
  return topics
    .map(topic => {
      const cssClass = languageClassMap[topic] || '';
      const iconName = languageIconsMap[topic] || languageIconsMap['default'];
      
      return `<span class="tag ${cssClass}">
        <i class="${iconName}"></i>
        ${escapeHtml(topic)}
      </span>`;
    })
    .join('');
}

/**
 * Crea el HTML para las estadísticas del repo
 * @param {Object} repo - Objeto del repositorio
 * @returns {string} HTML de las estadísticas
 */
function createRepoStats(repo) {
  const stats = [];
  
  if (repo.stargazers_count > 0) {
    stats.push(`⭐ ${repo.stargazers_count}`);
  }
  
  if (repo.forks_count > 0) {
    stats.push(`🔀 ${repo.forks_count}`);
  }
  
  return stats.length > 0 
    ? `<br><br><small style="color: var(--blanco); font-size: 1rem">${stats.join(' • ')}</small>` 
    : '';
}

/**
 * Escapa HTML para prevenir XSS
 * @param {string} text - Texto a escapar
 * @returns {string} Texto escapado
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Crea una tarjeta HTML para un proyecto
 * @param {Object} repo - Repositorio de GitHub
 * @param {Object} languages - Lenguajes del repositorio
 * @param {Array} filteredTopics - Topics filtrados del repositorio
 * @returns {HTMLElement} Elemento de la tarjeta
 */
function createProjectCard(repo, languages, filteredTopics = []) {
  const card = document.createElement('div');
  card.className = 'card';
  
  const icon = languageIcons[repo.language] || languageIcons['default'];
  const description = escapeHtml(repo.description || 'Proyecto de desarrollo personal');
  const languageTags = createLanguageTags(languages);
  const topicTags = createTopicTags(filteredTopics);
  const stats = createRepoStats(repo);
  
  // Combinar lenguajes y topics, priorizando topics si existen
  const allTags = topicTags || languageTags;
  
  card.innerHTML = `
    <img src="${icon}" alt="Icono de ${escapeHtml(repo.name)}" loading="lazy" width="80" height="80">
    <h2>${escapeHtml(repo.name)}</h2>
    <p>
      ${description}
      ${stats}
      <br><br>
      <a href="${escapeHtml(repo.html_url)}" 
         target="_blank" 
         rel="noopener noreferrer"
         aria-label="Ver ${escapeHtml(repo.name)} en GitHub">
        Ver en GitHub
      </a>
    </p>
    ${allTags ? `<div class="tags">${allTags}</div>` : ''}
  `;
  
  return card;
}

/**
 * Muestra un mensaje de error en el contenedor
 * @param {HTMLElement} container - Contenedor de proyectos
 * @param {string} message - Mensaje de error
 */
function showError(container, message) {
  container.innerHTML = `
    <p class="loading-message" style="color: var(--morado-acento);">
      ⚠️ ${escapeHtml(message)}
    </p>
  `;
}

/**
 * Renderiza todos los proyectos en el contenedor
 */
async function renderProjects() {
  const container = document.querySelector('.card-container');
  
  if (!container) {
    console.error('No se encontró el contenedor de proyectos');
    return;
  }
  
  try {
    // Obtener repositorios
    const repos = await fetchGitHubRepos();
    
    if (repos.length === 0) {
      showError(container, 'No se encontraron proyectos públicos.');
      return;
    }
    
    // Obtener lenguajes en paralelo (OPTIMIZACIÓN)
    const reposWithLanguages = await fetchAllLanguages(repos);
    
    // Limpiar contenedor
    container.innerHTML = '';
    container.setAttribute('aria-busy', 'false');
    
    // Crear y agregar tarjetas
    const fragment = document.createDocumentFragment();
    reposWithLanguages.forEach(({ repo, languages }) => {
      // Filtrar topics válidos del repositorio
      const filteredTopics = filterValidTopics(repo.topics || []);
      
      // Crear tarjeta con lenguajes y topics
      const card = createProjectCard(repo, languages, filteredTopics);
      fragment.appendChild(card);
    });
    
    container.appendChild(fragment);
    
  } catch (error) {
    console.error('Error al renderizar proyectos:', error);
    showError(container, 'Error al cargar los proyectos. Por favor, intenta más tarde.');
  }
}

// ========================================
// INICIALIZACIÓN
// ========================================

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderProjects);
} else {
  renderProjects();
}
