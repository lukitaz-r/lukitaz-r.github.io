import { getUserProfile, getRepositories } from './api.js';
import { renderHeader, renderTechnologies, renderProjects, initHeroAnimation, initTypewriter, renderCertificates } from './ui.js';

async function init() {
    console.log('Iniciando portfolio...');
    
    // Inicializar animaciones
    initHeroAnimation();
    initTypewriter();
    renderCertificates();
    
    // Cargar perfil
    const profile = await getUserProfile();
    renderHeader(profile);
    
    // Cargar repositorios
    let repos = await getRepositories();
    
    // Ordenar repositorios por año (descendente)
    repos.sort((a, b) => {
        const getYear = (repo) => {
            if (repo.portfolio.year) {
                // Intentar obtener el último año si es un rango como "2021 - 2023"
                const matches = repo.portfolio.year.match(/\d{4}/g);
                if (matches) return parseInt(matches[matches.length - 1]);
            }
            return new Date(repo.updated_at).getFullYear();
        };
        return getYear(b) - getYear(a);
    });
    
    // Renderizar UI
    renderTechnologies(repos);
    renderProjects(repos);
    
    console.log('Portfolio cargado!');
}

document.addEventListener('DOMContentLoaded', init);