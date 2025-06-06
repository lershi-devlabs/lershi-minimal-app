# lershi-minimal-app

A modern, minimal CLI tool to scaffold new projects with a single command—just like `npx create-next-app`!

## Features
- Multiple templates (e.g., default, html)
- Interactive prompts (or `-y` to skip)
- Git initialization
- Dependency installation (npm, yarn, pnpm, bun)
- Clean, colored output

## Project Structure
```
lershi-minimal-app/
├── src/
│   ├── cli.ts        # CLI entry point: argument parsing, prompts, main logic
│   ├── logger.ts     # Unified logging and spinner output
│   ├── scaffold.ts   # Core logic: copies templates, replaces placeholders
│   ├── utils.ts      # Helper: validates project name
│   └── version.ts    # Auto-generated: contains the CLI version
├── templates/
│   ├── default/      # Default template files
│   └── html/         # HTML template files
├── dist/             # Compiled output (after build)
│   ├── cli.js
│   ├── logger.js
│   ├── scaffold.js
│   ├── utils.js
│   └── version.js
├── README.md         # This file
├── package.json      # Scripts, dependencies, config
└── ...
```

## How Each File Works
- **src/cli.ts**: Handles CLI arguments, prompts, and calls the scaffolder. Uses `commander`, `enquirer`, and `logger`.
- **src/logger.ts**: Provides colored output and spinners for a great UX.
- **src/scaffold.ts**: Copies the chosen template, replaces `${name}` placeholders, and returns the new project path.
- **src/utils.ts**: Validates the project name and checks for existing directories.
- **src/version.ts**: Auto-generated: contains the CLI version.
- **templates/**: Add folders here for new templates (e.g., `templates/react/`).

## How to Add a New Template
1. Create a new folder in `templates/` (e.g., `templates/express/`).
2. Add your starter files (e.g., `README.md`, `package.json`, etc.).
3. Use `${name}` in files to auto-replace with the project name.
4. Scaffold with:
   ```sh
   npx lershi-minimal-app my-app -t express
   ```

## Development & Deployment
- **Build:**
  ```sh
  npm run build
  ```
- **Test:**
  ```sh
  npm test
  ```
- **Publish to npm:**

1. npm run changeset
2. npm run version
3. npm run prebuild 
4. git add . && git commit -m "release: version bump and changelog"
5. git push
6. npm run publish:prod

## Next Steps
- Add more templates to `templates/`
- Add more prompts or features in `src/cli.ts`
- Extend logging or validation as needed

## Versioning: Keeping the CLI Version in Sync

### Why do we generate `src/version.ts`?

- Reading `package.json` at runtime can fail after build/publish, causing errors like:
  ```
  Error: ENOENT: no such file or directory, open '.../dist/package.json'
  ```
- Instead, we generate `src/version.ts` at build time, which exports the version from `package.json`.
- The CLI imports this version directly:
  ```ts
  import { version } from './version.js';
  ```

### Why the `.js` extension?
- In ESM (with `"type": "module"`), Node.js requires explicit file extensions in imports.
- Using `import { version } from './version.js';` ensures the import works after build and publish.

### Summary
- No runtime file reads or path issues.
- The version is always in sync with `package.json`.
- The CLI works reliably with npx, local, and global installs.