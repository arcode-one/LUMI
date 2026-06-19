const FAQ_OPEN_CLASS = "faq__item--open";

export function initFaq() {
	document.querySelectorAll("[data-faq-question]").forEach((question) => {
		question.addEventListener("click", () => {
			const item = question.closest("[data-faq-item]");
			const wasOpen = item?.classList.contains(FAQ_OPEN_CLASS);

			document.querySelectorAll(`[data-faq-item].${FAQ_OPEN_CLASS}`).forEach((openItem) => {
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
