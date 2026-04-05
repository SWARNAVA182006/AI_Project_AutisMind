# 🧠 AutisMind AI – Autism Screening System

A full-stack AI-powered web application that analyzes early autism indicators using classical AI algorithms and provides risk assessment with therapy recommendations.

---

## 🚀 Features

* 🧠 AI-based screening system
* 📊 Risk score and module breakdown
* 🔍 Explainable AI (BFS, A*, CSP)
* 📅 Therapy plan generation
* 💾 MongoDB database integration
* 🌐 Full-stack (React + FastAPI)

---

## 🧠 Algorithms Used

### 1. Rule-Based System

* Calculates risk score based on behavioral inputs

### 2. Breadth First Search (BFS)

* Analyzes symptom relationships

### 3. A* Algorithm

* Selects optimal therapy plan

### 4. Constraint Satisfaction Problem (CSP)

* Generates structured weekly therapy schedule

---

## 🏗️ Architecture

Frontend (Next.js)
⬇
FastAPI Backend
⬇
AI Algorithms (BFS, A*, CSP)
⬇
MongoDB Database
⬇
Results & Recommendations

---

## 🖥️ Tech Stack

* Frontend: React (Next.js)
* Backend: FastAPI (Python)
* Database: MongoDB Atlas
* AI Logic: Custom implementations (BFS, A*, CSP)

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone 
cd AutisMind-AI
```

---

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Create `.env`:

```env

```

Run backend:

```bash
uvicorn main:app --reload
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 📊 API Endpoints

* POST `/api/analyze` → Analyze screening data
* GET `/api/results/{session_id}` → Fetch result

---

## 📸 Screenshots

(Add your screenshots here)

---

## 🧠 Project Highlights

* Explainable AI system (not black-box ML)
* Clean architecture (separation of concerns)
* Real-time frontend-backend integration
* Persistent storage using MongoDB

---

## 🎯 Future Scope

* Machine learning model integration
* Mobile app version
* Real-time behavioral tracking
* Doctor dashboard

---

## 👨‍💻 Author

Vishal Patel

---

## ⭐ If you like this project, give it a star!
