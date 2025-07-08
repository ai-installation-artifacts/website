// Preloader for faster page navigation
class PagePreloader {
    constructor() {
        this.cache = new Map();
        this.preloadedPages = new Set();
        this.init();
    }

    init() {
        // Start preloading after the current page has loaded
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.preloadCriticalPages();
                this.preloadImages();
            }, 1000); // Wait 1 second to avoid blocking initial page load
        });
    }

    async preloadCriticalPages() {
        // Determine the base path depending on current location
        const isInPagesDir = window.location.pathname.includes('/src/pages/');
        const basePath = isInPagesDir ? '../../' : '';

        // List of pages to preload
        const criticalPages = [
            `${basePath}src/pages/trailer.html`,
            `${basePath}src/pages/project.html`,
            `${basePath}src/pages/team.html`,
            `${basePath}src/pages/tech.html`,
            `${basePath}src/pages/design.html`,
            `${basePath}src/pages/about.html`
        ];

        console.log('Preloading pages...');

        for (const page of criticalPages) {
            try {
                const response = await fetch(page);
                const html = await response.text();
                this.cache.set(page, html);
                this.preloadedPages.add(page);
                console.log(`Preloaded: ${page}`);
            } catch (error) {
                console.log(`Failed to preload ${page}:`, error);
            }
        }
    }

    preloadImages() {
        // Determine the base path depending on current location
        const isInPagesDir = window.location.pathname.includes('/src/pages/');
        const basePath = isInPagesDir ? '../../' : '';

        // Preload critical images
        const criticalImages = [
            `${basePath}assets/images/team/AYSE.png`,
            `${basePath}assets/images/team/AZIM.png`,
            `${basePath}assets/images/team/MAXI.png`,
            `${basePath}assets/images/team/SALOME.png`,
            `${basePath}assets/images/design/colors1.png`,
            `${basePath}assets/images/design/colors2.png`,
            `${basePath}assets/images/design/materials1.png`,
            `${basePath}assets/images/design/materials2.png`
        ];

        console.log('Preloading images...');

        criticalImages.forEach(imageSrc => {
            const img = new Image();
            img.onload = () => console.log(`Preloaded image: ${imageSrc}`);
            img.onerror = () => console.log(`Failed to preload image: ${imageSrc}`);
            img.src = imageSrc;
        });
    }

    // Method to check if a page is preloaded
    isPagePreloaded(page) {
        return this.preloadedPages.has(page);
    }

    // Method to get preloaded page content
    getPreloadedPage(page) {
        return this.cache.get(page);
    }
}

// Initialize preloader
const preloader = new PagePreloader();

// Make it globally available
window.pagePreloader = preloader;
