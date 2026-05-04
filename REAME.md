# Project Tracker

A full-stack solution that imports project tracking data from CSV into a relational database and exposes it through a REST API and web dashboard.

## Tech Stack
- Backend: Node.js + Express
- Database: MySQL
- Frontend: HTML + CSS + JS (Vanilla)
- Import: Python + pandas

## Setup Instructions

### 1. Clone / Download the project

### 2. Database Setup
Open MySQL Workbench and manually run the SQL from `import/schema.sql`

### 3. Import Data
```
cd import
pip install pandas mysql-connector-python
python import.py
```

### 4. Backend Setup
```
cd backend
npm install
node index.js
```
Server runs on http://localhost:3000

### 5. Frontend
Open `frontend/index.html` with Live Server in VS Code.

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /projects | List all projects |
| GET | /projects/:id | Get project detail |
| GET | /projects/:id/steps | Get project steps |
| GET | /projects/:id/document-approvals | Get document approvals |
| GET | /dashboard/summary | Get dashboard KPIs |

## Schema Overview
- `projects` — master project data
- `project_steps` — phase/step status per project
- `document_approvals` — document approval status per project

## Assumptions
- No authentication required
- MySQL used instead of PostgreSQL for local simplicity
- Sample CSV data was self-generated based on business context described in the brief
- Dates are stored as DATE type in MySQL

## Next Step Improvements
- Add authentication (JWT)
- Add filtering and pagination to API
- Connect to Metabase for visual reporting
- Deploy to cloud (Railway, Render, or Vercel)
- Add ability to upload new CSV files via UI
