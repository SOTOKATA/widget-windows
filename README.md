# widget-windows

An Electron application with Svelte and TypeScript

## Local database and Turso sync

The application always creates a local SQLite-compatible database in Electron's
`userData` directory. Todo creation, reading, completion changes, and soft deletion
work without an internet connection.

To enable bidirectional synchronization with Turso, set these environment variables
before starting the app (copy `.env.example` as a reference):

```powershell
$env:TURSO_DATABASE_URL = 'libsql://your-database-your-organization.turso.io'
$env:TURSO_AUTH_TOKEN = 'your-turso-auth-token'
npm run dev
```

Create the table in the Turso database once before first synchronization:

```sql
CREATE TABLE IF NOT EXISTS todos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  completed INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT
);
```

The refresh button in the widget sends local changes with `push()` and then receives
remote changes with `pull()`. Deleted todos are soft-deleted to ensure deletion is
also synchronized across devices.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
