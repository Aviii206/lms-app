# 🎓 LearnHub LMS

**LearnHub** is a full-stack, dual-role Learning Management System built on the MERN stack (MongoDB, Express, React, Node.js). It is specifically engineered to prioritize academic integrity alongside a premium, modern user experience.

![LearnHub Version](https://img.shields.io/badge/version-1.0.0-blue)
![MERN Stack](https://img.shields.io/badge/stack-MERN-green)

---

## ✨ Core Features

### 👨‍🏫 Instructor Portal (Teacher)
*   **Course & Assignment Hub:** Instructors can easily organize curriculums, enroll students, and distribute time-sensitive assignments.
*   **Anti-Cheat Assessment Engine:** Teachers can construct dynamic exams out of Multiple Choice (MCQ) & Short Answer questions. Exams force a locked fullscreen mode and utilize browser visibility APIs to actively track tab-switching violations.
*   **Hybrid Grading Portal:** MCQs are instantly auto-graded by the backend. Teachers use a dedicated intuitive marking dashboard to manually review text responses, instantly triggering an automatic recalculation of the student's total score.

### 🎒 Learner Portal (Student)
*   **Course Marketplace:** Students can browse available curriculums, instantly enroll, and track their active assignments.
*   **Smart Feedback Loop:** Students receive real-time, dynamic status badges on their dashboard indicating whether an exam is upcoming, active, missed, pending manual review, or fully graded.

### 🎨 Premium UI Architecture
*   The entire platform runs on a custom **"Slate & Blue" glassmorphism design system**.
*   Features fully responsive layouts, soft hover drop-shadows, native tooltips, and a highly focused distraction-free typography hierarchy.

---

## 🛠️ Technology Stack

**Frontend:**
*   React.js (scaffolded with Vite)
*   React Router DOM (for secure RBAC routing)
*   Axios
*   Raw CSS for universal Glassmorphism elements

**Backend:**
*   Node.js & Express.js
*   MongoDB & Mongoose (utilizing atomic upserts and compound indexing to prevent race conditions during heavy exam traffic load)
*   JSON Web Tokens (JWT) for secure authentication and authorization handling

---

## 🚀 Installation & Setup

Follow these instructions to get the project running locally on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/lms-app.git
cd lms-app
```

### 2. Backend Setup
Navigate to the backend directory, install the required packages, and run the server.

```bash
cd backend
npm install
```

Create a `.env` file in the `/backend` directory and add the following keys:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal tab, navigate to the frontend directory, install the dependencies, and run the Vite development server.

```bash
cd frontend
npm install
npm run dev
```

### 4. Access the Application
The LMS will now be running on **http://localhost:5173** (or the port Vite provides) and the backend API will reside at **http://localhost:5000**.

Enjoy teaching and learning!
