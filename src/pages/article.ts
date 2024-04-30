import { showElement, hideElement } from '@functions/globals';

export default function articlePage() {
	const urlShareButton: HTMLAnchorElement = document.querySelector(
		'[data-url-share-button]'
	)!;

	const copyTooltip: HTMLElement = urlShareButton.querySelector(
		'.share-button_url-copied'
	)!;

	urlShareButton.addEventListener('click', () => {
		// Copy url of the current page to clipboard
		navigator.clipboard.writeText(window.location.href);

		// Show tooltip and hide after 2 seconds
		showElement(copyTooltip);
		setTimeout(() => {
			hideElement(copyTooltip);
		}, 2000);
	});
}
