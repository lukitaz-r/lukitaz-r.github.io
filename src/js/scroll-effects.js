/**
 * Scroll Effects - Optimizado
 * Maneja los efectos visuales del header basados en el scroll
 */

const header = document.querySelector('header');
let isScrolled = false;

/**
 * Throttle function para optimizar eventos de scroll
 * @param {Function} func - Función a ejecutar
 * @param {number} delay - Delay en ms
 */
function throttle(func, delay) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

/**
 * Maneja el efecto de scroll del header
 */
function handleScroll() {
  const scrollThreshold = 50;
  const shouldBeScrolled = window.scrollY > scrollThreshold;
  
  // Solo actualizar si el estado cambió
  if (shouldBeScrolled !== isScrolled) {
    isScrolled = shouldBeScrolled;
    header.classList.toggle('scrolled', isScrolled);
  }
}

// Usar throttle para optimizar el rendimiento
const throttledScroll = throttle(handleScroll, 100);

// Event listener con opción passive para mejor rendimiento
window.addEventListener('scroll', throttledScroll, { passive: true });

// Verificar estado inicial
handleScroll();
