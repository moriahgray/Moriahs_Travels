# **Moriah's Travels**

## **Project Overview**
Moriah's Travels is a multi-platform travel tracking application that allows users to log places they've visited and places they want to travel to. It supports authentication, map views, and CRUD operations for travel locations. 

The app is built with:
- **React Native & Expo** for the frontend (supports iOS, Android, and Web)
- **Rust & Actix Web** for the backend
- **MySQL/MariaDB** for the database

---

## **Project Structure**
```
moriahs-travels/
│── backend/         # Rust backend with Actix Web and Diesel ORM
│── frontend/        # React Native frontend using Expo
│── README.md        # Main project overview (this file)
│── backend/README.md  # Backend-specific instructions
│── frontend/README.md  # Frontend-specific instructions
```

---

## **Setup Instructions**
To get started, follow the instructions in the respective directories:

- **[Frontend Setup](./frontend/README.md)** (React Native / Expo)
- **[Backend Setup](./backend/README.md)** (Rust / Actix Web)

---

## **Tech Stack**
### **Frontend**
- React Native (Expo)
- React Navigation
- React Native Web (for web support)
- Async Storage (local storage)
- JWT Authentication

### **Backend**
- Rust (Actix Web)
- Diesel ORM (for MySQL/MariaDB)
- JSON Web Token (JWT) authentication
- dotenv (for environment management)

---

## **Features**
- **User Authentication**: Secure login/signup with JWT-based authentication.
- **Location Tracking**: Users can log places they've traveled to and places they want to visit.
- **Map Integration**: View locations using maps (only on mobile).
- **Web Support**: Runs on iOS, Android, and Web (limited features).

---

## **Running the Project**
1. **Start the backend**
   ```sh
   cd backend
   cargo run
   ```
   The API server will start at `http://localhost:8000`.

2. **Start the frontend**
   ```sh
   cd frontend
   npm start
   ```
   This will start an Expo development server, allowing you to run the app on an emulator or in the browser.

---

For detailed setup, visit the backend and frontend READMEs.