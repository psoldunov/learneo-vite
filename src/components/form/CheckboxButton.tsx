import React, { useContext, useState, Context } from 'react';
import { FormState, NoticeFormState } from 'types';

export default function CheckboxButton({
	name,
	value,
	sublabel,
	formContext,
	required = false,
	onChange,
}: {
	name: string;
	value: string;
	sublabel?: string;
	formContext: Context<FormState | NoticeFormState>;
	required?: boolean;
	onChange?: (value: boolean) => void;
}) {
	const [isChecked, setIsChecked] = useState(false);
	const { updateFormContext } = useContext(formContext) as
		| FormState
		| NoticeFormState;
	return (
		<label className='legal_form_checkbox'>
			<div
				className={`legal_form_checkbox-button ${
					isChecked ? 'is-checked' : ''
				}`}></div>
			<input
				id={name}
				type='checkbox'
				name={name}
				style={{ opacity: 0, position: 'absolute', zIndex: -1 }}
				checked={isChecked}
				required={required}
				onChange={() => {
					setIsChecked(!isChecked);
					updateFormContext(name, !isChecked);
					if (onChange) {
						onChange(!isChecked);
					}
				}}
			/>
			<span className='legal_form_input_label' style={{ cursor: 'pointer' }}>
				{value}
			</span>
			{sublabel && <div className='legal_form_input_sublabel'>{sublabel}</div>}
		</label>
	);
}
