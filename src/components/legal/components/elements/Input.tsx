import { ReportFormField } from 'types';

export default function Input({
	field_id,
	type,
	field,
	maxLength,
}: {
	field_id: string;
	type: 'text' | 'email' | 'tel';
	field: ReportFormField<string>;
	maxLength?: number;
}) {
	const { value, required, disabled, error, updateField } = field;
	return (
		<input
			className={'legal_form_input' + (error ? ' is-error' : '')}
			id={field_id}
			type={type}
			name={field_id}
			value={value}
			disabled={disabled}
			required={required}
			maxLength={maxLength}
			onChange={(e) => updateField({ value: e.target.value, error: false })}
		/>
	);
}
