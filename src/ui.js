import { CONFIG } from './config.js';
import { getReadme } from './api.js';

const $ = (selector) => document.querySelector(selector);

export function renderHeader(profile) {
    if (!profile) return;
    
    // Usar nombre/foto de la configuración si se prefiere, sino usar los de GitHub
    $('#profile-image').src = CONFIG.LINKEDIN_PHOTO || profile.avatar_url;
}

const TECH_CONFIG = {
    'javascript': { icon: 'fab fa-js', label: 'JavaScript', color: 'yellow' },
    'js': { icon: 'fab fa-js', label: 'JavaScript', color: 'yellow' },
    'typescript': { icon: 'fab fa-js-square', label: 'TypeScript', color: 'blue' },
    'ts': { icon: 'fab fa-js-square', label: 'TypeScript', color: 'blue' },
    'html': { icon: 'fab fa-html5', label: 'HTML5', color: 'orange' },
    'html5': { icon: 'fab fa-html5', label: 'HTML5', color: 'orange' },
    'css': { icon: 'fab fa-css3-alt', label: 'CSS3', color: 'blue' },
    'css3': { icon: 'fab fa-css3-alt', label: 'CSS3', color: 'blue' },
    'scss': { icon: 'fab fa-sass', label: 'Sass/SCSS', color: 'blue' },
    'sass': { icon: 'fab fa-sass', label: 'Sass/SCSS', color: 'blue' },
    'react': { icon: 'fab fa-react', label: 'React', color: 'blue' },
    'reactjs': { icon: 'fab fa-react', label: 'React', color: 'blue' },
    'vue': { icon: 'fab fa-vuejs', label: 'Vue.js', color: 'green' },
    'vuejs': { icon: 'fab fa-vuejs', label: 'Vue.js', color: 'green' },
    'angular': { icon: 'fab fa-angular', label: 'Angular', color: 'red' },
    'node': { icon: 'fab fa-node-js', label: 'Node.js', color: 'green' },
    'nodejs': { icon: 'fab fa-node-js', label: 'Node.js', color: 'green' },
    'express': { icon: 'fas fa-server', label: 'Express.js', color: 'red' },
    'python': { icon: 'fab fa-python', label: 'Python', color: 'blue' },
    'py': { icon: 'fab fa-python', label: 'Python', color: 'blue' },
    'java': { icon: 'fab fa-java', label: 'Java', color: 'gray' },
    'php': { icon: 'fab fa-php', label: 'PHP', color: 'purple' },
    'laravel': { icon: 'fab fa-laravel', label: 'Laravel', color: 'blue' },
    'docker': { icon: 'fab fa-docker', label: 'Docker', color: 'blue' },
    'kubernetes': { icon: 'fas fa-dharmachakra', label: 'Kubernetes', color: 'blue' },
    'git': { icon: 'fab fa-git-alt', label: 'Git', color: 'blue' },
    'github': { icon: 'fab fa-github', label: 'GitHub', color: 'gray' },
    'database': { icon: 'fas fa-database', label: 'Databases', color: 'blue' },
    'mysql': { icon: 'fas fa-database', label: 'MySQL', color: 'blue' },
    'postgresql': { icon: 'fas fa-database', label: 'PostgreSQL', color: 'blue' },
    'mongodb': { icon: 'fas fa-leaf', label: 'MongoDB', color: 'green' },
    'firebase': { icon: 'fas fa-fire', label: 'Firebase', color: 'blue' },
    'tailwind': { icon: 'fab fa-css3', label: 'Tailwind CSS', color: 'blue' },
    'bootstrap': { icon: 'fab fa-bootstrap', label: 'Bootstrap', color: 'purple' },
    'aws': { icon: 'fab fa-aws', label: 'AWS', color: 'orange' },
    'nextjs': { icon: 'fas fa-n', label: 'Next.js', color: 'gray' },
    'vite': { icon: 'fas fa-bolt', label: 'Vite', color: 'orange' },
    'discord': { icon: 'fab fa-discord', label: 'Discord.js', color: 'blue' },
    'discordjs': { icon: 'fab fa-discord', label: 'Discord.js', color: 'blue' },
    'discord.js': { icon: 'fab fa-discord', label: 'Discord.js', color: 'blue' },
    'rust': { icon: 'fab fa-rust', label: 'Rust', color: 'orange' },
};

