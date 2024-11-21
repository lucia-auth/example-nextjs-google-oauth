# Google OAuth example in Next.js

Uses SQLite. Rate limiting is implemented using JavaScript `Map`.

## Initialize project

Register an OAuth client on the Google API Console with the redirect URI pointed to `/login/google/callback`.

```
http://localhost:3000/login/google/callback
```

Paste the client ID and secret to a `.env` file.

```bash
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET="
```

Create `sqlite.db` and run `setup.sql`.

```
sqlite3 sqlite.db
```

Run the application:

```
pnpm dev
```
