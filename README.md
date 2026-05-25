# BlockChain (monorepo)

This repository contains three related blockchain projects grouped together for convenience:

- `crypto-wallet-app` — a wallet frontend + Node/Hardhat backend.
- `LandChain` — a Vite/React client and a small blockchain/server subfolder.
- `MetaBank` — a separate project (tracked as a submodule in this repo).

This README explains the structure, basic setup, and quick start commands for each project.

**Prerequisites**

- Node.js (16+ recommended) and `npm` or `yarn`
- Git
- (Optional) `gh` CLI if you plan to create GitHub repos from the CLI

**Repository layout**

Root/
- crypto-wallet-app/
  - client/  (React app)
  - server/  (Hardhat / Node backend)
- LandChain/
  - client/  (Vite + React)
  - blockchain/ (project files)
  - server/
- MetaBank/  (kept as a submodule)

Notes about `MetaBank`

MetaBank is included as a Git submodule in this repository. If you see an empty folder or a submodule pointer, initialize submodules locally:

```bash
git submodule update --init --recursive
```

If you intend to keep MetaBank as a standalone GitHub repository, create the remote `sriinathh/MetaBank` on GitHub first so the submodule URL resolves.

Quick start (per-project)

1) crypto-wallet-app

```bash
cd crypto-wallet-app/client
npm install
# try: npm run start OR npm run dev (check package.json scripts)

cd ../server
npm install
# start server: npm run start or node index.js (check package.json scripts)
```

2) LandChain

```bash
cd LandChain/client
npm install
# run dev server: npm run dev or npm start (check package.json)

# blockchain and server folders have their own package.json files; cd into them and run the usual install/start commands.
```

3) MetaBank

If you kept `MetaBank` as a submodule, after running the `git submodule` command above, inspect `MetaBank/` and follow its internal `README.md` for setup.

Common Git workflows

- Create the GitHub repo (if missing) at https://github.com/sriinathh
- From the monorepo root, push:

```bash
git add .
git commit -m "Import projects: crypto-wallet-app, LandChain, MetaBank"
git push origin main
```

If pushing large initial imports fails due to large pack files or accidental backups, ensure any `.git.backup_*` folders are ignored before committing.

Maintenance notes

- Keep each project's `package.json` scripts and README maintained in their respective folders (`crypto-wallet-app/client/README.md`, etc.).
- If you want separate GitHub repos per project, I can create them and push each project into its own remote — tell me and I'll run the commands.

Contact / Next steps

If you want, I will:
- push this `README.md` to `origin/main` (I will run that now),
- create separate GitHub repositories for each project and push them, or
- convert `MetaBank` from submodule to a tracked folder inside this monorepo.

Detailed setup and notes

Environment variables

Each project may require environment variables for keys, RPC endpoints, database URIs, or other secrets. Check project-specific `.env.example` files and create local `.env` files before starting servers. Example variables you may see:

- `NODE_ENV=development`
- `PORT=3000`
- `MONGO_URI=mongodb://localhost:27017/mydb`
- `RPC_URL=https://...` (for Ethereum providers)
- `JWT_SECRET=your_jwt_secret`

Inspect the `*.env.example` files inside each project for exact variable names and defaults.

Scripts & common commands

- Check available scripts inside any project by opening `package.json` and reviewing the `scripts` section.
- Typical commands:

```bash
# install dependencies
npm install

# run development server (example)
npm run dev    # or npm start

# run tests
npm test
```

Submodules and restoring history

- I backed up nested `.git` folders to `.git.backup_<timestamp>` in the repository root. These backups contain previous local history. If you need those histories restored as separate repos, I can help extract and publish them.

Security & large files

- Avoid committing large build artifacts or `.git` backups. The push previously failed due to a large pack file inside a `.git.backup_*` folder — that's why backups are ignored now.

Help me finish

Tell me which of the following you'd like next:

1. I should push this updated `README.md` to `origin/main` now (I will run the commit + push). 
2. Create separate GitHub repositories for `crypto-wallet-app`, `LandChain`, and `MetaBank` and push each into its own remote.
3. Convert `MetaBank` from submodule into an ordinary folder tracked by this monorepo (I will remove the submodule configuration and commit files).

Choose `1`, `2`, or `3` (or specify another task) and I'll proceed.
