var menuToggle = document.getElementById('menu-toggle');
menuToggle.addEventListener('change', function () {
    if (menuToggle.checked)
        document.body.style.overflow = 'hidden';
    else
        document.body.style.overflow = '';
});

const MAX_WIDTH = 1040;
const MAX_HEIGHT = 555;
const TITLE_SPEED_MS = 200;
const RELOAD_PAGE_H = 24;

function changeStyle(block, opacity, transform) {
    block.style.transition = 'opacity 1.5s, transform 1.5s';
    block.style.opacity = opacity;
    block.style.transform = transform;
}

window.addEventListener('DOMContentLoaded', () => {
    var articles = document.querySelectorAll('.main__article');

    articles.forEach((article, index) => {
        var blocks = article.children;

        Array.from(blocks).forEach((block) => {
            changeStyle(block, 0, index % 2 === 0 ? 'translateX(-100%)' : 'translateX(100%)');
        });
    });
});

function updateVisibility() {
    var articles = document.querySelectorAll('.main__article');
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var lastArticle = articles[articles.length - 1];
    var lastArticleTop = lastArticle.offsetTop;

    var maxVisibility = 0;
    var mostVisibleArticle = null;

    var isSpecialResolution = window.matchMedia(`screen and (max-width: ${MAX_WIDTH}px), screen and (max-height: ${MAX_HEIGHT}px)`).matches;

    articles.forEach((article) => {
        var articlePosition = article.getBoundingClientRect();
        var visibility = Math.max(0, Math.min(articlePosition.bottom, window.innerHeight) - Math.max(articlePosition.top, 0));

        if (visibility > maxVisibility) {
            maxVisibility = visibility;
            mostVisibleArticle = article;
        }
    });

    articles.forEach((article, index) => {
        var blocks = article.children;

        Array.from(blocks).forEach((block) => {
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
}

window.addEventListener('load', updateVisibility);
window.addEventListener('scroll', updateVisibility);

document.addEventListener("DOMContentLoaded", function () {
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    const menuItems = document.querySelectorAll('.main__menu-item');
    menuItems.forEach(item => {
        observer.observe(item);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const smoothScroll = (target) => {
        const offsetTop = target.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.2;
        window.scrollTo({
            top: offsetTop,
            behavior: "smooth"
        });
    };

    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
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
});

document.addEventListener("DOMContentLoaded", function() {
    const images = document.querySelectorAll("img");

    images.forEach(function(img) {
        if (!img.closest("a")) {
            img.onclick = function() {
                window.open(img.src, '_blank');
            };
        }
    });
});

window.onload = function () {
    var lis = document.querySelectorAll('.main__menu-item');
    var maxWidth = 0;

    for (var i = 0; i < lis.length; i++) {
        var width = lis[i].offsetWidth;
        if (width > maxWidth) {
            maxWidth = width;
        }
    }

    for (var i = 0; i < lis.length; i++) {
        lis[i].style.flex = '1 1 ' + maxWidth + 'px';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll('.main__text-content');
    containers.forEach(container => fitTextToContainer(container));

    window.addEventListener('resize', () => {
        containers.forEach(container => fitTextToContainer(container));
    });
});

function fitTextToContainer(container) {
    const headings = container.querySelectorAll('.main__heading');
    const paragraphs = container.querySelectorAll('.main__paragraph');

    if (headings.length === 0 || paragraphs.length === 0) return;

    const headingInitialFontSize = 46;
    const paragraphInitialFontSize = 28;

    let headingFontSize = headingInitialFontSize;
    let paragraphFontSize = paragraphInitialFontSize;

    headings.forEach(heading => heading.style.fontSize = headingFontSize + 'px');
    paragraphs.forEach(paragraph => paragraph.style.fontSize = paragraphFontSize + 'px');

    while (
        container.scrollHeight > container.clientHeight ||
        container.scrollWidth > container.clientWidth
    ) {
        headingFontSize -= 1;
        paragraphFontSize = (headingFontSize / headingInitialFontSize) * paragraphInitialFontSize;
        headings.forEach(heading => heading.style.fontSize = headingFontSize + 'px');
        paragraphs.forEach(paragraph => paragraph.style.fontSize = paragraphFontSize + 'px');
        if (headingFontSize <= 0 || paragraphFontSize <= 0) break;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    function animateTitle(text, speed) {
        let displayText = text + " ";
        function moveTitle() {
            document.title = displayText;
            displayText = displayText.substring(1) + displayText.charAt(0);
            setTimeout(moveTitle, speed);
        }
        moveTitle();
    }

    // Llamada al método con el texto y la velocidad deseada
    animateTitle(document.title, TITLE_SPEED_MS);
});

document.addEventListener("DOMContentLoaded", function() {
    const lastFetchKey = 'lastFetch';
    const now = new Date().getTime();
    const lastFetch = localStorage.getItem(lastFetchKey) || 0;

    if ((now - lastFetch) > RELOAD_PAGE_H * 3600000) { // 24 horas en milisegundos
        localStorage.setItem(lastFetchKey, now);
        window.location.reload(true); // Forzar recarga desde el servidor
    }
});