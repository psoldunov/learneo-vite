import React, { useState, useEffect, useRef, useContext, Context } from 'react';
import DropdownIcon from './DropdownIcon';
import { FormState, NoticeFormState } from 'types';

interface Data {
	name: string;
	icon?: string;
}

type FormStateKey = keyof FormState;

interface DropdownProps {
	id: string;
	data: Data[];
	error?: boolean;
	formContext: Context<FormState | NoticeFormState>;
	errorDependency?: FormStateKey;
	multiple?: boolean;
	fullWidth?: boolean;
	required?: boolean;
	setError?: (error: boolean) => void;
}

function getDataItemId(name: string) {
	return name.toLowerCase().replace(/ /g, '-');
}

const Dropdown: React.FC<DropdownProps> = ({
	id,
	data,
	multiple = false,
	error = false,
	formContext,
	fullWidth = false,
	required = false,
	errorDependency,
	setError,
}) => {
	const { updateFormContext } = useContext(formContext);
	const context = useContext(formContext) as FormState;

	// TODO REMOVE REASON DEPENDENCY TO GENERIC DEPENDENCY

	const dependency = errorDependency ? context[errorDependency] : null;

	const [dropdownState, setDropdownState] = useState<{
		selected: string | string[];
		isOpen: boolean;
	}>({
		selected: multiple ? [] : '',
		isOpen: false,
	});

	const dropdownRef = useRef<HTMLDivElement>(null); // Use HTMLDivElement to match the div element

	// Function to handle outside clicks
	const handleClickOutside = (event: MouseEvent) => {
		if (
			dropdownRef.current &&
			!dropdownRef.current.contains(event.target as Node)
		) {
			setDropdownState((prevState) => ({
				...prevState,
				isOpen: false,
			}));
		}
	};

	useEffect(() => {
		// Add when the dropdown is open
		if (dropdownState.isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		// Cleanup function to remove the event listener
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [dropdownState.isOpen]); // Only re-run if isOpen changes

	useEffect(() => {
		// Call updateFormContext only when dropdownState.selected changes and is not empty
		if (dropdownState.selected.length > 0) {
			updateFormContext(id, dropdownState.selected);
			setError && setError(false);
			return;
		}
		if (dependency !== null) {
			setError && setError(true);
		}
	}, [setError, dropdownState.selected]);

	const handleInputChange = (itemName: string) => {
		setDropdownState((prevState) => {
			let newSelected;

			if (multiple) {
				const isSelected = (prevState.selected as string[]).includes(itemName);
				newSelected = isSelected
					? (prevState.selected as string[]).filter(
							(selectedItem) => selectedItem !== itemName
					  )
					: [...(prevState.selected as string[]), itemName];
			} else {
				newSelected = prevState.selected === itemName ? '' : itemName;
			}
			return {
				...prevState,
				selected: newSelected,
			};
		});
	};

	let selectedItem = !multiple
		? data.find((item) => item.name === (dropdownState.selected as string))
		: null;

	return (
		<div
			className={`legal_form_dropdown ${fullWidth && 'is-full-width'}`}
			id={`form-dropdown-${id}`}
			ref={dropdownRef}>
			<div
				className={`legal_form_dropdown_toggle ${error ? 'is-error' : ''}`}
				role='button'
				aria-haspopup='menu'
				id={`form-dropdown-toggle-${id}`}
				aria-expanded={dropdownState.isOpen}
				onClick={() => {
					setDropdownState((prevState) => ({
						...prevState,
						isOpen: !prevState.isOpen,
					}));
				}}>
				<div className='legal_form_dropdown_toggle_content'>
					{multiple &&
					Array.isArray(dropdownState.selected) &&
					dropdownState.selected.length > 0 ? (
						<span>{`${dropdownState.selected.length} items selected`}</span>
					) : (
						<>
							{selectedItem?.icon && (
								<img
									src={selectedItem.icon}
									alt={`${selectedItem.name} icon`}
								/>
							)}
							{selectedItem?.name || ''}
						</>
					)}
				</div>
				<DropdownIcon error={error} />
			</div>
			<div
				aria-hidden={!dropdownState.isOpen}
				aria-labelledby={`form-dropdown-toggle-${id}`}
				id={`form-dropdown-list-${id}`}
				className='legal_form_dropdown_list'
				style={dropdownState.isOpen ? { display: 'block' } : {}}>
				{data.map((item) => (
					<label
						key={getDataItemId(item.name)}
						className={`legal_form_dropdown_item ${
							(multiple &&
								Array.isArray(dropdownState.selected) &&
								dropdownState.selected.includes(item.name)) ||
							(!multiple && dropdownState.selected === item.name)
								? 'is-selected'
								: ''
						}`}
						id={getDataItemId(item.name)}>
						<input
							type={multiple ? 'checkbox' : 'radio'}
							name={id}
							value={item.name}
							required={multiple ? false : required}
							checked={
								Array.isArray(dropdownState.selected)
									? dropdownState.selected.includes(item.name)
									: dropdownState.selected === item.name
							}
							onChange={() => {
								handleInputChange(item.name);
							}}
							onFocus={() => {
								setDropdownState((prevState) => ({
									...prevState,
									isOpen: true,
								}));
							}}
							style={{ opacity: 0, position: 'absolute', zIndex: -1 }}
						/>
						{item.icon && <img src={item.icon} alt={`${item.name} icon`} />}
						{item.name}
					</label>
				))}
			</div>
		</div>
	);
};

export default Dropdown;