export function renderTechnologies(repos) {
    const allTopics = repos.reduce((acc, repo) => {
        return [...acc, ...repo.topics];
    }, []);
    
    // Ordenar claves por longitud (descendente) para coincidir términos específicos (ej: "nodejs") antes que genéricos (ej: "js")
    const sortedKeys = Object.keys(TECH_CONFIG).sort((a, b) => b.length - a.length);

    // 1. Normalizar y mapear a objetos de configuración primero
    const mappedTechs = allTopics.map(topic => {
        const lowerTopic = topic.toLowerCase();
        
        // Encontrar configuración coincidente usando las claves ordenadas
        const matchKey = sortedKeys.find(key => lowerTopic.includes(key));
        const config = matchKey ? TECH_CONFIG[matchKey] : null;

        return {
            label: config ? config.label : (topic.charAt(0).toUpperCase() + topic.slice(1)),
            icon: config ? config.icon : 'fas fa-code',
            color: config ? config.color : 'orange'
        };
    });

    // 2. Deduplicar basado en la etiqueta ('label')
    const uniqueTechsMap = new Map();
    mappedTechs.forEach(tech => {
        if (!uniqueTechsMap.has(tech.label)) {
            uniqueTechsMap.set(tech.label, tech);
        }
    });
    
    const uniqueTechs = Array.from(uniqueTechsMap.values());
    const list = $('#tech-list');
    
    if (uniqueTechs.length === 0) {
        list.innerHTML = '<li class="px-4 py-2 bg-gray-800 rounded-lg text-gray-400">No se encontraron tecnologías</li>';
        return;
    }

    // Duplicar la lista para un scroll infinito fluido
    const items = [...uniqueTechs, ...uniqueTechs].map(tech => 
        `<li class="px-6 py-2 bg-[#1a1a23] border border-blue-500/30 text-blue-200 rounded-full font-medium whitespace-nowrap shadow-lg flex items-center gap-2">
            <i class="${tech.icon} text-${tech.color}-400 text-lg"></i> ${tech.label}
        </li>`
    ).join('');
    
    list.innerHTML = items;
}

