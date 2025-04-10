# News Website Backend

Backend API for the news website built with Node.js and PostgreSQL.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with:
```
DATABASE_URL=your_cockroachdb_connection_string
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

3. Initialize the database:
```bash
node init-db.js
```

4. Start the server:
```bash
npm start
```

## Deployment

1. Push this repository to GitHub
2. Deploy to a hosting service (Railway, Render, or Heroku recommended)
3. Set the environment variables in your hosting platform:
   - DATABASE_URL
   - NODE_ENV=production
   - FRONTEND_URL (your Vercel frontend URL)
4. Ensure the database is initialized after deployment 