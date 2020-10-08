import React, { memo, FC } from 'react';
import styled from 'styled-components';
import Modal from '@material-ui/core/Modal';
import { useTranslation, Trans } from 'react-i18next';

import { headingH5CSS } from 'components/Typography/Heading';
import { bodyCSS } from 'components/Typography/General';
import { ButtonPrimary } from 'components/Button';
import { FlexDivCol, FlexDiv, ExternalLink } from 'shared/commonStyles';

import { ReactComponent as CloseIcon } from 'assets/images/close-cross.svg';
import { getContractType } from 'ducks/loans/contractInfo';
import { connect } from 'react-redux';

const TRANSLATION_KEY = 'loans.modal.loan-trial';
const sETH_BLOG_LINK = 'https://blog.synthetix.io/ether-collateral-second-trial/';
const sUSD_BLOG_LINK = 'https://blog.synthetix.io/ether-collateral-trial-susd/';

type LoanWarningModalProps = {
	onClose: () => void;
	onConfirm: () => void;
	isOpen: boolean;
	contractType: string;
};

const LoanWarningModal: FC<LoanWarningModalProps> = memo(
	({ isOpen, onClose, onConfirm, contractType }) => {
		const { t } = useTranslation();
		const BLOG_LINK = contractType === 'sETH' ? sETH_BLOG_LINK : sUSD_BLOG_LINK;
		return (
			<StyledModal open={isOpen}>
				<Container>
					<Dismissable>
						<StyledCloseButton onClick={onClose} />
					</Dismissable>
					<Heading>{t(`${TRANSLATION_KEY}.title`)}</Heading>
					<Content>
						<Trans
							i18nKey={`${TRANSLATION_KEY}.content`}
							values={{ blogLink: 'this blog post' }}
							components={[<StyledExternalLink href={BLOG_LINK} />]}
						/>
					</Content>
					<ButtonPrimary onClick={onConfirm}>{t(`${TRANSLATION_KEY}.button-label`)}</ButtonPrimary>
				</Container>
			</StyledModal>
		);
	}
);

const Dismissable = styled(FlexDiv)`
	width: 100%;
	justify-content: flex-end;
`;

const StyledCloseButton = styled(CloseIcon)`
	width: 10px;
	cursor: pointer;
	flex-shrink: 0;
`;

const Heading = styled.h5`
	${headingH5CSS};
	margin: 0;
`;

const StyledModal = styled(Modal)`
	display: flex;
	align-items: center;
	justify-content: center;
`;

const Container = styled(FlexDivCol)`
	outline: none;
	width: 478px;
	padding: 42px;
	align-items: center;
	background-color: ${(props) => props.theme.colors.surfaceL3};
`;

const Content = styled.p`
	${bodyCSS};
	text-align: center;
	margin: 16px 0 32px 0;
	color: ${(props) => props.theme.colors.fontSecondary};
`;

const StyledExternalLink = styled(ExternalLink)`
	text-decoration: underline;
	margin-left: 2px;
	color: ${(props) => props.theme.colors.hyperlink};
`;

const mapStateToProps = (state: any) => ({
	contractType: getContractType(state),
});

export default connect(mapStateToProps, null)(LoanWarningModal);
