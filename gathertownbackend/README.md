# Turborepo Starter



## Getting Started

Run the following command:

```sh
npx create-turbo@latest
```

## What's Inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

* `api`: an Express.js app
* `@repo/db`: a Prisma ORM setup with PostgreSQL
* `@repo/ui`: a stub React component library
* `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
* `@repo/typescript-config`: `tsconfig.json` configurations used throughout the monorepo

> Each package/app is 100% TypeScript.

### Utilities

This Turborepo has some additional tools already set up for you:

* TypeScript for static type checking
* ESLint for code linting
* Prettier for code formatting

## Usage

### Build

To build all apps and packages, run the following command:

```sh
cd meta 
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```sh
cd meta 
pnpm dev
```

## Module System Configuration

### TypeScript & Module Support

Our current setup is **defaulted to CommonJS (CJS)**, but we support **ES Modules (ESM)** and **TypeScript definitions (DTS)** as needed.

* By default, the `api` and other packages are set up to use CJS
* We can switch to ESM if necessary, and TypeScript definitions are automatically generated
* You can update the build configuration to include ESM support as well

### ESM & CJS Configuration

If you need to support both ESM and CJS, here's how you can configure the `tsup` and `tsconfig.json` to manage both formats:

#### tsup Configuration

By default, it builds in `cjs` format but supports `esm` output as well. You can customize this in `tsup` configuration to switch between module formats:

```typescript
// tsup.config.ts
import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  entryPoints: ["src/index.ts"],
  clean: true,
  format: ["cjs", "esm"], // Supports both CJS and ESM
  ...options,
}));
```

#### TypeScript Configuration

To support module resolution and ESM, the `module` is set to `NodeNext`, which helps in handling both CJS and ESM seamlessly:

```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "target": "ES2022",
    "esModuleInterop": true,
    "declaration": true,
    "declarationMap": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

This configuration allows the project to seamlessly handle both module formats if the need arises.