import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, UserPlus } from 'lucide-react';
import { Input, Button, Card } from '../components/ui';

const initialFormData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
};

const Register = () => {
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Input change hote hi state update hoti hai, isse form controlled rehta hai.
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // User dobara type kare to us field ka old error hata dete hain.
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required.';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required.';
        } else if (!emailPattern.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address.';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required.';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters.';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password.';
        } else if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }

        return newErrors;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSuccessMessage('');

        const validationErrors = validateForm();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        // Yahan API call add kar sakte ho, jaise axios.post('/api/register', formData).
        console.log('Register data:', formData);

        setSuccessMessage('Account created successfully.');
        setFormData(initialFormData);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] p-6 pt-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-primary-light)] rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--color-accent)] rounded-full mix-blend-multiply filter blur-[100px] opacity-10 animate-blob animation-delay-2000"></div>

            <Card className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 overflow-hidden p-0">
                
                {/* Left Side: Graphic/Text */}
                <div className="hidden lg:block relative bg-gray-900 overflow-hidden">
                    <img 
                        src="/models/model2.png" 
                        alt="Fashion Model" 
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                    
                    <div className="absolute bottom-12 left-12 right-12 text-white">
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl">
                                <h3 className="text-2xl font-black uppercase" style={{ fontFamily: "var(--font-heading)" }}>Exclusive Access</h3>
                                <p className="mt-1 text-sm text-gray-300">Get early access to limited edition drops.</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl">
                                <h3 className="text-2xl font-black uppercase" style={{ fontFamily: "var(--font-heading)" }}>Fast Checkout</h3>
                                <p className="mt-1 text-sm text-gray-300">Save your info and never miss a drop.</p>
                            </div>
                        </div>
                        <p className="text-lg font-medium text-gray-300">
                            Join the culture. Create your account today.
                        </p>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="p-8 md:p-12 order-1 lg:order-2">
                    <div className="mb-10">
                        <span className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-4 py-1.5 text-[10px] font-black uppercase tracking-widest mb-4">
                            <UserPlus size={14} strokeWidth={3} />
                            Sign Up
                        </span>
                        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-gray-900" style={{ fontFamily: "var(--font-heading)" }}>
                            Create Account
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Lock in your details below.
                        </p>
                    </div>

                    {successMessage && (
                        <div className="mb-8 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            label="Full Name"
                            icon={<User size={20} strokeWidth={2} />}
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your Name"
                            error={errors.name}
                        />

                        <Input
                            id="email"
                            name="email"
                            type="email"
                            label="Email Address"
                            icon={<Mail size={20} strokeWidth={2} />}
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            error={errors.email}
                        />

                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            label="Password"
                            icon={<Lock size={20} strokeWidth={2} />}
                            rightIcon={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((value) => !value)}
                                    className="hover:text-gray-600 transition-colors focus:outline-none flex items-center justify-center"
                                >
                                    {showPassword ? <EyeOff size={20} strokeWidth={2} /> : <Eye size={20} strokeWidth={2} />}
                                </button>
                            }
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create password"
                            error={errors.password}
                        />

                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            label="Confirm Password"
                            icon={<Lock size={20} strokeWidth={2} />}
                            rightIcon={
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((value) => !value)}
                                    className="hover:text-gray-600 transition-colors focus:outline-none flex items-center justify-center"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} strokeWidth={2} /> : <Eye size={20} strokeWidth={2} />}
                                </button>
                            }
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm password"
                            error={errors.confirmPassword}
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            className="mt-6"
                        >
                            <UserPlus size={20} strokeWidth={2} className="mr-2" />
                            Create Account
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-sm font-medium text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[var(--color-primary)] font-semibold hover:text-red-700 underline decoration-2 underline-offset-4">
                            Log In
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default Register;
