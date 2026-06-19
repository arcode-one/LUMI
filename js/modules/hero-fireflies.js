export function initHeroFireflies() {
	const canvas = document.querySelector("[data-hero-canvas]");

	if (!canvas) return;

	const ctx = canvas.getContext("2d");
	let width = 0;
	let height = 0;
	let flies = [];

	function resizeCanvas() {
		width = canvas.width = canvas.offsetWidth;
		height = canvas.height = canvas.offsetHeight;
	}

	function makeFly() {
		return {
			x: Math.random() * width,
			y: Math.random() * height,
			r: Math.random() * 2 + 0.5,
			vx: (Math.random() - 0.5) * 0.4,
			vy: (Math.random() - 0.5) * 0.4,
			alpha: Math.random(),
			da: (Math.random() - 0.5) * 0.012,
			gold: Math.random() > 0.4,
		};
	}

	function initFlies() {
		flies = [];
		const amount = Math.min(70, Math.floor((width * height) / 9000));

		for (let i = 0; i < amount; i += 1) {
			flies.push(makeFly());
		}
	}

	function animateFlies() {
		ctx.clearRect(0, 0, width, height);

		for (const fly of flies) {
			fly.x += fly.vx;
			fly.y += fly.vy;
			fly.alpha += fly.da;

			if (fly.alpha <= 0 || fly.alpha >= 1) fly.da *= -1;
			if (fly.x < 0) fly.x = width;
			if (fly.x > width) fly.x = 0;
			if (fly.y < 0) fly.y = height;
			if (fly.y > height) fly.y = 0;

			const gradient = ctx.createRadialGradient(
				fly.x,
				fly.y,
				0,
				fly.x,
				fly.y,
				fly.r * 4,
			);
			const color = fly.gold
				? `rgba(201,168,76,${fly.alpha})`
				: `rgba(232,221,208,${fly.alpha * 0.5})`;

			gradient.addColorStop(0, color);
			gradient.addColorStop(1, "transparent");

			ctx.beginPath();
			ctx.arc(fly.x, fly.y, fly.r * 4, 0, Math.PI * 2);
			ctx.fillStyle = gradient;
			ctx.fill();
		}

		requestAnimationFrame(animateFlies);
	}

	resizeCanvas();
	initFlies();
	animateFlies();

	window.addEventListener("resize", () => {
		resizeCanvas();
		initFlies();
	});
}
