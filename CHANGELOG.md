# Changelog

## [3.2.4] (2023-04-13)
- **Deprecated the module**, so this is the last version.
  Please import `npm:nunjucks@VERSION_NUMBER` instead.
- Ported the upstream version 3.2.4
  - HTML encode backslashes when expressions are passed through the escape
    filter (including when this is done automatically with autoescape). Merge
    of [#1427](https://github.com/mozilla/nunjucks/pull/1427).
- Improved type declarations
- Updated dependencies

## [3.2.3-2] (2022-11-03)
- Removed unsupported options from type declarations

## [3.2.3-1] (2022-11-03)
- Added type declarations
- Updated the `std` dependency

## [3.2.3] (2021-06-06)
- Initial release of this port

[3.2.4]: https://github.com/valtlai/nunjucks-deno/compare/3.2.3-2...3.2.4
[3.2.3-2]: https://github.com/valtlai/nunjucks-deno/compare/3.2.3-1...3.2.3-2
[3.2.3-1]: https://github.com/valtlai/nunjucks-deno/compare/3.2.3...3.2.3-1
[3.2.3]: https://github.com/valtlai/nunjucks-deno/releases/tag/3.2.3
