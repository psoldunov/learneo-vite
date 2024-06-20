import React from 'react';

export default function RadioButton({
	name,
	value,
	sublabel,
	isChecked,
	required = false,
	handleReset,
	onChange,
}: {
	name: string;
	value: string;
	sublabel?: string;
	isChecked: boolean;
	required?: boolean;
	handleReset?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	onChange: (value: string) => void;
}) {
	return (
		<label className='legal_form_radio'>
			<div
				className={`legal_form_radio-button ${
					isChecked ? 'is-checked' : ''
				}`}></div>
			<input
				id={value.toLowerCase().replace(/ /g, '-')}
				type='radio'
				name={name}
				style={{ opacity: 0, position: 'absolute', zIndex: -1 }}
				value={value}
				checked={isChecked}
				required={required}
				onChange={() => onChange(value)}
			/>
			<span className='legal_form_input_label' style={{ cursor: 'pointer' }}>
				{value}
				{isChecked && handleReset && (
					<button className='legal_form_radios-reset' onClick={handleReset}>
						{` (change ${name.toLowerCase()})`}
					</button>
				)}
			</span>
			{sublabel && <div className='legal_form_input_sublabel'>{sublabel}</div>}
		</label>
	);
}