export function renderProjects(repos) {
    const grid = $('#projects-grid');
    grid.className = 'flex flex-col gap-24'; // Cambiar a diseño de columna con grandes espacios
    grid.innerHTML = '';
    
    // Ayudante para resolver configuración de tecnología (lógica reutilizada)
    const sortedKeys = Object.keys(TECH_CONFIG).sort((a, b) => b.length - a.length);
    
    const resolveTech = (topic) => {
        const lowerTopic = topic.toLowerCase();
        const matchKey = sortedKeys.find(key => lowerTopic.includes(key));
        const config = matchKey ? TECH_CONFIG[matchKey] : null;
        return {
            label: config ? config.label : (topic.charAt(0).toUpperCase() + topic.slice(1)),
            icon: config ? config.icon : 'fas fa-code',
            color: config ? config.color : 'blue' // Color por defecto
        };
    };

    repos.forEach((repo, index) => {
        const isAlternate = index % 2 !== 0;
        
        const card = document.createElement('article');
        // Contenedor Flex: Apilado en móvil, Lado a lado en escritorio. 
        // md:flex-row-reverse para ítems alternados.
        card.className = `flex flex-col md:flex-row ${isAlternate ? 'md:flex-row-reverse' : ''} gap-8 items-center`;
        
        // Columna Multimedia
        const mediaCol = document.createElement('div');
        mediaCol.className = 'w-full md:w-1/2 relative group perspective-1000';
        
        const img = document.createElement('img');
        img.src = repo.portfolio.thumbnail;
        img.alt = repo.name;
        img.className = 'w-full rounded-xl shadow-2xl border border-gray-700/50 transform transition-transform duration-500 group-hover:scale-[1.02] group-hover:rotate-1';
        img.onerror = function() {
            this.onerror = null;
            this.src = `https://ui-avatars.com/api/?name=${repo.name}&background=1a1a23&color=orange&size=512&font-size=0.33`;
        };
        
        // Overlay o efecto opcional
        const overlay = document.createElement('div');
        overlay.className = 'absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors rounded-xl pointer-events-none';

        mediaCol.appendChild(img);
        mediaCol.appendChild(overlay);

        // Columna de Contenido
        const contentCol = document.createElement('div');
        contentCol.className = 'w-full md:w-1/2 space-y-4';

        // Usar año personalizado de archivo .portfolio/year, o fallback al año del último commit
        const year = repo.portfolio.year || new Date(repo.updated_at).getFullYear();
        
        // Resolver y limitar temas
        const displayTopics = repo.topics.slice(0, 6).map(resolveTech);

        contentCol.innerHTML = `
            <div class="space-y-2">
                <h3 class="text-3xl font-bold text-orange-400">${repo.name} <span class="text-gray-600 text-lg font-normal">(${year})</span></h3>
                <div class="h-1 w-20 bg-blue-500/50 rounded-full"></div>
            </div>
            
            <p class="text-gray-300 text-lg leading-relaxed">
                ${repo.description || 'Este proyecto demuestra habilidades en desarrollo web, resolviendo problemas específicos mediante código limpio y eficiente.'}
            </p>

            <div class="flex flex-wrap gap-3 py-4">
                ${displayTopics.map(tech => `
                    <div class="flex items-center gap-2 text-sm text-gray-300 bg-[#252530] px-3 py-1.5 rounded-md border border-gray-700 hover:border-blue-500/50 transition-colors">
                        <i class="${tech.icon} text-${tech.color}-400"></i>
                        ${tech.label}
                    </div>
                `).join('')}
            </div>

            <div class="flex gap-4 pt-2">
                ${repo.homepage ? `
                    <a href="${repo.homepage}" target="_blank" class="px-6 py-2 bg-[#5c6ac4] hover:bg-[#4f5b93] text-white rounded-md font-semibold transition-all shadow-lg flex items-center gap-2">
                        <i class="fas fa-play text-xs"></i> Ver en acción
                    </a>
                ` : ''}
                <a href="${repo.html_url}" target="_blank" class="px-6 py-2 bg-transparent border border-gray-600 text-gray-400 hover:text-white hover:border-white rounded-md font-semibold transition-all flex items-center gap-2">
                    <i class="fab fa-github"></i> Ver código
                </a>
                 <button class="px-4 py-2 text-gray-500 hover:text-orange-400 transition-colors" onclick="document.dispatchEvent(new CustomEvent('open-modal', {detail: '${repo.name}'}))">
                    <i class="fas fa-info-circle"></i> Más detalles
                </button>
            </div>
        `;
        
        // Vincular el clic de "Más detalles" manualmente ya que onclick inline no funciona bien con módulos
        const infoBtn = contentCol.querySelector('button');
        infoBtn.onclick = () => openModal(repo);

        card.appendChild(mediaCol);
        card.appendChild(contentCol);
        
        grid.appendChild(card);
    });
}

async function openModal(repo) {
    const modal = $('#project-modal');
    const mediaContainer = $('#modal-media');
    const descContainer = $('#modal-description');
    
    $('#modal-title').textContent = repo.name;
    descContainer.innerHTML = '<p class="text-gray-400 animate-pulse">Cargando descripción detallada...</p>'; // Estado de carga
    $('#modal-link').href = repo.homepage || repo.html_url;
    $('#modal-repo').href = repo.html_url;
    
    // Etiquetas
    $('#modal-tags').innerHTML = repo.topics.map(t => 
        `<span class="px-3 py-1 bg-blue-900/50 text-blue-200 rounded-full text-sm border border-blue-500/30">${t}</span>`
    ).join('');

    // Manejo de Multimedia (Video vs Imagen)
    mediaContainer.innerHTML = '';
    
    // Intentar cargar video primero
    const video = document.createElement('video');
    video.src = repo.portfolio.video;
    video.controls = true;
    video.className = 'w-full h-full object-contain';
    video.autoplay = false;
    
    video.onerror = () => {
        const img = document.createElement('img');
        img.src = repo.portfolio.thumbnail;
        img.className = 'w-full h-full object-cover rounded-lg';
        img.onerror = function() {
             this.src = `https://ui-avatars.com/api/?name=${repo.name}&background=random&size=512`;
        }
        mediaContainer.innerHTML = '';
        mediaContainer.appendChild(img);
    };

    mediaContainer.appendChild(video);

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevenir scroll del fondo

    // Obtener y renderizar README
    const readmeContent = await getReadme(repo.owner.login, repo.name, repo.default_branch);
    
    if (readmeContent) {
        // Usar marked para parsear markdown y aplicar clases de tipografía
        descContainer.innerHTML = `
            <div class="prose prose-invert prose-blue max-w-none">
                ${marked.parse(readmeContent)}
            </div>
        `;
    } else {
        descContainer.innerHTML = `<p class="text-gray-300">${repo.description || 'No description available.'}</p>`;
    }
}

