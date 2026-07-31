# CRM Remont Backend

Backend для CRM Remont на базі Node.js, Express, Sequelize, PostgreSQL.

## Встановлення

1. Перейдіть у папку `server`:
   ```bash
   cd server
   ```
2. Скопіюйте `.env.example` у `.env` і вкажіть свої параметри підключення до бази даних.
3. Встановіть залежності:
   ```bash
   npm install
   ```
4. Запустіть сервер:
   ```bash
   npm run dev
   ```

## Структура проекту
- `src/index.js` — точка входу
- `src/config/database.js` — підключення до бази даних
- `src/models/` — моделі Sequelize
- `src/routes/` — маршрути Express
- `src/controllers/` — контролери

## Приклад .env
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=crm_remont_db
DB_USER=postgres
DB_PASSWORD=yourpassword
PORT=3000
```

## Міграції
Використовуйте Sequelize CLI для створення та застосування міграцій.
