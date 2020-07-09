# Changelog

## 10 July 2020 (Muscovite release)

### Added

- Added COMP, LEND, KNC and REN to binary options.
- Filtering for binary option markets (by phase, markets you've bid on, and market creator) + the ability to search within each filter.
- Added current price/final price for binary options.
- Integrated Portis wallet

### Changed

- Numerous UI improvements and bug fixes for binary options.
- Lazy load all pages for faster load time.
- Reworked the wallet popup/gwei popup to use the new modal component.

## 30 June 2020 (Acrux release)

### Added

- **Binary options**

## 4 June 2020 (Halite release)

### Added

- **Synths overview page**

### Changed

- Show correct network fees on the Create Order Card.
- Remove usage of getExchangeFeeRate via FeePool.

## 21 May 2020 (Sulfur release)

### Added

- **Market selection advanced search**.
- Added a "max balance" click on the balance label (Create order card).
- Added a market pairs dropdown on the trade button (Assets page).
- Added missing translation keys for the English translation.

### Changed:

- Refactored markets logic to always be on the market with the largest liquidity.
- Refactored/redesigned the user info section in the app bar.
- Switched to using hash router to support IPFS.
- Switched to using @synthetixio/assets for synths SVGs.

## 14 May 2020 (Gypsum release)

### Added

- **Added Synths page.**
- 🔥 **Adopted TypeScript. (slowly migrating all our JS files)** 🔥
- Added "Synth is frozen" indication on the Create Order Card.
- Added "No results" message for open orders tab.
- Added subtle price animation for when the rate changes (the price underneath the Price Chart).

### Changed:

- **Switched off google analytics.**
- Fixed sorting on all our tables (numeric sorting wasn't working well).
- Draw the price chart from left -> right.
- Fix frozen synths logic.
- Fix symbol rendering on iOS (safari).
- Lazy load MyTrades/AllTrades.
- Add missing price/amount fields from All Trades.
- Fixed a bug that caused the price chart to fallback to sBTC/sUSD at certain conditions.
- Fixed a bug that caused the price chart to not resize properly.
- Removed unused components.
- Removed unneeded page scroll on the Trade page.

## 2 April 2020 (Graphite release)

### Added

- Markets page
- Assets page (overview + exchanges)
- Wallet menu (App header)
- New crypto synths added:

* sADA / iADA
* sBCH / iBCH
* sDASH / iDASH
* sEOS / iEOS
* sETC / iETC
* sXMR / iXMR

- New commodity synth added:

* sBZ

- New equity synths added:

* sFTSE
* sNikkei

### Changed:

- 🔥 **Refactor trade view** 🔥
- Disabled loan creation
- Significantly enhanced the performance of loading markets data
- Friendlier URLs - trade/?base=sBTC&quote=sUSD -> trade/sBTC-sUSD
- Trade/Loans/Assets pages are stretched 100%

### Changed:

- Reduced the number of requests by using the SynthSummaryUtil contract.
- Delisted MKR.
- Inlined SVG/images/English translation file for better performance.
- Changed "interest rate" -> "interest fee" on the loans page.
- Fixed a bug on the trade card (Trade All balance).
- Fixed a bug with the Gwei popup slider tooltip.a
- Fixed "networkName" typo in the redux store.
- Removed font-awesome (unused dependency).
- Support absolute "pretty" file imports.
- Ensure snxJSConnector is initialzied before app rendering.
- Introduced redux-saga for handling async events.
- Introduced redux-toolkit for better developer experience.
- Refactored currency rendering across the app (icons, names, pairs).

## 12 March 2020

### Added

- Redesigned the app header (+responsive).
- Added splash page (+responsive).
- Added "View contract" link to the loans page.
- Wallet balance refresh when opening/closing a loan and when exchanging synths.

### Changed:

- Reduced the number of requests by using the SynthSummaryUtil contract.
- Delisted MKR.
- Inlined SVG/images/English translation file for better performance.
- Changed "interest rate" -> "interest fee" on the loans page.
- Fixed a bug on the trade card (Trade All balance).
- Fixed a bug with the Gwei popup slider tooltip.
- Fixed "networkName" typo in the redux store.
- Removed font-awesome (unused dependency).
- Support absolute "pretty" file imports.
- Ensure snxJSConnector is initialzied before app rendering.
- Introduced redux-saga for handling async events.
- Introduced redux-toolkit for better developer experience.
- Refactored currency rendering across the app (icons, names, pairs).
