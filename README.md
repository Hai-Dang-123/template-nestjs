
# NestJS Clean Architecture Backend

This is a comprehensive NestJS backend project featuring a clean architecture, JWT authentication (access + refresh tokens), TypeORM with SQL Server, code-first migrations, and Swagger API documentation.

## Features

-   **Framework**: NestJS v10+
-   **Database**: SQL Server (MSSQL) with TypeORM v0.3+
-   **Authentication**: JWT-based (Access and Refresh Tokens) using Passport.js.
-   **Security**: Password hashing with `bcrypt`.
-   **API Documentation**: Automated Swagger (OpenAPI) docs.
-   **Architecture**: Clean, modular structure.
-   **Database Management**: Code-first approach with TypeORM migrations.
-   **Configuration**: Centralized configuration management using `@nestjs/config`.
-   **Validation**: DTO validation with `class-validator` and `class-transformer`.

## Prerequisites

-   Node.js (v18 or higher)
-   npm or yarn
-   A running instance of SQL Server.

---

## 1. Installation

Clone the repository and install the dependencies.

```bash
git clone <repository_url>
cd nestjs-clean-arch-backend
npm install
```

---

## 2. Environment Configuration

Copy the example environment file and update it with your specific configuration, especially your database credentials and JWT secrets.

```bash
cp .env.example .env
```

Open the `.env` file and fill in the values:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=1433
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_DATABASE=name_of_your_db
DB_LOGGING=true

# JWT Configuration
JWT_ACCESS_SECRET=your-super-secret-access-key
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_REFRESH_EXPIRATION=7d
```

**Important**: Ensure the database specified in `DB_DATABASE` exists in your SQL Server instance before running migrations.

---

## 3. Database Migrations

This project uses TypeORM's migration system to manage the database schema.

### a. Generate a new migration

After making changes to your entities (e.g., adding a column to `user.entity.ts`), you need to generate a new migration file.

```bash
# npm run migration:generate --name=YourMigrationName
# Example:
npm run migration:generate --name=InitialUserSchema
```

This will create a new migration file in `src/database/migrations/`.

### b. Run migrations

To apply all pending migrations and update your database schema, run:

```bash
npm run migration:run
```

### c. Revert a migration

To undo the most recently applied migration, run:

```bash
npm run migration:revert
```

---

## 4. Running the Application

To start the application in development mode with auto-reloading:

```bash
npm run start:dev
```

The application will be running on `http://localhost:3000`.

---

## 5. API Documentation (Swagger)

Once the application is running, you can access the interactive API documentation (Swagger UI) at:

[http://localhost:3000/api/docs](http://localhost:3000/api/docs)

### Authorizing in Swagger

To test protected endpoints, you need to authorize your requests:
1.  Click the `Authorize` button on the Swagger UI page.
2.  Log in using the `/auth/login` endpoint to get an `accessToken`.
3.  Copy the `accessToken` value.
4.  In the authorization modal, paste the token into the `value` field with the format `Bearer <your_token>`.
5.  Click `Authorize`. You can now send requests to protected endpoints.

