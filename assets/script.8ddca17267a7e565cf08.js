var MAX_WIDTH=1040,MAX_HEIGHT=555,TITLE_SPEED_MS=200,RELOAD_PAGE_H=2,HEADING_INITIAL_FONT_SIZE=46,PARAGRAPH_INITIAL_FONT_SIZE=28;function changeStyle(t,e,n){t&&(t.style.transition="opacity 1.5s, transform 1.5s",t.style.opacity=e,t.style.transform=n)}function initMenuToggle(){var t=document.getElementById("menu-toggle");t&&t.addEventListener("change",(function(){document.body.style.overflow=t.checked?"hidden":""}))}function initArticleStyles(){var t=document.querySelectorAll(".main__article");t.length&&t.forEach((function(t,e){Array.from(t.children).forEach((function(t){changeStyle(t,0,e%2==0?"translateX(-100%)":"translateX(100%)")}))}))}function initUpdateVisibility(){var t=document.querySelectorAll(".main__article");if(t.length){var e=function(){var e=window.scrollY||document.documentElement.scrollTop,n=t[t.length-1],o=n?n.offsetTop:0,i=0,r=null,c=window.matchMedia("screen and (max-width: ".concat(MAX_WIDTH,"px), screen and (max-height: ").concat(MAX_HEIGHT,"px)")).matches;t.forEach((function(t){var e=t.getBoundingClientRect(),n=Math.max(0,Math.min(e.bottom,window.innerHeight)-Math.max(e.top,0));n>i&&(i=n,r=t)})),t.forEach((function(n,a){Array.from(n.children).forEach((function(l){c?n===r&&i>0&&changeStyle(l,1,"translateX(0)"):n===r&&i>0?changeStyle(l,1,"translateX(0)"):a===t.length-1?e<o&&changeStyle(l,0,"translateX(100%)"):changeStyle(l,0,a%2==0?"translateX(-100%)":"translateX(100%)")}))}))};window.addEventListener("scroll",e),e()}}function initIntersectionObserver(){var t=document.querySelectorAll(".main__menu-item");if(t.length){var e=new IntersectionObserver((function(t){t.forEach((function(t){t.target.classList.toggle("visible",t.isIntersecting)}))}),{threshold:.1});t.forEach((function(t){return e.observe(t)}))}}function initSmoothScroll(){var t=function(t){var e=t.getBoundingClientRect().top+window.scrollY-.2*window.innerHeight;window.scrollTo({top:e,behavior:"smooth"})},e=document.querySelectorAll('a[href*="#"]');if(e.length){e.forEach((function(e){e.addEventListener("click",(function(e){if(new URL(this.href).pathname===window.location.pathname){e.preventDefault();var n=document.querySelector(this.hash);n&&t(n)}else e.preventDefault(),localStorage.setItem("smoothScrollTarget",this.hash),window.location.href=this.pathname+this.search}))}));!function(){var e=localStorage.getItem("smoothScrollTarget");if(e){var n=document.querySelector(e);n&&(window.scrollTo({top:0,behavior:"auto"}),requestAnimationFrame((function(){return t(n)}))),localStorage.removeItem("smoothScrollTarget")}}()}}function initImageClickListeners(){var t=document.querySelectorAll("img");t.length&&t.forEach((function(t){t.closest("a")||t.addEventListener("click",(function(){window.open(t.src,"_blank")}))}))}function initFitTextToContainer(){var t=document.querySelectorAll(".main__text-content");if(t.length){var e=function(t){var e=t.querySelectorAll(".main__heading"),n=t.querySelectorAll(".main__paragraph");if(e.length&&n.length){var o=HEADING_INITIAL_FONT_SIZE,i=PARAGRAPH_INITIAL_FONT_SIZE;for(e.forEach((function(t){return t.style.fontSize="".concat(o,"px")})),n.forEach((function(t){return t.style.fontSize="".concat(i,"px")}));(t.scrollHeight>t.clientHeight||t.scrollWidth>t.clientWidth)&&(i=(o-=1)/HEADING_INITIAL_FONT_SIZE*PARAGRAPH_INITIAL_FONT_SIZE,e.forEach((function(t){return t.style.fontSize="".concat(o,"px")})),n.forEach((function(t){return t.style.fontSize="".concat(i,"px")})),!(o<=0||i<=0)););}};t.forEach((function(t){return e(t)})),window.addEventListener("resize",(function(){t.forEach((function(t){return e(t)}))}))}}function initTitleAnimation(){var t,e,n,o;t=document.title,e=TITLE_SPEED_MS,n=t+" ",(o=function(){document.title=n,n=n.substring(1)+n.charAt(0),setTimeout(o,e)})()}function initPageReloadCheck(){var t="lastFetch",e=(new Date).getTime();e-(localStorage.getItem(t)||0)>36e5*RELOAD_PAGE_H&&(localStorage.setItem(t,e),window.location.reload(!0))}function lockOrientation(){screen.orientation&&"function"==typeof screen.orientation.lock?screen.orientation.lock("portrait").then((function(){console.log("Orientation locked to portrait mode.")})).catch((function(t){console.error("Error locking orientation:",t)})):console.warn("Screen orientation lock API is not supported on this device.")}function initMenuItemsFlex(){var t=document.querySelectorAll(".main__menu-item");if(t.length){var e=0;t.forEach((function(t){var n=t.offsetWidth;n>e&&(e=n)})),t.forEach((function(t){t.style.flex="1 1 ".concat(e,"px")}))}}document.addEventListener("DOMContentLoaded",(function(){initMenuToggle(),initArticleStyles(),initUpdateVisibility(),initIntersectionObserver(),initSmoothScroll(),initImageClickListeners(),initFitTextToContainer(),initTitleAnimation(),initPageReloadCheck(),lockOrientation()})),window.addEventListener("load",(function(){initMenuItemsFlex()}));