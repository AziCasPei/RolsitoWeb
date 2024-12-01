// Constantes de configuración
const MAX_WIDTH = 1040;
const MAX_HEIGHT = 555;
const TITLE_SPEED_MS = 200;
const RELOAD_PAGE_H = 2;
const HEADING_INITIAL_FONT_SIZE = 46;
const PARAGRAPH_INITIAL_FONT_SIZE = 28;

// Funciones auxiliares
function changeStyle(block, opacity, transform) {
    if (!block) return;
    block.style.transition = 'opacity 1.5s, transform 1.5s';
    block.style.opacity = opacity;
    block.style.transform = transform;
}

// Inicialización del script
document.addEventListener('DOMContentLoaded', () => {
    initMenuToggle();
    initArticleStyles();
    initUpdateVisibility();
    initIntersectionObserver();
    initSmoothScroll();
    initImageClickListeners();
    initFitTextToContainer();
    initTitleAnimation();
    initPageReloadCheck();
    lockOrientation();
});

window.addEventListener('load', () => {
    initMenuItemsFlex();
});

// Funciones principales

function initMenuToggle() {
    const menuToggle = document.getElementById('menu-toggle');
    if (!menuToggle) return;
    menuToggle.addEventListener('change', () => {
        document.body.style.overflow = menuToggle.checked ? 'hidden' : '';
    });
}

function initArticleStyles() {
    const articles = document.querySelectorAll('.main__article');
    if (!articles.length) return;

    articles.forEach((article, index) => {
        const blocks = Array.from(article.children);
        blocks.forEach(block => {
            changeStyle(block, 0, index % 2 === 0 ? 'translateX(-100%)' : 'translateX(100%)');
        });
    });
}

function initUpdateVisibility() {
    const articles = document.querySelectorAll('.main__article');
    if (!articles.length) return;

    const updateVisibility = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const lastArticle = articles[articles.length - 1];
        const lastArticleTop = lastArticle ? lastArticle.offsetTop : 0;

        let maxVisibility = 0;
        let mostVisibleArticle = null;

        const isSpecialResolution = window.matchMedia(
            `screen and (max-width: ${MAX_WIDTH}px), screen and (max-height: ${MAX_HEIGHT}px)`
        ).matches;

        articles.forEach(article => {
            const articlePosition = article.getBoundingClientRect();
            const visibility = Math.max(
                0,
                Math.min(articlePosition.bottom, window.innerHeight) -
                Math.max(articlePosition.top, 0)
            );

            if (visibility > maxVisibility) {
                maxVisibility = visibility;
                mostVisibleArticle = article;
            }
        });

        articles.forEach((article, index) => {
            const blocks = Array.from(article.children);
            blocks.forEach(block => {
                if (isSpecialResolution) {
                    if (article === mostVisibleArticle && maxVisibility > 0) {
                        changeStyle(block, 1, 'translateX(0)');
                    }
                } else {
                    if (article === mostVisibleArticle && maxVisibility > 0) {
                        changeStyle(block, 1, 'translateX(0)');
                    } else if (index === articles.length - 1) {
                        if (scrollTop < lastArticleTop) {
                            changeStyle(block, 0, 'translateX(100%)');
                        }
                    } else {
                        changeStyle(block, 0, index % 2 === 0 ? 'translateX(-100%)' : 'translateX(100%)');
                    }
                }
            });
        });
    };

    window.addEventListener('scroll', updateVisibility);
    updateVisibility();
}

function initIntersectionObserver() {
    const observerOptions = { threshold: 0.1 };
    const menuItems = document.querySelectorAll('.main__menu-item');
    if (!menuItems.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            entry.target.classList.toggle('visible', entry.isIntersecting);
        });
    }, observerOptions);

    menuItems.forEach(item => observer.observe(item));
}

function initSmoothScroll() {
    const smoothScroll = target => {
        const offsetTop = target.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.2;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    };

    const anchors = document.querySelectorAll('a[href*="#"]');
    if (!anchors.length) return;

    anchors.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetPathname = new URL(this.href).pathname;
            if (targetPathname === window.location.pathname) {
                e.preventDefault();
                const target = document.querySelector(this.hash);
                if (target) smoothScroll(target);
            } else {
                e.preventDefault();
                localStorage.setItem('smoothScrollTarget', this.hash);
                window.location.href = this.pathname + this.search;
            }
        });
    });

    const handleSmoothScrollOnLoad = () => {
        const targetHash = localStorage.getItem('smoothScrollTarget');
        if (targetHash) {
            const targetElement = document.querySelector(targetHash);
            if (targetElement) {
                window.scrollTo({ top: 0, behavior: 'auto' });
                requestAnimationFrame(() => smoothScroll(targetElement));
            }
            localStorage.removeItem('smoothScrollTarget');
        }
    };

    handleSmoothScrollOnLoad();
}

