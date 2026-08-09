import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";
import { Input, Button, Card, BackButton } from "../components/ui";
import axios from "axios";

// Backend ka real login API endpoint
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/auth/login`;

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Input change hone par state update aur error clear
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  // Client-side validation
  const validateForm = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    }
    return newErrors;
  };

  // Real API call to backend for login
  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError("");

    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      // POST request to backend — bcrypt password verify karega
      const response = await axios.post(API_URL, {
        email: formData.email.trim(),
        password: formData.password,
      });

      const { token, user } = response.data;

      // JWT token aur user info localStorage me store karo
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);

      // Navbar update ke liye event dispatch karo
      window.dispatchEvent(new Event("authChange"));

      // Admin ko admin panel, baaki ko home page
      if (user.role === "admin") {
        navigate("/admin/products");
      } else {
        navigate("/");
      }
    } catch (err) {
      // Backend se error message dikhao
      const message =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[var(--color-bg)] p-6 pt-12 pb-16 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-primary-light)] rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--color-accent)] rounded-full mix-blend-multiply filter blur-[100px] opacity-10 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 w-full max-w-5xl mb-4 flex justify-start">
        <BackButton />
      </div>

      <Card className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 overflow-hidden p-0">
        {/* ============ LEFT — Login Form ============ */}
        <div className="p-8 md:p-12">
          <div className="mb-10">
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-black text-white px-4 py-1.5 text-[10px] font-black uppercase tracking-widest mb-4">
              <LogIn size={14} strokeWidth={3} />
              Access Granted
            </span>
            <h1
              className="text-3xl md:text-4xl font-black uppercase tracking-tight text-gray-900"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Sign in to secure your drops.
            </p>
          </div>

          {/* API Error Banner */}
          {apiError && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              <AlertCircle size={18} className="shrink-0 text-red-500" />
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <Input
              id="email"
              name="email"
              type="email"
              label="Email Address"
              icon={<Mail size={20} strokeWidth={2} />}
              value={formData.email}
              onChange={handleChange}
              placeholder="raaz@example.com"
              error={errors.email}
            />

            {/* Password Field */}
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              icon={<Lock size={20} strokeWidth={2} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="hover:text-gray-600 transition-colors focus:outline-none flex items-center justify-center"
                >
                  {showPassword ? (
                    <EyeOff size={20} strokeWidth={2} />
                  ) : (
                    <Eye size={20} strokeWidth={2} />
                  )}
                </button>
              }
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              error={errors.password}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              className="mt-6"
              loading={loading}
              icon={<LogIn size={20} strokeWidth={2} />}
              iconPosition="left"
            >
              {loading ? "Signing in..." : "Log In"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-gray-500">
            New to the club?{" "}
            <Link
              to="/register"
              className="text-gray-900 font-semibold hover:text-[var(--color-primary)] underline decoration-2 underline-offset-4"
            >
              Create Account
            </Link>
          </p>
        </div>

        {/* ============ RIGHT — Image Panel ============ */}
        <div className="hidden lg:block relative bg-gray-900 overflow-hidden">
          <img
            src="/models/model1.png"
            alt="Fashion Model"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl">
                <h3
                  className="text-2xl font-black uppercase"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Fast
                </h3>
                <p className="mt-1 text-sm text-gray-300">
                  Quick checkout & easy tracking.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl">
                <h3
                  className="text-2xl font-black uppercase"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Secure
                </h3>
                <p className="mt-1 text-sm text-gray-300">
                  Your data is safe with us.
                </p>
              </div>
            </div>
            <h2
              className="text-4xl font-black uppercase tracking-tighter leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Style
              <br />
              Starts
              <br />
              Here.
            </h2>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;
