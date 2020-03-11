# Changelog

## 12 March 2019

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
