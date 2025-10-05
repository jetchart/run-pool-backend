
# Base API

A modern, minimal, and scalable NestJS + TypeScript starter project with JWT authentication, Google OAuth integration, TypeORM, and structured logging using Pino.

## Features

- ⚡️ Fast development with NestJS
- 🛡️ Strict TypeScript type safety
- 🔐 JWT authentication & Google OAuth login
- 🗄️ TypeORM for database access
- 📊 Structured logging with nestjs-pino
- 🧩 Modular, clean, and scalable architecture
- 🧪 Ready for unit and e2e testing
- 📝 Modern ESLint and Prettier setup


---

## How does the application work?

This API provides endpoints protected with JWT and Google authentication. It uses TypeORM for user and database management, and structured logging for traceability and debugging.

**Main flow:**

1. **Google Authentication:**
  - The user authenticates in the frontend with Google and sends the token to `/auth/google/login`.
  - The backend validates the token, creates or updates the user, and responds with a JWT.

2. **Protected access:**
  - Endpoints under `/users` require a valid JWT (guard `JwtAuthGuard`).

3. **Logging:**
  - All logs use Pino, with pretty output in development and JSON in production.

4. **Configuration:**
  - Environment and credentials are configured via environment variables and files in `src/config`.

---

## Project structure

```
src/
  modules/
   app.module.ts         # Root module, imports and configures everything
   app.controller.ts     # Main endpoint (GET /)
   app.service.ts        # Base service
   auth/                 # Auth module (Google, JWT, UserEntity)
   user/                 # User module (JWT-protected)
   app-logger/           # Custom logger and Pino config
  config/                 # Environment configuration
  database/
   migrations/           # TypeORM migrations
   datasource.ts         # Connection config
test/                     # End-to-end tests
```

---

## Requirements

- Node.js >= 18
- PostgreSQL (or a compatible connection URL)
- Yarn or npm

---

## Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/jetchart/run-pool-backend.git
   cd run-pool-backend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables:**
   - Copy the example file and edit it:
     ```sh
     cp .env.example .env
     ```
   - Fill in the required values in `.env` (DB_URL, JWT_SECRET, GOOGLE_CLIENT_ID, etc).

---

## Migrations

- **Generate a migration:**
  ```sh
  npm run typeorm:migration:generate -- MIGRATION_NAME=YourMigrationName
  ```
- **Run migrations:**
  ```sh
  npm run typeorm:migration:run
  ```

---

## Running

- **Development mode:**
  ```sh
  npm run start:dev
  ```
- **Production mode:**
  ```sh
  npm run build
  npm run start:prod
  ```

The API will be available on the port defined by `NEST_PORT` (default: 3000).

---



## Logging

The app uses [nestjs-pino](https://github.com/iamolegga/nestjs-pino) for structured logs.

- You can inject the standard logger:
  ```typescript
  import { Logger } from 'nestjs-pino';
  constructor(private readonly logger: Logger) {}
  this.logger.info('Message');
  ```
- Or use the custom logger:
  ```typescript
  import { AppLogger } from './app-logger/app-logger';
  constructor(private readonly logger: AppLogger) {}
  this.logger.logInfo('Context', 'Message');
  ```

In development, logs are pretty-printed; in production, they are JSON for integration with monitoring systems.

---

## Google Authentication

The endpoint `/auth/google/login` allows authentication with Google.
Send the Google token in the body:

```json
{
  "token": "GOOGLE_ID_TOKEN"
}
```

---

## CORS

CORS is enabled for the frontend defined in the `WEB_HOST` variable.

---

## Testing

- **Run tests:**
  ```sh
  npm run test
  ```

---



## Main folder structure

- `src/modules/` — Main app modules (auth, user, logger, etc)
- `src/config/` — Environment configuration
- `src/database/migrations/` — Database migrations

---



## License

MIT
