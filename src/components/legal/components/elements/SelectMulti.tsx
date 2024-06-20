import { useEffect, useState, useRef } from 'react';
import { DropdownIcon } from '../icons';
import { ReportFormField, Violation, ReportUrlBlock } from 'types';

const makeSlug = (string: string) => {
	return string.toLowerCase().replace(/ /g, '-');
};

export default function SelectMulti({
	urls,
	url,
	field_id,
	data,
}: {
	urls: ReportFormField<ReportUrlBlock[]>;
	url: ReportUrlBlock;
	field_id: string;
	data: Violation[];
}) {
	const [isOpen, setIsOpen] = useState(false);

	const selected = url.privacy_types;

	const error = url.privacy_types_error;

	const setSelected = (value: string[]) => {
		urls.updateField({
			value: urls.value.map((block) =>
				block.id === url.id
					? { ...block, privacy_types: value, privacy_types_error: false }
					: block
			),
		});
	};

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
			className='legal_form_dropdown'
			id={`form-dropdown-${field_id}`}>
			<div
				className={'legal_form_dropdown_toggle' + (error ? ' is-error' : '')}
				role='button'
				aria-haspopup='menu'
				id={`form-dropdown-toggle-${field_id}`}
				aria-expanded={isOpen ? 'true' : 'false'}
				onClick={() => setIsOpen(!isOpen)}>
				<div className='legal_form_dropdown_toggle_content'>
					{selected.length === 0 ? '' : `${selected.length} items selected`}
				</div>
				<DropdownIcon error={error} />
			</div>
			<ul
				aria-hidden={!isOpen}
				aria-labelledby={`form-dropdown-toggle-${field_id}`}
				id={`form-dropdown-list-${field_id}`}
				aria-label={(isOpen ? 'Close' : 'Open') + ' dropdown'}
				className='legal_form_dropdown_list is-no-max'
				style={{ display: isOpen ? 'block' : 'none' }}>
				{data.map((item) => {
					return (
						<li key={`${makeSlug(item.name)}-${url.id}`}>
							<label className='legal_form_dropdown_item' id={item.name}>
								<input
									type='checkbox'
									name={field_id}
									style={{ opacity: 0, position: 'absolute', zIndex: '-1' }}
									value={item.name}
									onChange={(e) => {
										if (e.target.checked) {
											setSelected([...selected, e.target.value]);
										} else {
											setSelected(
												selected.filter((value) => value !== e.target.value)
											);
										}
									}}
									checked={selected.includes(item.name)}
								/>
								<div
									className={
										'legal_form_dropdown_item_checkbox' +
										(selected.includes(item.name) ? ' is-selected' : '')
									}></div>
								{item.name}
							</label>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
