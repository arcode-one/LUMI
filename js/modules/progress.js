export function initProgressBar() {
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
