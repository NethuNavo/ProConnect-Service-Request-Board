# ProConnect Service Request Board 🚀

A modern full-stack mini service marketplace where homeowners can post service requests and tradespeople can manage them efficiently.

Built with:

- Next.js (App Router)
- Node.js + Express
- MongoDB + Mongoose
- Plain CSS

---

## ✨ Features

- Create new service requests
- Browse all job requests
- Filter by category & status
- View full job details
- Update job status
- Delete job requests
- JWT-based admin authentication
- RESTful API architecture
- MongoDB database integration
- Responsive clean UI
- Seed script with sample data
- API testing with Jest

---

# 📸 Preview

### Home Page
- View all service requests
- Filter by category/status
- Search jobs easily

### New Request Form
- Submit service requests publicly
- Client-side validation included

### Job Detail Page
- View complete request details
- Update status
- Delete requests (admin only)

---

# 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js |
| Backend | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JWT |
| Styling | CSS |
| Testing | Jest + Supertest |

---

# 📂 Project Structure

```bash
proconnect/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── tests/
│   ├── seed.js
│   └── server.js
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── styles/
│   └── services/
│
└── README.md
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone <your-github-repo-url>
cd proconnect
```

---

# 🔧 Backend Setup

Open the `backend` folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create `.env` file:

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run backend server:

```bash
npm run dev
```

✅ Backend running on:

```bash
http://localhost:4000
```

---

# 🎨 Frontend Setup

Open the `frontend` folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Run frontend:

```bash
npm run dev
```

✅ Frontend running on:

```bash
http://localhost:3000
```

---

# 🌱 Seed Database (Optional)

From `backend` folder:

```bash
npm run seed
```

This inserts sample service requests into MongoDB.

---

# 🔐 Authentication

Simple JWT authentication is implemented for admin actions.

## Demo Admin Credentials

```txt
Email: admin@proconnect.test
Password: Password123
```

### Permissions

| Action | Access |
|---|---|
| Create Job | Public |
| View Jobs | Public |
| Update Status | Admin Only |
| Delete Job | Admin Only |

---

# 🧪 API Testing

Backend tests use in-memory MongoDB.

Run tests:

```bash
npm test
```

---

# 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/jobs` | Get all jobs |
| GET | `/api/jobs/:id` | Get single job |
| POST | `/api/jobs` | Create new job |
| PATCH | `/api/jobs/:id` | Update job status |
| DELETE | `/api/jobs/:id` | Delete job |

---

# 🌍 Deployment

## Frontend (Vercel)

Live Demo:  
https://pro-connect-service-request-board.vercel.app/

Deploy using Vercel:
https://vercel.com

---

## Backend (Render)

```txt
https://your-render-api.onrender.com
```

Deploy using Render:
https://render.com
