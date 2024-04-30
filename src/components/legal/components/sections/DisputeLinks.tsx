import { getBusinesses } from '@functions/data/dataHelpers';
import { DisputeFormState, DisputeFormUrl } from 'types';
import InputWrap from '../elements/InputWrap';
import FieldError from '../elements/FieldError';
import { v4 as uuidv4 } from 'uuid';

export default function DisputeLink({
	context,
}: {
	context: DisputeFormState;
}) {
	const { service, urls } = context;
	const allBusinesses = getBusinesses();

	const removeBlock = (idToRemove: string) => {
		urls.updateField({
			value: urls.value.filter((block) => block.id !== idToRemove),
		});
	};

	const getPlaceholder = () => {
		const business = allBusinesses.find(
			(business) => business.name === service.value
		);

		return business ? business.url : '';
	};

	const addBlock = () => {
		urls.updateField({
			value: [
				...urls.value,
				{
					id: uuidv4(),
					path: '',
					detail: '',
					path_error: false,
					detail_error: false,
					path_error_message: '',
					detail_error_message: '',
				},
			],
		});
	};

	const validateUrlAndUpdateState = (
		inputValue: string,
		block: DisputeFormUrl
	) => {
		const business = allBusinesses.find(
			(business) => business.name === service.value
		);
		const businessDomain = business
			? business.url.replace('https://www.', '').replace(/\/$/, '')
			: '';

		let isValidUrl = false;
		let urlContainsDomain = false;
		let isAlreadyReported = false;
		let multipleHttps = false;
		let hasSpaces = false;

		try {
			const url = new URL(inputValue);
			const matches = inputValue.match(/https/g);

			isValidUrl = true;
			urlContainsDomain = url.host.includes(businessDomain);
			isAlreadyReported = urls.value.some((block) => block.path === inputValue);
			multipleHttps = matches ? matches.length > 1 : false;
			hasSpaces = inputValue.includes(' ');
		} catch (error) {
			console.log('Error parsing URL');
		}

		const updatedBlocks = urls.value.map((currentBlock) => {
			if (currentBlock.id === block.id) {
				if (inputValue !== '') {
					return {
						...block,
						path: inputValue,
						path_error:
							!isValidUrl ||
							!urlContainsDomain ||
							isAlreadyReported ||
							multipleHttps ||
							hasSpaces,
						path_error_message: !isValidUrl
							? 'Invalid URL format.'
							: multipleHttps
							? 'Invalid URL format.'
							: hasSpaces
							? 'Invalid URL format.'
							: !urlContainsDomain
							? "This URL does not match the Learneo service you selected. If you'd like to report content for an additional service, please submit a separate report."
							: isAlreadyReported
							? 'This URL has already been included in your report.'
							: '',
					};
				} else {
					return {
						...block,
						path: inputValue,
						path_error: false,
						path_error_message: '',
					};
				}
			}
			return currentBlock;
		});

		urls.updateField({ value: updatedBlocks });
	};

	return (
		<>
			{urls.value.map((block, index) => (
				<div
					key={block.id}
					className='legal_form_repeater-item'
					id={`url-item-${block.id}`}>
					<h3 className='legal_form_h3'>
						Item {index + 1}{' '}
						{urls.value.length > 1 && (
							<button
								type='button'
								className='legal_form_radios-reset'
								onClick={() => {
									removeBlock(block.id);
								}}>
								(remove)
							</button>
						)}
					</h3>
					{service.value ? (
						<InputWrap
							title='Provide the URL of content you would like to report'
							field_id={`path_url_${block.id}`}
							required={urls.path_required}>
							<input
								type='url'
								id={`path_url_${block.id}`}
								name={`path_url_${block.id}`}
								onChange={(e) => {
									validateUrlAndUpdateState(e.target.value, block);
								}}
								className={
									'legal_form_input' + (block.path_error ? ' is-error' : '')
								}
								required={urls.path_required}
								value={block.path}
								placeholder={getPlaceholder()}
							/>
							<FieldError
								errorText={block.path_error_message}
								error={block.path_error}
							/>
						</InputWrap>
					) : null}
					<InputWrap
						title='Please provide the reason you are requesting to counter our decision'
						field_id={`detail_url_${block.id}`}
						required={urls.detail_required}>
						<textarea
							id={`detail_url_${block.id}`}
							onChange={(e) => {
								urls.updateField({
									value: urls.value.map((currentBlock) => {
										if (currentBlock.id === block.id) {
											return {
												...block,
												detail: e.target.value,
											};
										}
										return currentBlock;
									}),
								});
							}}
							maxLength={500}
							name={`detail_url_${block.id}`}
							value={block.detail}
							className={
								'legal_form_input' + (block.detail_error ? ' is-error' : '')
							}
							required={urls.detail_required}
						/>
						<FieldError
							error={block.detail_error}
							errorText={block.detail_error_message}
						/>
					</InputWrap>
				</div>
			))}

			<button
				className='legal_form_button'
				type='button'
				onClick={() => {
					addBlock();
				}}>
				+ Add Another Item
			</button>
		</>
	);
}
