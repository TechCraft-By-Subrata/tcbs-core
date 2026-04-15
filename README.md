# @tcbs/core

![npm](https://img.shields.io/npm/v/@tcbs/core)
![downloads](https://img.shields.io/npm/dw/@tcbs/core)
![license](https://img.shields.io/npm/l/@tcbs/core)
[
  ![Docs](https://img.shields.io/badge/docs-UI%20Docs-blue?logo=readthedocs&logoColor=white&style=flat-square)
](https://tcbscli.subraatakumar.com/core/)

Core contracts and architecture primitives for TCBS layered applications.

`@tcbs/core` is the contract-first foundation of the TCBS package ecosystem.
It is intentionally storage-agnostic and UI-agnostic, so your features remain portable across adapters such as Realm.

## Table of Contents

- Why This Package Exists
- Package Status
- Requirements
- Installation
- Quick Start
- Tutorial: Build Feature Contracts
- How Other TCBS Packages Use Core
- Best Practices
- Production Checklist
- Troubleshooting
- Credits
- Support

## Why This Package Exists

Most app codebases degrade when layers start leaking into each other.

This package prevents that by centralizing:

- domain-friendly repository contracts
- common query primitives
- adapter lifecycle contracts

Use this package to keep Module and App layers independent from the underlying data engine.

## Package Status

Current version (`0.1.x`) provides:

- `EntityId`
- `QueryOptions`
- `Repository<T, TId>`
- `DataAdapter` lifecycle interface

Future versions are expected to add:

- richer query contracts
- transaction boundaries
- event hooks and instrumentation helpers

## Requirements

- Node.js `>=18`
- TypeScript recommended for stronger contract ergonomics

## Installation

```bash
npm i @tcbs/core
```

## Quick Start

Define a feature repository contract once and keep implementation details out of UI/business code.

```ts
import type { Repository } from "@tcbs/core";

export type JournalEntry = {
	id: string;
	mood: string;
	note: string;
	createdAt: string;
};

export type JournalRepository = Repository<JournalEntry, string>;
```

Then implement this contract in any adapter package or app-side data layer.

## Tutorial: Build Feature Contracts

### Step 1: Create domain model and repository contract

```ts
import type { Repository } from "@tcbs/core";

export type CycleLog = {
	id: string;
	phase: string;
	symptoms: string[];
	loggedAt: string;
};

export type CycleLogRepository = Repository<CycleLog, string>;
```

### Step 2: Consume contract in service layer (not storage-specific code)

```ts
export class CycleService {
	constructor(private readonly repo: CycleLogRepository) {}

	async listRecent(limit = 20): Promise<CycleLog[]> {
		return this.repo.list({ limit, offset: 0, sortBy: "loggedAt", sortDirection: "desc" });
	}
}
```

### Step 3: Wire adapter implementation in composition root

```ts
import { RealmDataAdapter } from "@tcbs/data-realm";

const adapter = new RealmDataAdapter({ path: "default.realm", schemaVersion: 1 });
await adapter.connect();

// Construct repositories that satisfy @tcbs/core contracts.
// Inject them into services/modules.
```

This separation lets you swap adapters without rewriting feature logic.

## How Other TCBS Packages Use Core

- `@tcbs/data-realm` implements data access while conforming to core contracts.
- `@tcbs/realm-inspector` works as a development tool around the same data boundaries.
- app modules depend on contracts from core, not direct data SDKs.

## Best Practices

1. Keep all feature contracts in or aligned with `@tcbs/core` abstractions.
2. Do not return adapter-native objects (for example Realm objects) from repository contracts.
3. Keep `Repository` methods predictable and side-effect free outside persistence concerns.
4. Keep sorting/pagination explicit through `QueryOptions`.
5. Use dependency injection at bootstrap/composition root.
6. Make app services depend only on contracts, never on concrete adapter classes.

## Production Checklist

- [ ] No direct storage SDK usage in App/Module layers
- [ ] Repository contracts defined per feature
- [ ] Adapter lifecycle managed centrally (`connect` and `disconnect`)
- [ ] Query options documented and used consistently
- [ ] Unit tests mock repository contracts (not storage SDK)

## Troubleshooting

### Contracts feel too generic

Create feature-specific repository aliases using `Repository<T, TId>` and keep those types in your domain modules.

### Service code still depends on adapter details

Move adapter-specific logic into data-layer implementation classes and keep service constructors typed by contracts only.

## Credits

Key ecosystem references:

- [`@tcbs/data-realm`](https://www.npmjs.com/package/@tcbs/data-realm)
- [`realm`](https://www.npmjs.com/package/realm)

## Support

If this package is useful in your architecture:

1. Star the repository.
2. Open issues for missing contract patterns.
3. Contribute examples and tests from real-world usage.

Reliable architecture tooling gets better with real project feedback.
