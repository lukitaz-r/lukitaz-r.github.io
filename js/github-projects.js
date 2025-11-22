/**
 * GitHub Projects Loader - Optimized
 * Carga y renderiza proyectos desde la API de GitHub
 */

// ========================================
// CONFIGURACIÓN
// ========================================
const CONFIG = {
  username: 'lukitaz-r',
  apiUrl: 'https://api.github.com/users/lukitaz-r/repos',
  maxLanguageTags: 4,
  sortBy: 'updated',
  perPage: 100
};

// ========================================
// MAPEOS DE DATOS
// ========================================
const languageClassMap = {
  'JavaScript': 'js',
  'TypeScript': 'js',
  'Node.js': 'node',
  'React': 'react',
  'Next.js': 'next',
  'MongoDB': 'mongo',
  'HTML': 'html',
  'CSS': 'css',
  'Python': 'py',
  'Discord.js': 'disc',
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
  'JavaScript': 'logo-javascript',
  'TypeScript': 'logo-javascript', // TypeScript usa el mismo icono
  'Python': 'logo-python',
  'HTML': 'logo-html5',
  'CSS': 'logo-css3',
  'Java': 'logo-java',
  'React': 'logo-react',
  'Vue': 'logo-vue',
  'Angular': 'logo-angular',
  'Node.js': 'logo-nodejs',
  'PHP': 'logo-php',
  'Ruby': 'logo-ruby',
  'Swift': 'logo-swift',
  'C': 'code-slash-outline',
  'C++': 'code-slash-outline',
  'C#': 'code-slash-outline',
  'Go': 'code-working-outline',
  'Rust': 'code-working-outline',
  'Kotlin': 'code-slash-outline',
  'Dart': 'code-slash-outline',
  'Shell': 'terminal-outline',
  'PowerShell': 'terminal-outline',
  'Dockerfile': 'cube-outline',
  'default': 'code-outline'
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
 * Obtiene los repositorios desde la API de GitHub
 * @returns {Promise<Array>} Array de repositorios
 */
async function fetchGitHubRepos() {
  try {
    const url = `${CONFIG.apiUrl}?sort=${CONFIG.sortBy}&per_page=${CONFIG.perPage}`;
    const response = await fetch(url);
    
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
    const response = await fetch(languagesUrl);
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

// ========================================
// FUNCIONES DE RENDERIZADO
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
        <ion-icon name="${iconName}"></ion-icon>
        ${escapeHtml(lang)}
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
 * @returns {HTMLElement} Elemento de la tarjeta
 */
function createProjectCard(repo, languages) {
  const card = document.createElement('div');
  card.className = 'card';
  
  const icon = languageIcons[repo.language] || languageIcons['default'];
  const description = escapeHtml(repo.description || 'Proyecto de desarrollo personal');
  const languageTags = createLanguageTags(languages);
  const stats = createRepoStats(repo);
  
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
    ${languageTags ? `<div class="tags">${languageTags}</div>` : ''}
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
      const card = createProjectCard(repo, languages);
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
