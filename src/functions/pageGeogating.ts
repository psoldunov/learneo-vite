import { isEEAUser } from '@functions/isEEAUser';

export default async function pageGeogating(displayType: string = 'block') {
	const euShowBlocks: HTMLElement[] = Array.from(
		document.querySelectorAll('[data-europe-show]')
	);

	const euHideBlocks: HTMLElement[] = Array.from(
		document.querySelectorAll('[data-europe-hide]')
	);

	const eeaStatus = await isEEAUser();

	if (eeaStatus) {
		euShowBlocks.forEach((block) => {
			block.style.display = displayType;
		});
		euHideBlocks.forEach((block) => {
			block.remove();
		});
	} else {
		euShowBlocks.forEach((block) => {
			block.remove();
		});
		euHideBlocks.forEach((block) => {
			block.style.display = displayType;
		});
	}
}
