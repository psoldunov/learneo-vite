export function imageBleedControl() {
	const setBleedProperty = () => {
		const containerMaxWidth = 1260;
		const containerPaddingX = 40;
		const computedWidth = containerMaxWidth + containerPaddingX * 2;
		const windowWidth = window.innerWidth;

		if (windowWidth <= 1440 && windowWidth > computedWidth) {
			document.documentElement.style.setProperty(
				'--screen-bleed',
				`${(windowWidth - computedWidth) / 2}px`
			);
		}
		return 'Bleed property set';
	};

	setBleedProperty();
	window.addEventListener('resize', setBleedProperty);
}

export function showElement(
	element: HTMLElement,
	target: string = 'block',
	duration: string = '500ms'
) {
	setTransition(element, `opacity ${duration} ease 0s`);
	element.style.opacity = '0';
	element.style.display = target;
	waitForStyleChange(element, 'display', target, () => {
		element.style.opacity = '1';
	});
	return 'Element is visible';
}

export function hideElement(element: HTMLElement, duration: string = '500ms') {
	setTransition(element, `opacity ${duration} ease 0s`);
	element.style.opacity = '0';
	waitForStyleChange(element, 'opacity', '0', () => {
		element.style.display = 'none';
	});
	return 'Element is hidden';
}

function setTransition(element: HTMLElement, target: string) {
	if (getComputedStyle(element).transition !== target) {
		element.style.transition = target;
	}
}

function waitForStyleChange(
	element: HTMLElement,
	property: keyof CSSStyleDeclaration,
	target: string,
	callback: () => void
) {
	if (getComputedStyle(element)[property] === target) {
		callback();
	} else {
		requestAnimationFrame(() => {
			waitForStyleChange(element, property, target, callback);
		});
	}
}
