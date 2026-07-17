import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FeedbackForm from "./pages/FeedbackForm";
import MyFeedbacks from "./pages/MyFeedbacks";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import ManageUsers from "./pages/ManageUsers";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path='/forgot-password' element={<ForgotPassword/>}/>
            <Route path='/reset-password' element={<ResetPassword/>}/>

            <Route
              path="/submit-feedback"
              element={
                <PrivateRoute>
                  <FeedbackForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-feedbacks"
              element={
                <PrivateRoute>
                  <MyFeedbacks />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute adminOnly={true}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <PrivateRoute adminOnly={true}>
                  <ManageUsers />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
