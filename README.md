# ProConnect Service Request Board

A mini service request app built with:

- Frontend: Next.js App Router
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Styling: Plain CSS

## Setup

### Backend

1. Open `backend` folder
2. Copy `.env.example` to `.env`
3. Set `MONGO_URI` to your MongoDB connection string
4. Install dependencies
   ```bash
   npm install
   ```
5. Start backend
   ```bash
   npm run dev
   ```

### Frontend

1. Open `frontend` folder
2. Copy `.env.example` to `.env.local`
3. Install dependencies
   ```bash
   npm install
   ```
4. Start frontend
   ```bash
   npm run dev
   ```

## Database seed (optional)

From `backend`:

```bash
npm run seed
```

## Local URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api/jobs
