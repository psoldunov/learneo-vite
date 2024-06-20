import { useEffect, useState } from 'react';
import {
	getPrivacyViolations,
	getBusinesses,
} from '@functions/data/dataHelpers';
import { ReportFormState, ReportUrlBlock } from 'types';
import FormSection from '../elements/FormSection';
import SelectMulti from '../elements/SelectMulti';
import InputWrap from '../elements/InputWrap';
import FieldError from '../elements/FieldError';
import { v4 as uuidv4 } from 'uuid';
import { isEqual } from 'lodash';

export default function ReportedContent({
	context,
}: {
	context: ReportFormState;
}) {
	const { reason, service, urls } = context;
	const allBusinesses = getBusinesses();
	const [detailTitle, setDetailTitle] = useState(
		'Please provide any additional information to assist in locating and identifying the reported content'
	);

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
					privacy_types: [],
					path: '',
					detail: '',
					detail_required:
						reason.value === 'Copyright; other IP Infringement' ? true : false,
					path_error: false,
					detail_error: false,
					privacy_types_error: false,
					path_error_message: '',
					detail_error_message: '',
				},
			],
		});
	};

	const validateDetailsAndUpdateState = (
		inputValue: string,
		block: ReportUrlBlock
	) => {
		if (inputValue.length === 500) {
			urls.updateField({
				value: urls.value.map((currentBlock) => {
					if (currentBlock.id === block.id) {
						return {
							...currentBlock,
							detail: inputValue,
							detail_error: true,
							detail_error_message: 'Maximum length of 500 characters reached.',
						};
					}
					return currentBlock;
				}),
			});
		} else {
			urls.updateField({
				value: urls.value.map((currentBlock) => {
					if (currentBlock.id === block.id) {
						return {
							...currentBlock,
							detail: inputValue,
							detail_error: false,
							detail_error_message: '',
						};
					}
					return currentBlock;
				}),
			});
		}
	};

	const validateUrlAndUpdateState = (
		inputValue: string,
		block: ReportUrlBlock
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

	useEffect(() => {
		if (reason.value !== 'Privacy Violations') return;
		const updatedBlocks = urls.value.map((block) => {
			if (block.privacy_types.includes('Other')) {
				return {
					...block,
					detail_required: true,
				};
			}
			return { ...block, detail_required: false };
		});

		if (!isEqual(updatedBlocks, urls.value)) {
			urls.updateField({ value: updatedBlocks });
		}
	}, [urls.value]);

	useEffect(() => {
		if (reason.value === 'Privacy Violations') {
			urls.updateField({
				privacy_types_required: true,
			});
		} else {
			urls.updateField({
				privacy_types_required: false,
			});
		}

		if (reason.value === 'Copyright; other IP Infringement') {
			// urls.updateField({
			// 	detail_required: true,
			// });
			urls.updateField({
				value: urls.value.map((block) => {
					return {
						...block,
						detail_required: true,
					};
				}),
			});

			setDetailTitle(
				'Please provide any additional information to assist in locating and identifying the reported content'
			);
		} else {
			// urls.updateField({
			// 	detail_required: false,
			// });

			urls.updateField({
				value: urls.value.map((block) => {
					return {
						...block,
						detail_required: false,
					};
				}),
			});
			setDetailTitle(
				'Please provide any additional information to assist in locating and identifying the reported content'
			);
		}
	}, [reason.value]);

	return (
		<FormSection title='Reported Content'>
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
					{reason.value === 'Privacy Violations' ? (
						<InputWrap
							title='Please indicate the type of privacy violation you are reporting'
							field_id={`privacy_types_url_${block.id}`}
							type='fieldset'
							required={urls.privacy_types_required}>
							<SelectMulti
								urls={urls}
								url={block}
								field_id={`privacy_types_url_${block.id}`}
								data={getPrivacyViolations()}
							/>
						</InputWrap>
					) : null}
					<InputWrap
						title='Provide the URL of content you would like to report'
						field_id={`path_url_${block.id}`}
						required={urls.path_required}>
						<input
							type='url'
							id={`path_url_${block.id}`}
							name={`path_url_${block.id}`}
							value={block.path}
							onChange={(e) => {
								validateUrlAndUpdateState(e.target.value, block);
							}}
							className={
								'legal_form_input' + (block.path_error ? ' is-error' : '')
							}
							required={urls.path_required}
							placeholder={getPlaceholder()}
						/>
						<FieldError
							errorText={block.path_error_message}
							error={block.path_error}
						/>
					</InputWrap>
					<InputWrap
						title={detailTitle}
						field_id={`detail_url_${block.id}`}
						required={block.detail_required}>
						<textarea
							id={`detail_url_${block.id}`}
							value={block.detail}
							onChange={(e) => {
								validateDetailsAndUpdateState(e.target.value, block);
							}}
							maxLength={500}
							name={`detail_url_${block.id}`}
							className={
								'legal_form_input' + (block.detail_error ? ' is-error' : '')
							}
							required={block.detail_required}
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
		</FormSection>
	);
}
