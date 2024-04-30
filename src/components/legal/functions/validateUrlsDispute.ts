import { DisputeFormField, DisputeFormUrl } from 'types';
import { isEqual } from 'lodash';

export default function validateUrlsDispute(
	urls: DisputeFormField<DisputeFormUrl[]>
): boolean {
	const { value, updateField, path_required, detail_required } = urls;

	let valid = true;

	const updatedBlocks = value.map((block) => {
		const currentBlock = {
			id: block.id,
			path: block.path,
			detail: block.detail,
			path_error: false,
			detail_error: false,
			detail_error_message: '',
			path_error_message: '',
		};

		if (path_required && !block.path) {
			valid = false;
			currentBlock.path_error = true;
		}

		if (detail_required && !block.detail) {
			valid = false;
			currentBlock.detail_error = true;
		}

		return currentBlock;
	});

	if (!isEqual(updatedBlocks, value)) {
		updateField({ value: updatedBlocks });
	}

	return valid;
}
