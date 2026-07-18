## [1.0.2](https://github.com/wyre-technology/node-salesbuildr/compare/v1.0.1...v1.0.2) (2026-07-18)


### Bug Fixes

* read HTTP response bodies exactly once ([#27](https://github.com/wyre-technology/node-salesbuildr/issues/27)) ([157e7f8](https://github.com/wyre-technology/node-salesbuildr/commit/157e7f867db1ee862777a3e6e6088e2a8fad5ad6)), closes [wyre-technology/node-connectwise-automate#54](https://github.com/wyre-technology/node-connectwise-automate/issues/54) [connectwise-automate-mcp#54](https://github.com/connectwise-automate-mcp/issues/54)

## [1.0.1](https://github.com/wyre-technology/node-salesbuildr/compare/v1.0.0...v1.0.1) (2026-03-02)


### Bug Fixes

* correct resource URL paths from plural to singular ([#30](https://github.com/wyre-technology/node-salesbuildr/issues/30)) ([466b476](https://github.com/wyre-technology/node-salesbuildr/commit/466b476103b353419feea715ee10694c1acf8537))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Corrected all resource URL paths from plural to singular form to match the SalesBuildr API (`/companies` → `/company`, `/contacts` → `/contact`, `/products` → `/product`, `/opportunities` → `/opportunity`, `/quotes` → `/quote`). Plural paths were returning 404 errors. Fixes [#30](https://github.com/wyre-technology/node-salesbuildr/issues/30).

## [1.0.0] - 2026-02-25

### Added

- Initial SalesBuildr API client library with support for companies, contacts, products, opportunities, and quotes resources.

### Fixed

- Add `--passWithNoTests` flag to vitest to unblock CI.

[unreleased]: https://github.com/wyre-technology/node-salesbuildr/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/wyre-technology/node-salesbuildr/releases/tag/v1.0.0
