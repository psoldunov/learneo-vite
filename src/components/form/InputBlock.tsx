import React from 'react';

export default function InputBlock({
	label,
	children,
	id,
	required = false,
	type = 'div',
}: {
	label: string;
	children: React.ReactNode;
	required?: boolean;
	type?: 'div' | 'fieldset';
	id?: string;
}) {
	const Tag = type;
	return (
		<Tag>
			<div className='legal_form_input_block'>
				{type === 'div' ? (
					<label className='legal_form_input_label' htmlFor={id}>
						{label}
						{required && ' *'}
					</label>
				) : (
					<legend className='legal_form_input_label'>
						{label}
						{required && ' *'}
					</legend>
				)}
				{children}
			</div>
		</Tag>
	);
}
