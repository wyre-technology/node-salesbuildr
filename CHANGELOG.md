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
