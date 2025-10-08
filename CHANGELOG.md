# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-08

### Added

- Core Logic: Initial implementation of `createSignalContext` featuring a granular subscription model based on `useSyncExternalStore`.
- Selective Re-rendering: Components now only re-render when the specific slice of state they subscribe to changes.
- Testing: Comprehensive unit tests to validate re-render behavior.
- Example App: A fully functional example application to demonstrate usage and performance benefits.
- Performance Benchmark: A dedicated benchmark component comparing `react-signal-context` against the native `React.Context` to visually prove performance gains.
- Developer Experience: Integration with React DevTools via `useDebugValue` for easier debugging.
- Documentation: A detailed `README.md` explaining the philosophy, API, and best practices.
- Continuous Integration: A GitHub Actions workflow to automatically build and test the project on every push and pull request.

### Fixed

- Build Process: Resolved issues with JSX syntax in `.ts` files by renaming them to `.tsx`.
- API Stability: Refactored the internal `Store` API to be more robust, fixing several runtime errors in the example app.
- Benchmark Reliability: Corrected multiple bugs in the benchmark component to ensure accurate and stable performance testing.
- `useSyncExternalStore`: Fixed a critical bug where updates were not being triggered by correctly providing all required arguments to the hook.

### Changed

- Project Positioning: Updated the project's messaging to clarify its role as a performant state management tool with a familiar API, respecting the use of React Context for Dependency Injection.
- API Design: The internal `Store` class now has a public `setState` method for more advanced use cases and easier testing.

## [Unreleased]

### Planned

- Additional examples and use cases
- Performance optimizations
- Extended documentation

---

[unreleased]: https://github.com/username/react-signal-context/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/username/react-signal-context/releases/tag/v1.0.0