function initImageClickListeners() {
    const images = document.querySelectorAll("img");
    if (!images.length) return;

    images.forEach(img => {
        if (!img.closest("a")) {
            img.addEventListener('click', () => {
                window.open(img.src, '_blank');
            });
        }
    });
}

function initFitTextToContainer() {
    const containers = document.querySelectorAll('.main__text-content');
    if (!containers.length) return;

    const fitTextToContainer = container => {
        const headings = container.querySelectorAll('.main__heading');
        const paragraphs = container.querySelectorAll('.main__paragraph');

        if (!headings.length || !paragraphs.length) return;

        let headingFontSize = HEADING_INITIAL_FONT_SIZE;
        let paragraphFontSize = PARAGRAPH_INITIAL_FONT_SIZE;

        headings.forEach(heading => heading.style.fontSize = `${headingFontSize}px`);
        paragraphs.forEach(paragraph => paragraph.style.fontSize = `${paragraphFontSize}px`);

        while (
            container.scrollHeight > container.clientHeight ||
            container.scrollWidth > container.clientWidth
        ) {
            headingFontSize -= 1;
            paragraphFontSize = (headingFontSize / HEADING_INITIAL_FONT_SIZE) * PARAGRAPH_INITIAL_FONT_SIZE;
            headings.forEach(heading => heading.style.fontSize = `${headingFontSize}px`);
            paragraphs.forEach(paragraph => paragraph.style.fontSize = `${paragraphFontSize}px`);
            if (headingFontSize <= 0 || paragraphFontSize <= 0) break;
        }
    };

    containers.forEach(container => fitTextToContainer(container));
    window.addEventListener('resize', () => {
        containers.forEach(container => fitTextToContainer(container));
    });
}

function initTitleAnimation() {
    const animateTitle = (text, speed) => {
        let displayText = text + " ";
        const moveTitle = () => {
            document.title = displayText;
            displayText = displayText.substring(1) + displayText.charAt(0);
            setTimeout(moveTitle, speed);
        };
        moveTitle();
    };

    animateTitle(document.title, TITLE_SPEED_MS);
}

function initPageReloadCheck() {
    const lastFetchKey = 'lastFetch';
    const now = new Date().getTime();
    const lastFetch = localStorage.getItem(lastFetchKey) || 0;

    if ((now - lastFetch) > RELOAD_PAGE_H * 3600000) {
        localStorage.setItem(lastFetchKey, now);
        window.location.reload(true);
    }
}

function lockOrientation() {
    if (screen.orientation && typeof screen.orientation.lock === 'function') {
        screen.orientation.lock('portrait')
            .then(() => {
                console.log("Orientation locked to portrait mode.");
            })
            .catch((err) => {
                console.error("Error locking orientation:", err);
                applyCssOrientationFix();
            });
    } else {
        console.warn("Screen orientation lock API is not supported on this device.");
        applyCssOrientationFix();
    }
}

function applyCssOrientationFix() {
    const orientationAngle = screen.orientation.angle || window.orientation;

    if (orientationAngle === 0 || orientationAngle === 180) {
        // Retrato
        document.body.style.transform = "none";
        document.body.style.width = "100%";
        document.body.style.height = "100%";
        document.body.style.position = "fixed";
    } else if (orientationAngle === 90 || orientationAngle === -90) {
        // Paisaje
        document.body.style.transform = "rotate(-90deg)";
        document.body.style.width = `${window.innerHeight}px`;
        document.body.style.height = `${window.innerWidth}px`;
        document.body.style.position = "fixed";
        document.body.style.top = `${(window.innerWidth - window.innerHeight) / 2}px`;
        document.body.style.left = `${(window.innerHeight - window.innerWidth) / 2}px`;
        document.body.style.transformOrigin = "center";
    }

    window.addEventListener('resize', applyCssOrientationFix);
}

function initMenuItemsFlex() {
    const menuItems = document.querySelectorAll('.main__menu-item');
    if (!menuItems.length) return;

    let maxWidth = 0;
    menuItems.forEach(item => {
        const width = item.offsetWidth;
        if (width > maxWidth) maxWidth = width;
    });

    menuItems.forEach(item => {
        item.style.flex = `1 1 ${maxWidth}px`;
    });
}