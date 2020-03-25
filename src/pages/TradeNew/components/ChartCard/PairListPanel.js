import React, { useState } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { getSynthPair } from 'src/ducks/synths';
import { setPairListDropdownIsOpen, getPairListDropdownIsOpen } from 'src/ducks/ui';

import DropdownPanel from 'src/components/DropdownPanel';
import Currency from 'src/components/Currency';
import { SearchInput } from 'src/components/Input';

const DEFAULT_SEARCH = '';

const PairListPanel = ({
	synthPair: { base, quote },
	pairListDropdownIsOpen,
	setPairListDropdownIsOpen,
}) => {
	const [search, setSearch] = useState(DEFAULT_SEARCH);
	return (
		<DropdownPanel
			isOpen={pairListDropdownIsOpen}
			onHeaderClick={() => setPairListDropdownIsOpen(!pairListDropdownIsOpen)}
			header={
				<Currency.Pair baseCurrencyKey={base.name} quoteCurrencyKey={quote.name} showIcon={true} />
			}
			body={
				<PairListContainer>
					<SearchInput value={search} onChange={e => setSearch(e.target.value)} />
				</PairListContainer>
			}
		></DropdownPanel>
	);
};

const PairListContainer = styled.div``;

const mapStateToProps = state => ({
	synthPair: getSynthPair(state),
	pairListDropdownIsOpen: getPairListDropdownIsOpen(state),
});

const mapDispatchToProps = {
	setPairListDropdownIsOpen,
};

export default connect(mapStateToProps, mapDispatchToProps)(PairListPanel);
