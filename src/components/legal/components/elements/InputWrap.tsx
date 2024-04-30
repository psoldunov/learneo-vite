export default function InputWrap({
	title,
	children,
	field_id,
	required = false,
	type = 'div',
}: {
	title: string;
	children: React.ReactNode;
	required?: boolean;
	type?: 'div' | 'fieldset';
	field_id?: string;
}) {
	const Tag = type;
	return (
		<Tag>
			<div className='legal_form_input_block'>
				{type === 'div' ? (
					<label className='legal_form_input_label' htmlFor={field_id}>
						{title}
						{required && ' *'}
					</label>
				) : (
					<legend className='legal_form_input_label'>
						{title}
						{required && ' *'}
					</legend>
				)}
				{children}
			</div>
		</Tag>
	);
}
