import React from 'react';

export default function DropdownIcon({ error }: { error?: boolean }) {
	return (
		<svg
			width='12'
			height='6'
			viewBox='0 0 12 6'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'>
			<path
				d='M0.724264 0H11.2757C11.543 0 11.6769 0.323143 11.4879 0.512132L6.21213 5.78787C6.09497 5.90503 5.90503 5.90503 5.78787 5.78787L0.512132 0.512132C0.323143 0.323143 0.456993 0 0.724264 0Z'
				fill={error ? '#ff0301' : '#CBCBCB'}></path>
		</svg>
	);
}
