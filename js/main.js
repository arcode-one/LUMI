import { initFaq } from "./modules/faq.js";
import { initHeroFireflies } from "./modules/hero-fireflies.js";
import { initNavigation } from "./modules/navigation.js";
import { initProgressBar } from "./modules/progress.js";
import { initRevealOnScroll } from "./modules/reveal.js";

function whenIdle(callback) {
	if ("requestIdleCallback" in window) {
		window.requestIdleCallback(callback, { timeout: 1200 });
		return;
	}

	window.setTimeout(callback, 250);
}

initProgressBar();
initNavigation();

whenIdle(() => {
	initRevealOnScroll();
	initHeroFireflies();
	initFaq();
});
