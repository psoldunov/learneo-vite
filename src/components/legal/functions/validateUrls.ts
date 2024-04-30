import { ReportFormField, ReportUrlBlock } from 'types';
import { isEqual } from 'lodash';

export default function validateUrls(
	urls: ReportFormField<ReportUrlBlock[]>
): boolean {
	const { value, updateField, path_required, privacy_types_required } = urls;

	let valid = true;

	const updatedBlocks = value.map((block) => {
		const currentBlock = {
			id: block.id,
			privacy_types: block.privacy_types,
			path: block.path,
			detail: block.detail,
			detail_required: block.detail_required,
			path_error: false,
			detail_error: false,
			privacy_types_error: false,
			path_error_message: '',
			detail_error_message: '',
		};

		if (path_required && !block.path) {
			valid = false;
			currentBlock.path_error = true;
		}

		if (block.detail_required && !block.detail) {
			valid = false;
			currentBlock.detail_error = true;
		}

		if (privacy_types_required && block.privacy_types.length === 0) {
			valid = false;
			currentBlock.privacy_types_error = true;
		}

		return currentBlock;
	});

	if (!isEqual(updatedBlocks, value)) {
		updateField({ value: updatedBlocks });
	}

	return valid;
}
