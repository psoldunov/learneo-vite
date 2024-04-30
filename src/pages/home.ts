export default function homePage() {
	// Random margin between 0.5 and 3
	const randomMargin = () => Math.floor(Math.random() * 6) + 0.5;
	const logoLink: HTMLAnchorElement =
		document.querySelector('[data-logo-link]')!;

	const updatesThumbs: Array<HTMLElement> = Array.from(
		document.querySelectorAll('.news-home_thumb-wrap')
	);

	if (!updatesThumbs) return;

	updatesThumbs.forEach((thumb) => {
		thumb.style.marginRight = `${randomMargin()}%`;
	});

	//Remove href from logoLink and scroll to top when clicked
	logoLink.setAttribute('href', '#');
	logoLink.addEventListener('click', () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	});

}
