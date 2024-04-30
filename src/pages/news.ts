//@ts-ignore
import mixitup from 'mixitup';

type NewsData = {
	category: string;
};

function filterControlsSetup(controlsContainer: HTMLElement) {
	if (!controlsContainer) return;

	const allButton = controlsContainer.children[0].cloneNode(
		true
	) as HTMLElement;

	const buttonEl = allButton.querySelector('button')!;

	(allButton.querySelector('.news_filter-embed') as HTMLElement).style.color =
		'#DC435C';

	buttonEl.setAttribute('data-filter', 'all');
	buttonEl.textContent = 'All';

	controlsContainer.prepend(allButton);

	return console.log('Filter was set up successfully!');
}

function filterContainerSetup(container: HTMLElement) {
	if (!container) return;

	const containerArray = Array.from(container.children) as HTMLElement[];

	containerArray.forEach((item) => {
		const data = JSON.parse(
			item.querySelector('[data-filter-item-data]')!.innerHTML
		) as NewsData;

		item.classList.add('mix', data.category);
	});
	return console.log('Container was set up successfully!');
}

export default function newsPage() {
	const filterControls = document.querySelector('[data-filter-controls]');
	const filterContainer = document.querySelector('[data-filter-container]');

	filterControlsSetup(filterControls as HTMLElement);
	filterContainerSetup(filterContainer as HTMLElement);

	//@ts-ignore
	const newsMixer = mixitup(filterContainer, {});
}
