import { useEffect, useRef, useState } from 'react';
import { DropdownIcon } from '../icons';
import { ReportFormField } from 'types';

interface SelectData {
	name: string;
	icon?: string;
}

function updateToggleContent(value: string | string[], data: SelectData[]) {
	return data.map((item) => {
		if (item.name === value) {
			return (
				<div key={item.name}>
					{item.icon && <img src={item.icon} alt={`${item.name} icon`} />}
					{item.name}
				</div>
			);
		}
	});
}

export default function Select({
	field_id,
	data,
	field,
	fullWidth = false,
}: {
	field_id: string;
	data: SelectData[];
	field: ReportFormField<string>;
	fullWidth?: boolean;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const { value, required, error, updateField } = field;

	const selectRef = useRef<HTMLDivElement>(null);

	const handleClickOutside = (event: MouseEvent) => {
		if (
			selectRef.current &&
			!selectRef.current.contains(event.target as Node)
		) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	return (
		<div
			ref={selectRef}
			className={'legal_form_dropdown' + (fullWidth ? ' is-full-width' : '')}
			id={`form-dropdown-${field_id}`}>
			<button
				className={'legal_form_dropdown_toggle' + (error ? ' is-error' : '')}
				type='button'
				id={`form-dropdown-toggle-${field_id}`}
				aria-label={(isOpen ? 'Close' : 'Open') + ' dropdown'}
				onClick={() => setIsOpen(!isOpen)}
				aria-expanded={isOpen ? 'true' : 'false'}>
				<div className='legal_form_dropdown_toggle_content'>
					{updateToggleContent(value, data) || ''}
				</div>
				<DropdownIcon />
			</button>
			<ul
				aria-hidden={isOpen ? 'false' : 'true'}
				style={{ display: isOpen ? 'block' : 'none' }}
				aria-labelledby={`form-dropdown-toggle-${field_id}`}
				id={`form-dropdown-list-${field_id}`}
				className='legal_form_dropdown_list'>
				{data.map((item) => (
					<li key={item.name}>
						<label
							className={
								'legal_form_dropdown_item' +
								(value === item.name ? ' is-selected' : '')
							}
							id={item.name}
							onClick={() => {
								setIsOpen(false);
							}}>
							<input
								type='radio'
								name={field_id}
								required={required}
								style={{ opacity: 0, position: 'absolute', zIndex: '-1' }}
								value={item.name}
								onChange={() => {
									updateField({ value: item.name, error: false });
								}}
							/>
							{item.icon && <img src={item.icon} alt={`${item.name} icon`} />}
							{item.name}
						</label>
					</li>
				))}
			</ul>
		</div>
	);
}
