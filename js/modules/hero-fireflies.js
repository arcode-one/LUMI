export function initHeroFireflies() {
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
