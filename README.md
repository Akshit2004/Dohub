# DoHub - Premium To-Do App

![DoHub Banner](public/vite.svg)

DoHub is a beautifully designed, modern, and responsive to-do list application built with React and Firebase. It helps you organize your tasks, track your productivity, and manage your day with ease. Featuring a premium dark theme, glassmorphism UI, and smooth animations, DoHub makes task management delightful on any device.

## ✨ Features

- **User Authentication**: Secure login and registration with Firebase Auth
- **Task Management**: Add, edit, complete, and delete tasks
- **Swipe to Delete**: Slide a task to the right to delete it (mobile & desktop)
- **Statistics Dashboard**: Visual overview of completed, pending, and overdue tasks
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **Modern UI**: Glassmorphism, gradients, and beautiful animations
- **Light & Dark Mode**: Toggle between light and dark themes
- **Profile Section**: View your profile and email

## 🚀 Getting Started

### 1. Clone the repository
```sh
# Using PowerShell
git clone https://github.com/your-username/do-hub.git
do-hub
cd do-hub
```

### 2. Install dependencies
```sh
npm install
```

### 3. Configure Firebase
- Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
- Enable Authentication (Email/Password)
- Create a Firestore database
- Copy your Firebase config to `src/firebase.js`:

```js
// src/firebase.js
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 4. Start the development server
```sh
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to view the app.

## 📸 Screenshots

![Dashboard](public/vite.svg)

## 🛠️ Tech Stack
- **Frontend**: React, Vite, CSS (Glassmorphism, Gradients)
- **Backend**: Firebase Auth & Firestore

## 📂 Project Structure
```
src/
  components/
    NavBar/
      Navbar.jsx
      Navbar.css
  pages/
    Dassboard/
      Dashboard.jsx
      Dassboard.css
    login/
      Login.jsx
      Login.css
  firebase.js
  App.jsx
  App.css
  main.jsx
```

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📄 License
This project is licensed under the MIT License.

---

> Designed & developed by Akshit
