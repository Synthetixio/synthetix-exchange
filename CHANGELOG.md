# Changelog

## 2 April 2020 (Graphite Release)

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
