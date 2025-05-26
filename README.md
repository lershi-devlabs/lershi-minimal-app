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
│   └── utils.ts      # Helper: validates project name
├── templates/
│   ├── default/      # Default template files
│   └── html/         # HTML template files
├── dist/             # Compiled output (after build)
├── README.md         # This file
├── package.json      # Scripts, dependencies, config
└── ...
```

## How Each File Works
- **src/cli.ts**: Handles CLI arguments, prompts, and calls the scaffolder. Uses `commander`, `enquirer`, and `logger`.
- **src/logger.ts**: Provides colored output and spinners for a great UX.
- **src/scaffold.ts**: Copies the chosen template, replaces `${name}` placeholders, and returns the new project path.
- **src/utils.ts**: Validates the project name and checks for existing directories.
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
  1. Bump the version in `package.json` (must be unique on npm)
  2. Build the project:
     ```sh
     npm run build
     ```
  3. Publish:
     ```sh
     npm run publish:prod
     ```

## Next Steps
- Add more templates to `templates/`
- Add more prompts or features in `src/cli.ts`
- Extend logging or validation as needed