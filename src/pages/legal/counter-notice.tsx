import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import DisputeForm from '@components/legal/DisputeForm';
import DisputeFormProvider from '@components/legal/context/providers/DisputeFormProvider';

export default function CounterNoticePage() {
	document.addEventListener('DOMContentLoaded', () => {
		const rootElement = document.querySelector('.legal_form_app');
		if (rootElement) {
			const root = createRoot(rootElement); // Create a root.
			root.render(
				<StrictMode>
					<DisputeFormProvider>
						<DisputeForm type='counter' />
					</DisputeFormProvider>
				</StrictMode>
			); // Initial render
		}
	});
}
