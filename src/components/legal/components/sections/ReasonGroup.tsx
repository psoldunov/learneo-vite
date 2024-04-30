import React, { useState } from 'react';
import ReasonRadio from '@components/legal/components/elements/ReasonRadio';
import { Reason, ReportFormState } from 'types';

export default function ReasonGroup({
	data,
	field_id,
	context,
}: {
	data: Reason[];
	field_id: string;
	context: ReportFormState;
}) {
	const [selected, setSelected] = useState('');
	const [showAll, setShowAll] = useState(true);

	const { service, reason } = context;

	// Handler to reset the form
	const handleReset = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		setSelected('');
		setShowAll(true);
		reason.updateField({ value: '' });
		service.error && service.updateField({ error: false });
	};

	// Modify the onChange handler to hide other radio buttons upon selection
	const handleChange = (value: string) => {
		setSelected(value);
		setShowAll(false);
		reason.updateField({ value });

		if (!service.value) {
			service.updateField({ error: true });
		}
	};

	return (
		<>
			<div className='legal_form_reason-grid'>
				<div className='legal_form_reason-grid_column'>
					{data
						.slice(0, Math.ceil(data.length / 2))
						.map((item, index) =>
							showAll || selected === item.name ? (
								<ReasonRadio
									key={index}
									name={field_id}
									value={item.name}
									hint={item.sublabel}
									handleReset={handleReset}
									isChecked={selected === item.name}
									onChange={handleChange}
								/>
							) : null
						)}
				</div>
				<div className='legal_form_reason-grid_column'>
					{data
						.slice(Math.ceil(data.length / 2))
						.map((item, index) =>
							showAll || selected === item.name ? (
								<ReasonRadio
									key={index}
									name={field_id}
									value={item.name}
									hint={item.sublabel}
									handleReset={handleReset}
									required={true}
									isChecked={selected === item.name}
									onChange={handleChange}
								/>
							) : null
						)}
				</div>
			</div>
		</>
	);
}
