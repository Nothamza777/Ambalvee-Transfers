# Ambalvee Transfers

Storefront and admin dashboard for DTF transfers, gang sheets, and print supplies.

## Requirements

- Node.js 24
- npm 10 or newer
- PostgreSQL

## Run locally

From the project root, install dependencies:

```sh
npm install
```

Create a PostgreSQL database, then set these variables in the API terminal. Replace the sample database and login values with your own:

```sh
export DATABASE_URL="postgresql://postgres:your-password@localhost:5432/ambalvee"
export ADMIN_EMAIL="admin@example.com"
export ADMIN_PASSWORD="replace-with-a-strong-password"
export SESSION_SECRET="$(openssl rand -hex 32)"
```

Apply the database schema once:

```sh
npm run db:push
```

Start the API in the first terminal:

```sh
PORT=3001 npm run dev:api
```

In a second terminal, from the project root, start the storefront:

```sh
PORT=5173 BASE_PATH=/ npm run dev:storefront
```

Open `http://localhost:5173/#/admin` and sign in with the email and password you set above. The frontend proxies `/api` requests to the API on port `3001`.

On Windows PowerShell, set variables with `$env:NAME="value"` before running the commands. The sample login values are placeholders, not preset credentials.

Build the project with:

```sh
npm run build
```

### If the admin challenge does not load

Keep both the API and storefront terminals running. Check the API from another terminal:

```sh
curl http://localhost:3001/api/healthz
```

It should return `{"status":"ok"}`. The API terminal must have `DATABASE_URL` set before it starts; without it, the API cannot start and the admin challenge/session endpoints will be unavailable.

Checkout currently creates an order preview; no payment processor is configured.
