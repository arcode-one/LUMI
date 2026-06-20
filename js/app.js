const FAQ_OPEN_CLASS = "faq__item--open";
const MENU_OPEN_CLASS = "mobile-menu--open";
const OVERLAY_VISIBLE_CLASS = "mobile-menu__overlay--visible";
const HEADER_SCROLLED_CLASS = "header--scrolled";
const HEADER_MENU_OPEN_CLASS = "header--menu-open";
const PAGE_MENU_OPEN_CLASS = "page--menu-open";

function initProgressBar() {
	const progress = document.querySelector("[data-progress]");

	if (!progress) return;

	let ticking = false;
	let maxScroll = 1;

	function updateMaxScroll() {
		maxScroll = Math.max(
			1,
			document.documentElement.scrollHeight - window.innerHeight,
		);
	}

	function updateProgress() {
		progress.style.transform = `scaleX(${Math.min(window.scrollY / maxScroll, 1)})`;
		ticking = false;
	}

	updateMaxScroll();
	updateProgress();

	window.addEventListener(
		"scroll",
		() => {
			if (ticking) return;

			ticking = true;
			requestAnimationFrame(updateProgress);
		},
		{ passive: true },
	);

	window.addEventListener("resize", updateMaxScroll, { passive: true });
	window.addEventListener("load", updateMaxScroll, { once: true });
}

function initNavigation() {
	const page = document.body;
	const header = document.querySelector("[data-header]");
	const toggle = document.querySelector("[data-menu-toggle]");
	const menu = document.querySelector("[data-mobile-menu]");
	const overlay = document.querySelector("[data-menu-overlay]");
	const links = document.querySelectorAll("[data-mobile-link]");
	const desktopQuery = window.matchMedia("(min-width: 1025px)");

	if (header) {
		let ticking = false;
		let isHeaderScrolled = false;

		function updateHeaderState() {
			const shouldBeScrolled = window.scrollY > 60;

			if (shouldBeScrolled !== isHeaderScrolled) {
				header.classList.toggle(HEADER_SCROLLED_CLASS, shouldBeScrolled);
				isHeaderScrolled = shouldBeScrolled;
			}

			ticking = false;
		}

		window.addEventListener(
			"scroll",
			() => {
				if (ticking) return;

				ticking = true;
				requestAnimationFrame(updateHeaderState);
			},
			{ passive: true },
		);

		updateHeaderState();
	}

	if (!toggle || !menu || !overlay) return;

	function setMenuState(isOpen) {
		toggle.setAttribute("aria-expanded", String(isOpen));
		toggle.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
		menu.setAttribute("aria-hidden", String(!isOpen));
		menu.classList.toggle(MENU_OPEN_CLASS, isOpen);
		overlay.classList.toggle(OVERLAY_VISIBLE_CLASS, isOpen);
		header?.classList.toggle(HEADER_MENU_OPEN_CLASS, isOpen);
		page.classList.toggle(PAGE_MENU_OPEN_CLASS, isOpen);

		if (isOpen) {
			menu.querySelector("[data-mobile-link]")?.focus({ preventScroll: true });
		}
	}

	function closeMenu() {
		setMenuState(false);
	}

	toggle.addEventListener("click", () => {
		const isOpen = toggle.getAttribute("aria-expanded") === "true";
		setMenuState(!isOpen);
	});

	overlay.addEventListener("click", closeMenu);

	links.forEach((link) => {
		link.addEventListener("click", closeMenu);
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") closeMenu();
	});

	desktopQuery.addEventListener("change", (event) => {
		if (event.matches) closeMenu();
	});
}

function initRevealOnScroll() {
	const items = document.querySelectorAll("[data-reveal]");

	if (!items.length) return;

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;

				entry.target.classList.add("reveal--visible");
				observer.unobserve(entry.target);
			});
		},
		{ threshold: 0.1 },
	);

	items.forEach((item) => observer.observe(item));
}

