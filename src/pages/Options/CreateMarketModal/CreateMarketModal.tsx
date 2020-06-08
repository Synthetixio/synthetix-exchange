import React, { memo, FC } from 'react';
import Modal from '@material-ui/core/Modal';
import ROUTES, { navigateTo } from 'constants/routes';

export const CreateMarketModal: FC = memo(() => (
	<Modal open={true} onClose={() => navigateTo(ROUTES.Options.Home)}>
		<span>Create market modals</span>
	</Modal>
));

export default CreateMarketModal;
