export function initRevealOnScroll() {
	const items = document.querySelectorAll("[data-reveal]");

	if (!items.length) return;

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) entry.target.classList.add("reveal--visible");
			});
		},
		{ threshold: 0.1 },
	);

	items.forEach((item) => observer.observe(item));
}