// Lógica de cierre del modal
$('#close-modal').addEventListener('click', closeModal);
$('#modal-backdrop').addEventListener('click', closeModal);

function closeModal() {
    const modal = $('#project-modal');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    $('#modal-media').innerHTML = ''; // Detener reproducción de video
}

// Cerrar con tecla Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !$('#project-modal').classList.contains('hidden')) {
        closeModal();
    }
});

export function initHeroAnimation() {
    const header = $('header');
    if (!header) return;

    // Crear contenedor para palabras de fondo
    const container = document.createElement('div');
    container.className = 'absolute inset-0 overflow-hidden pointer-events-none z-0';
    header.insertBefore(container, header.firstChild);

    CONFIG.BACKGROUND_WORDS.forEach((word, index) => {
        const el = document.createElement('span');
        el.textContent = word;
        el.className = 'floating-word text-gray-500/10 font-black font-sans'; // Opacidad muy sutil manejada también en keyframes CSS
        
        // Aleatorizar propiedades
        const top = Math.random() * 90 + 5; // 5% a 95%
        const size = Math.random() * 4 + 2; // 2rem a 6rem
        const duration = Math.random() * 20 + 20; // 20s a 40s (lento)
        const delay = Math.random() * -20; // Retraso negativo para comenzar a mitad de animación
        
        // Alternar dirección
        const direction = index % 2 === 0 ? 'floatLeft' : 'floatRight';

        el.style.top = `${top}%`;
        el.style.fontSize = `${size}rem`;
        el.style.animation = `${direction} ${duration}s linear infinite`;
        el.style.animationDelay = `${delay}s`;

        container.appendChild(el);
    });
}

export function initTypewriter() {
    const element = $('header h2');
    if (!element) return;
    
    const phrases = CONFIG.TYPEWRITER_PHRASES || ["Full Stack Developer"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    element.classList.add('typing-cursor');

    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            element.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50; // Borrado más rápido
        } else {
            element.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100; // Escritura normal
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pausa al final
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500; // Pausa antes de nueva frase
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

export function renderCertificates() {
    const track = $('#certificates-track');
    const dotsContainer = $('#certificates-dots');
    const prevBtn = $('#prev-cert');
    const nextBtn = $('#next-cert');
    
    if (!track || !CONFIG.CERTIFICATES || CONFIG.CERTIFICATES.length === 0) return;

    let currentIndex = 0;

    // Renderizar Ítems
    track.innerHTML = CONFIG.CERTIFICATES.map(cert => `
        <div class="min-w-full relative aspect-video bg-black flex items-center justify-center">
            <img src="${cert.image}" alt="${cert.title}" class="h-full object-contain pointer-events-none">
            <div class="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-center text-sm backdrop-blur-sm">
                ${cert.title}
            </div>
        </div>
    `).join('');

    // Renderizar Puntos
    dotsContainer.innerHTML = CONFIG.CERTIFICATES.map((_, i) => `
        <button class="w-3 h-3 rounded-full transition-all ${i === 0 ? 'bg-blue-500 scale-125' : 'bg-gray-600 hover:bg-gray-500'}" data-index="${i}" aria-label="Ir a diapositiva ${i + 1}"></button>
    `).join('');

    const updateCarousel = () => {
        const offset = currentIndex * -100;
        track.style.transform = `translateX(${offset}%)`;
        
        // Actualizar puntos
        Array.from(dotsContainer.children).forEach((dot, i) => {
            if (i === currentIndex) {
                dot.className = 'w-3 h-3 rounded-full transition-all bg-blue-500 scale-125';
            } else {
                dot.className = 'w-3 h-3 rounded-full transition-all bg-gray-600 hover:bg-gray-500';
            }
        });
    };

    // Event Listeners
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : CONFIG.CERTIFICATES.length - 1;
        updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex < CONFIG.CERTIFICATES.length - 1) ? currentIndex + 1 : 0;
        updateCarousel();
    });

    dotsContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            currentIndex = parseInt(e.target.dataset.index);
            updateCarousel();
        }
    });
}