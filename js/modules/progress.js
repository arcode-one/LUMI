export function initProgressBar() {
	const progress = document.querySelector("[data-progress]");

	if (!progress) return;

	let ticking = false;

	function updateProgress() {
		const scrollTop = document.documentElement.scrollTop;
		const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
		progress.style.width = `${(scrollTop / scrollHeight) * 100 || 0}%`;
		ticking = false;
	}

	window.addEventListener(
		"scroll",
		() => {
			if (ticking) return;

			ticking = true;
			requestAnimationFrame(updateProgress);
		},
		{ passive: true },
	);
}
