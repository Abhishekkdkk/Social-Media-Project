import React, { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, UserPlus, LogIn } from "lucide-react";
import "../components/register.css";
import {
  loginUser,
  registerUser,
} from "../services/RegisterandLoginServices.js";
import { useNavigate } from "react-router";

const RegisterandLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatar, setAvatar] = useState(null); // added avatar state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!isLogin && !formData.username.trim())
      newErrors.username = "Username is required";
    else if (!isLogin && formData.username.length < 3)
      newErrors.username = "Username must be at least 3 characters";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email))
      newErrors.email = "Enter a valid email";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!isLogin && formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      setAvatar(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        // LOGIN
        const res = await loginUser({
          email: formData.email,
          password: formData.password,
        });
        if (res?.data?.accessToken) {
          localStorage.setItem("token", res.data.accessToken);
        }
        navigate("/home");
      } else {
        const data = new FormData();
        data.append("username", formData.username);
        data.append("email", formData.email);
        data.append("password", formData.password);
        if (avatar) data.append("avatar", avatar);

        const res = await registerUser(data);
        if (res?.data?.accessToken) {
          localStorage.setItem("token", res.data.accessToken);
          setIsLogin(true);
        }
      }
    } catch (err) {
      setErrors({
        apiError:
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      fullName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setAvatar(null);
    setErrors({});
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-icon-wrapper">
            {isLogin ? <LogIn /> : <UserPlus />}
          </div>
          <h2 className="auth-title">
            {isLogin ? "Welcome Back!" : "Join Us Today!"}
          </h2>
          <p className="auth-subtitle">
            {isLogin
              ? "Sign in to continue"
              : "Create your account to get started"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <>
              <div className="auth-input-wrapper">
                <User className="input-left-icon" />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`auth-input ${
                    errors.username ? "auth-input-error" : ""
                  }`}
                />
                {errors.username && (
                  <p className="error-text">{errors.username}</p>
                )}
              </div>

              <div className="avatar-container">
                <label htmlFor="avatar" className="auth-input avatar-input">
                  <span className="avatar-text">
                    {avatar ? avatar.name : "Upload Avatar"}
                  </span>
                  <input
                    type="file"
                    id="avatar"
                    name="avatar"
                    onChange={handleInputChange}
                    accept="image/*"
                  />
                </label>
              </div>
            </>
          )}

          <div className="auth-input-wrapper">
            <Mail className="input-left-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className={`auth-input ${errors.email ? "auth-input-error" : ""}`}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="auth-input-wrapper">
            <Lock className="input-left-icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className={`auth-input ${
                errors.password ? "auth-input-error" : ""
              }`}
            />
            <span
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </span>
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          {!isLogin && (
            <div className="auth-input-wrapper">
              <Lock className="input-left-icon" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`auth-input ${
                  errors.confirmPassword ? "auth-input-error" : ""
                }`}
              />
              <span
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </span>
              {errors.confirmPassword && (
                <p className="error-text">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          {errors.apiError && <p className="error-text">{errors.apiError}</p>}

          <button type="submit" disabled={isLoading} className="submit-btn">
            {isLoading ? (
              <div className="loading-content">
                <span className="spinner"></span>
                Processing...
              </div>
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="auth-toggle-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            type="button"
            className="auth-toggle-btn"
            onClick={toggleAuthMode}
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterandLogin;
