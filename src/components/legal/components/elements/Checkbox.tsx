import React, { useEffect, useState } from 'react';
import { ReportFormField } from 'types';

export default function Checkbox({
	field_id,
	title,
	hint,
	field,
}: {
	field_id: string;
	title: string;
	hint?: string;
	field: ReportFormField<boolean>;
}) {
	const [isChecked, setIsChecked] = useState(false);
	const { value, required, updateField, error } = field;

	useEffect(() => {
		setIsChecked(value);
	}, [value]);

	return (
		<label className='legal_form_checkbox'>
			<div
				className={
					'legal_form_checkbox-button' +
					(isChecked ? ' is-checked' : '') +
					(error ? ' is-error' : '')
				}></div>
			<input
				id={field_id}
				type='checkbox'
				name={field_id}
				style={{ opacity: 0, position: 'absolute', zIndex: -1 }}
				checked={isChecked}
				required={required}
				onChange={() => {
					setIsChecked(!isChecked);
					updateField({ value: !isChecked });
					updateField({ error: false });
				}}
			/>
			<span className='legal_form_input_label' style={{ cursor: 'pointer' }}>
				{title}
			</span>
			{hint && <div className='legal_form_input_sublabel'>{hint}</div>}
		</label>
	);
}
