import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, User, UserPlus, AlertCircle, Check, Flame } from "lucide-react";
import { Input, Button, Card, BackButton } from "../components/ui";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL || "/api"}/auth/register`;

const initialFormData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage("");
    setApiError("");

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);
      await axios.post(API_URL, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      setSuccessMessage("Account created successfully! Redirecting to sign in...");
      setFormData(initialFormData);
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setApiError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[var(--color-bg)] p-4 sm:p-6 py-12 relative overflow-hidden">
      {/* Ambient background styling */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-20">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,var(--color-text)_1px,transparent_0)] bg-[length:32px_32px]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mb-4 flex justify-start">
        <BackButton />
      </div>

      <Card className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 overflow-hidden p-0 rounded-3xl border border-neutral-200/80 shadow-lg bg-white">
        
        {/* Left Side: Graphic / Benefits (5 Cols) */}
        <div className="hidden lg:flex lg:col-span-5 relative bg-neutral-900 text-white p-8 md:p-10 flex-col justify-between overflow-hidden">
          <img
            src="/models/model2.png"
            alt="Streetwear Look"
            className="absolute inset-0 w-full h-full object-cover object-top opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/60 to-transparent"></div>

          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[var(--color-primary)]">
              <Flame size={14} className="fill-[var(--color-primary)]" />
              Join The Movement
            </span>
            <h2
              className="text-3xl font-black uppercase tracking-tight text-white mt-2 leading-none"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Become A <br />
              <span className="text-[var(--color-primary)]">Member</span>
            </h2>
          </div>

          <div className="relative z-10 space-y-3 pt-12">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs space-y-1">
              <p className="font-black uppercase text-white flex items-center gap-1.5">
                <Check size={14} className="text-emerald-400" />
                10% Off First Drop
              </p>
              <p className="text-neutral-300 text-[11px]">Instant member welcome code applied at checkout.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs space-y-1">
              <p className="font-black uppercase text-white flex items-center gap-1.5">
                <Check size={14} className="text-emerald-400" />
                Priority 14-Day Exchanges
              </p>
              <p className="text-neutral-300 text-[11px]">Free hassle-free doorstep size replacements.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Register Form (7 Cols) */}
        <div className="lg:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-between">
          <div>
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-3 py-1 text-[10px] font-black uppercase tracking-widest mb-3">
                <UserPlus size={12} strokeWidth={3} />
                New Membership
              </span>
              <h1
                className="text-3xl md:text-4xl font-black uppercase tracking-tight text-neutral-900 leading-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Create <span className="text-[var(--color-primary)]">Account</span>
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-neutral-500 font-medium">
                Lock in your details to secure upcoming limited drops.
              </p>
            </div>

            {apiError && (
              <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
                <AlertCircle size={16} className="shrink-0 text-red-500" />
                <span>{apiError}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800">
                <Check size={16} className="shrink-0 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                id="name"
                name="name"
                type="text"
                label="Full Name"
                icon={<User size={18} strokeWidth={2} />}
                value={formData.name}
                onChange={handleChange}
                placeholder="Raaz Sen"
                error={errors.name}
              />

              <Input
                id="email"
                name="email"
                type="email"
                label="Email Address"
                icon={<Mail size={18} strokeWidth={2} />}
                value={formData.email}
                onChange={handleChange}
                placeholder="raaz@example.com"
                error={errors.email}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  placeholder="Min 6 chars"
                  error={errors.password}
                />

                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  label="Confirm Password"
                  icon={<Lock size={18} strokeWidth={2} />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="hover:text-neutral-900 transition-colors focus:outline-none flex items-center justify-center text-neutral-400"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  error={errors.confirmPassword}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                className="mt-6 py-3.5 text-xs font-black uppercase tracking-wider shadow-md"
                icon={<UserPlus size={16} />}
              >
                {loading ? "Creating Member Account..." : "Join The Club"}
              </Button>
            </form>
          </div>

          <p className="mt-8 text-center text-xs font-medium text-neutral-500">
            Already a member?{" "}
            <Link
              to="/login"
              className="text-neutral-900 font-bold hover:text-[var(--color-primary)] underline decoration-2 underline-offset-4"
            >
              Sign In
            </Link>
          </p>
        </div>

      </Card>
    </div>
  );
};

export default Register;
