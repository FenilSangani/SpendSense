# SpendSense - AI-Powered Expense Tracker & Financial Insights

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application that helps users track daily expenses, categorize spending, visualize financial data through interactive charts, and receive AI-powered financial insights.

---

## Features

### User Authentication
- Secure registration and login with JWT (JSON Web Tokens)
- Passwords hashed using bcryptjs
- Protected routes for authenticating user sessions

### Interactive Dashboard
- Total Balance, Income & Expenses - real-time metrics
- Recent Transactions - list of last 5 transactions
- Category Breakdown - Pie/donut chart mapping expenses
- Monthly Trends - Bar chart comparing income vs expenses over 6 months

### Transaction Management (CRUD)
- Add new income or expense transactions
- Edit existing transactions
- Delete transactions with confirmation
- Pre-defined categories (Food, Transport, Shopping, Bills, Entertainment, Health, Education, Salary, Freelance, Other)

### Smart Filters & Search
- Filter transactions by type and category
- Search transactions by note/description
- Filter by date ranges

### Analytics & Visualization
- Category-wise donut chart distribution
- Income vs Expense monthly comparison bar chart
- Daily spending trend line chart
- Ranked list of top spending categories

### AI-Powered Financial Insights
- Automated financial tips generation based on spending patterns
- Powered by OpenAI GPT-3.5 API (when configured)
- Smart fallback mock mode for local testing without api keys

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React.js (Vite) | UI components & client routing |
| Styling | Vanilla CSS | Dark theme styling system |
| Charts | Recharts | Interactive visualizations |
| Backend | Node.js + Express.js | API server |
| Database | MongoDB + Mongoose | Data models & queries |
| Auth | JWT + bcryptjs | Session security |
| AI | OpenAI API | Insights engine |
| HTTP | Axios | API integration |
| Icons | React Icons (Feather) | Vector icons |

---

## Project Structure

```
spendsense/
├── frontend/                    # React Frontend (Vite)
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Charts/          # PieChart, BarChart, LineChart
│   │   │   ├── Common/          # Loader, Modal
│   │   │   └── Layout/          # Sidebar, Layout wrapper
│   │   ├── context/             # Context Providers
│   │   ├── pages/               # Page components
│   │   ├── utils/               # Axios client, helpers
│   │   ├── App.jsx              # Client router
│   │   └── index.css            # Styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                     # Node.js Backend
│   ├── config/db.js             # Database connection
│   ├── controllers/             # Request handlers
│   ├── middleware/              # Authentication middleware
│   ├── models/                  # Database schemas
│   ├── routes/                  # API endpoints
│   ├── server.js                # Server entry point
│   ├── .env                     # Settings
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas instance)
- npm (package manager)

### 1. Extract and setup
```bash
cd spendsense
```

### 2. Setup Backend
```bash
cd backend
npm install
npm run dev
```
Backend runs at: **http://localhost:5000**

### 3. Setup Frontend
```bash
# Open a new terminal tab
cd frontend
npm install
npm run dev
```
Frontend runs at: **http://localhost:5173**

### 4. Application Flow
1. Navigate to **http://localhost:5173**
2. Register a new account and log in
3. Add transactions and configure budgets
4. View real-time analytics on the Dashboard and Analytics pages
5. Generate AI insights from the AI Insights page

---

## Environment Variables

Backend `.env` configuration:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/spendsense
JWT_SECRET=spendsense_jwt_secret_key_2024
OPENAI_API_KEY=
```

---

## API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login & get session token | No |
| GET | `/api/auth/me` | Fetch active user profile | Yes |

### Transactions (`/api/transactions`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/transactions` | Query transactions (filtered) | Yes |
| POST | `/api/transactions` | Create transaction | Yes |
| PUT | `/api/transactions/:id` | Update transaction | Yes |
| DELETE | `/api/transactions/:id` | Delete transaction | Yes |
| GET | `/api/transactions/summary` | Fetch metrics summary | Yes |

### AI Insights (`/api/insights`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/insights/generate` | Generate insights from data | Yes |

---