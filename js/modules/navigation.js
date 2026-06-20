const MENU_OPEN_CLASS = "mobile-menu--open";
const OVERLAY_VISIBLE_CLASS = "mobile-menu__overlay--visible";
const HEADER_SCROLLED_CLASS = "header--scrolled";
const HEADER_MENU_OPEN_CLASS = "header--menu-open";
const PAGE_MENU_OPEN_CLASS = "page--menu-open";

export function initNavigation() {
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
