import React from 'react';

export default function FormBlock({
	title,
	children,
}: {
	title?: string;
	children: React.ReactNode;
}) {
	return (
		<div className='legal_form_padding-block'>
			{title && <h2 className='legal_form_block-heading'>{title}</h2>}
			{children}
		</div>
	);
}
