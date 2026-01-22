import { CONFIG } from './config.js';

const BASE_URL = 'https://api.github.com';

export async function getUserProfile() {
    try {
        const response = await fetch(`${BASE_URL}/users/${CONFIG.GITHUB_USERNAME}`);
        if (!response.ok) throw new Error('Usuario no encontrado');
        return await response.json();
    } catch (error) {
        console.error('Error obteniendo perfil:', error);
        return null;
    }
}

export async function getRepositories() {
    try {
        const response = await fetch(`${BASE_URL}/users/${CONFIG.GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
        if (!response.ok) throw new Error('Repositorios no encontrados');
        const repos = await response.json();
        
        // Mejorar repositorios con URLs de assets del portfolio y obtener año personalizado
        const enhancedRepos = await Promise.all(repos.map(async repo => {
            const branch = repo.default_branch;
            const rawBase = `https://raw.githubusercontent.com/${CONFIG.GITHUB_USERNAME}/${repo.name}/${branch}/.portfolio`;
            
            let customYear = null;
            try {
                const yearResponse = await fetch(`${rawBase}/year`);
                if (yearResponse.ok) {
                    customYear = (await yearResponse.text()).trim();
                }
            } catch (e) {
                // Ignorar errores, usar valor por defecto
            }

            return {
                ...repo,
                portfolio: {
                    thumbnail: `${rawBase}/thumbnail.png`,
                    video: `${rawBase}/video.mp4`, // Opcional
                    year: customYear
                }
            };
        }));

        return enhancedRepos;
    } catch (error) {
        console.error('Error obteniendo repositorios:', error);
        return [];
    }
}

export async function getReadme(username, repoName, branch = 'main') {
    try {
        const response = await fetch(`https://raw.githubusercontent.com/${username}/${repoName}/${branch}/README.md`);
        if (!response.ok) throw new Error('Readme no encontrado');
        return await response.text();
    } catch (error) {
        console.warn(`No se encontró README para ${repoName}`);
        return null;
    }
}