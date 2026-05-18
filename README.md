# MERN AI Employee Performance Analytics System

Full-stack MERN project for HR/Admin users to manage employees, track skills and performance, view analytics, and generate AI-powered promotion/training recommendations through an OpenRouter/OpenAI-compatible API.

## Features

- JWT authentication with bcrypt password hashing
- Protected React routes for HR/Admin workflow
- Employee CRUD with MongoDB validation and duplicate-email handling
- Search and filter by employee name and department
- Dashboard with total employees, average score, top performer, rankings, and department summary
- Update performance score directly from the employee list
- AI recommendations for promotion, ranking, training suggestions, and personalized feedback

## Tech Stack

- Frontend: React, Vite, Material UI, Axios, React Router
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Security: JWT, bcryptjs, protected API middleware
- AI: OpenRouter chat-completions API

## Project Structure

```text
employee-analytics/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   └── package.json
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── package.json
└── package.json
```

## Run Locally

```bash
cd employee-analytics
npm install
npm run install:all
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

If those ports are already busy, run the folders separately with alternate ports.

```bash
cd backend
$env:PORT="5050"; npm run dev

cd ../frontend
$env:VITE_API_URL="http://localhost:5050/api"; npm run dev -- --port 5175
```

## API Endpoints

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/signup` | No | Register HR/Admin user |
| POST | `/api/auth/login` | No | Login and receive JWT |
| POST | `/api/employees` | Yes | Add employee |
| GET | `/api/employees` | Yes | Get all employees sorted by score |
| GET | `/api/employees/search?department=Development&name=Aman` | Yes | Search/filter employees |
| PUT | `/api/employees/:id` | Yes | Update employee or performance score |
| DELETE | `/api/employees/:id` | Yes | Delete employee |
| POST | `/api/ai/recommend` | Yes | Generate AI HR recommendations |

## Postman Test Data

Signup:

```json
{
  "name": "Abhishek",
  "email": "abhishek@gmail.com",
  "password": "123456",
  "role": "admin"
}
```

Add employee:

```json
{
  "name": "Aman Verma",
  "email": "aman@gmail.com",
  "department": "Development",
  "skills": ["React", "Node.js", "MongoDB"],
  "performanceScore": 85,
  "experience": 3
}
```

AI recommendation:

```json
{
  "employees": [
    {
      "name": "Aman Verma",
      "department": "Development",
      "skills": ["React", "Node.js", "MongoDB"],
      "performanceScore": 85,
      "experience": 3
    }
  ]
}
```

## Render Deployment Notes

Backend Web Service:

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `node index.js`
- Environment variables: `PORT`, `MONGO_URI`, `JWT_SECRET`, `OPENROUTER_API_KEY`, `CLIENT_URL`

Frontend Static Site:

- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`

## Submission PDF Checklist

- Folder structure screenshot
- Source code screenshots or pasted code
- Backend running screenshot
- Frontend running screenshot
- Postman/Thunder Client screenshots for signup, login, add, get, search, update, AI, delete
- MongoDB Atlas collection screenshots
- Render deployment screenshots
- Live frontend URL, backend API URL, and GitHub repository link