function initHeroFireflies() {
	const canvas = document.querySelector("[data-hero-canvas]");

	if (!canvas) return;
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

	const ctx = canvas.getContext("2d");
	const hero = canvas.closest(".hero");
	let width = 0;
	let height = 0;
	let sparkles = [];
	let animationId = null;
	let isVisible = true;

	function resizeCanvas() {
		width = canvas.width = canvas.offsetWidth;
		height = canvas.height = canvas.offsetHeight;
	}

	function makeSparkle() {
		return {
			x: Math.random() * width,
			y: Math.random() * height,
			size: Math.random() * 5 + 3,
			vx: (Math.random() - 0.5) * 0.18,
			vy: -0.05 - Math.random() * 0.16,
			alpha: Math.random() * 0.42 + 0.14,
			da: (Math.random() * 0.006 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
			rotation: Math.random() * Math.PI,
			vr: (Math.random() - 0.5) * 0.006,
		};
	}

	function initSparkles() {
		sparkles = [];
		const amount = Math.min(28, Math.floor((width * height) / 24000));

		for (let i = 0; i < amount; i += 1) {
			sparkles.push(makeSparkle());
		}
	}

	function drawStar(sparkle) {
		const long = sparkle.size;
		const short = sparkle.size * 0.28;

		ctx.save();
		ctx.translate(sparkle.x, sparkle.y);
		ctx.rotate(sparkle.rotation);
		ctx.globalAlpha = sparkle.alpha;
		ctx.fillStyle = "rgba(186, 163, 99, 0.68)";
		ctx.beginPath();
		ctx.moveTo(0, -long);
		ctx.quadraticCurveTo(short, -short, long, 0);
		ctx.quadraticCurveTo(short, short, 0, long);
		ctx.quadraticCurveTo(-short, short, -long, 0);
		ctx.quadraticCurveTo(-short, -short, 0, -long);
		ctx.fill();
		ctx.restore();
	}

	function animateSparkles() {
		if (!isVisible) {
			animationId = null;
			return;
		}

		ctx.clearRect(0, 0, width, height);

		for (const sparkle of sparkles) {
			sparkle.x += sparkle.vx;
			sparkle.y += sparkle.vy;
			sparkle.alpha += sparkle.da;
			sparkle.rotation += sparkle.vr;

			if (sparkle.alpha <= 0.1 || sparkle.alpha >= 0.58) sparkle.da *= -1;
			if (sparkle.x < -20) sparkle.x = width + 20;
			if (sparkle.x > width + 20) sparkle.x = -20;
			if (sparkle.y < -20) sparkle.y = height + 20;
			if (sparkle.y > height + 20) sparkle.y = -20;

			drawStar(sparkle);
		}

		animationId = requestAnimationFrame(animateSparkles);
	}

	resizeCanvas();
	initSparkles();
	animationId = requestAnimationFrame(animateSparkles);

	if (hero) {
		const observer = new IntersectionObserver(
			([entry]) => {
				isVisible = entry.isIntersecting;

				if (isVisible && animationId === null) {
					animationId = requestAnimationFrame(animateSparkles);
				}
			},
			{ threshold: 0 },
		);

		observer.observe(hero);
	}

	window.addEventListener("resize", () => {
		resizeCanvas();
		initSparkles();
	});
}

function initFaq() {
	document.querySelectorAll("[data-faq-question]").forEach((question) => {
		question.addEventListener("click", () => {
			const item = question.closest("[data-faq-item]");
			const wasOpen = item?.classList.contains(FAQ_OPEN_CLASS);

			document
				.querySelectorAll(`[data-faq-item].${FAQ_OPEN_CLASS}`)
				.forEach((openItem) => {
					openItem.classList.remove(FAQ_OPEN_CLASS);
					openItem
						.querySelector("[data-faq-question]")
						?.setAttribute("aria-expanded", "false");
				});

			if (!item || wasOpen) return;

			item.classList.add(FAQ_OPEN_CLASS);
			question.setAttribute("aria-expanded", "true");
		});
	});
}

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
