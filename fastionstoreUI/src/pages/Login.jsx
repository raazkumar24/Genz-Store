import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Zap,
  Check,
} from "lucide-react";
import { Input, Button, Card, BackButton } from "../components/ui";
import axios from "axios";
import { API_URL } from "../services/api";

// Backend real login API endpoint
const LOGIN_API_URL = `${API_URL}/auth/login`;

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  };

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError("");

    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      const response = await axios.post(LOGIN_API_URL, {
        email: formData.email.trim(),
        password: formData.password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);

      window.dispatchEvent(new Event("authChange"));

      if (user.role === "admin") {
        navigate("/admin/products");
      } else {
        navigate("/");
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[var(--color-bg)] p-4 sm:p-6 py-12 relative overflow-hidden">
      {/* Background Subtle Ambient Gradients */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-20">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,var(--color-text)_1px,transparent_0)] bg-[length:32px_32px]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mb-4 flex justify-start">
        <BackButton />
      </div>

      <Card className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 overflow-hidden p-0 rounded-3xl border border-neutral-200/80 shadow-lg bg-white">
        {/* ============ LEFT — Login Form (7 Cols) ============ */}
        <div className="lg:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-between">
          <div>
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest mb-3">
                <LogIn
                  size={12}
                  strokeWidth={3}
                  className="text-[var(--color-primary)]"
                />
                Member Access
              </span>
              <h1
                className="text-3xl md:text-4xl font-black uppercase tracking-tight text-neutral-900 leading-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Welcome{" "}
                <span className="text-[var(--color-primary)]">Back</span>
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-neutral-500 font-medium">
                Sign in to manage your drops, wishlist, and exclusive member
                perks.
              </p>
            </div>

            {/* API Error Banner */}
            {apiError && (
              <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
                <AlertCircle size={16} className="shrink-0 text-red-500" />
                <span>{apiError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <Input
                id="email"
                name="email"
                type="email"
                label="Email Address"
                icon={<Mail size={18} strokeWidth={2} />}
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                error={errors.email}
              />

              {/* Password Field */}
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                icon={<Lock size={18} strokeWidth={2} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="hover:text-neutral-900 transition-colors focus:outline-none flex items-center justify-center text-neutral-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                className="mt-6 py-3.5 text-xs font-black uppercase tracking-wider shadow-md"
                loading={loading}
                icon={<LogIn size={16} />}
              >
                {loading ? "Authenticating..." : "Sign In"}
              </Button>
            </form>
          </div>

          <p className="mt-8 text-center text-xs font-medium text-neutral-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-neutral-900 font-bold hover:text-[var(--color-primary)] underline decoration-2 underline-offset-4"
            >
              Create Account
            </Link>
          </p>
        </div>

        {/* ============ RIGHT — Image & Streetwear Perks (5 Cols) ============ */}
        <div className="hidden lg:flex lg:col-span-5 relative bg-neutral-900 text-white p-8 md:p-10 flex-col justify-between overflow-hidden">
          <img
            src="/models/model1.png"
            alt="Streetwear Look"
            className="absolute inset-0 w-full h-full object-cover object-top opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/60 to-transparent"></div>

          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[var(--color-primary)]">
              <Zap size={14} />
              Genz Club
            </span>
            <h2
              className="text-3xl font-black uppercase tracking-tight text-white mt-2 leading-none"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Unlock Drop <br />
              <span className="text-[var(--color-primary)]">Exclusives</span>
            </h2>
          </div>

          <div className="relative z-10 space-y-3 pt-12">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs space-y-1">
              <p className="font-black uppercase text-white flex items-center gap-1.5">
                <Check size={14} className="text-emerald-400" />
                Early Access Drops
              </p>
              <p className="text-neutral-300 text-[11px]">
                Get 30-minute headstart on limited capsule releases.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs space-y-1">
              <p className="font-black uppercase text-white flex items-center gap-1.5">
                <Check size={14} className="text-emerald-400" />
                1-Click Express Checkout
              </p>
              <p className="text-neutral-300 text-[11px]">
                Save shipping & billing for fastest drops.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;
