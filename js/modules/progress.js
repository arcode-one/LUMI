export function initProgressBar() {
	const progress = document.querySelector("[data-progress]");

	if (!progress) return;

	window.addEventListener("scroll", () => {
		const scrollTop = document.documentElement.scrollTop;
		const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
		progress.style.width = `${(scrollTop / scrollHeight) * 100 || 0}%`;
	});
}
