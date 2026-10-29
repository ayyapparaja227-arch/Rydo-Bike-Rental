import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bike, Mail, Lock, User, Phone, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import axios from 'axios';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // Email OTP States
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);

    const sendEmailOtp = async () => {
        if (!formData.email || !formData.email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }

        setSendingOtp(true);
        setError('');

        try {
            const response = await axios.post('/api/auth/send-otp', { email: formData.email });
            setOtpSent(true);
            // Always show demo OTP for testing
            setSuccess('✅ OTP sent! Use Demo OTP: 123456');
        } catch (err) {
            // Show demo OTP even if email fails
            setOtpSent(true);
            setSuccess('✅ Use Demo OTP: 123456');
        } finally {
            setSendingOtp(false);
        }
    };

    const verifyEmailOtp = async () => {
        if (!otp || otp.length !== 6) {
            setError('Please enter 6-digit OTP');
            return;
        }

        // Accept demo OTP 123456 directly
        if (otp === '123456') {
            setEmailVerified(true);
            setSuccess('✅ Email verified successfully!');
            return;
        }

        setVerifyingOtp(true);
        setError('');

        try {
            const response = await axios.post('/api/auth/verify-otp', {
                email: formData.email,
                otp: otp
            });
            if (response.data.success) {
                setEmailVerified(true);
                setSuccess('✅ Email verified successfully!');
            } else {
                setError('Invalid OTP. Use demo OTP: 123456');
            }
        } catch (err) {
            setError('Invalid OTP. Use demo OTP: 123456');
        } finally {
            setVerifyingOtp(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!emailVerified) {
            setError('Please verify your email first');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const response = await authAPI.register(formData);
            if (response.data.success) {
                login(response.data.user);
                navigate('/dashboard');
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-12">
            <div className="max-w-md w-full">
                <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
                    <Bike className="w-10 h-10 text-blue-600" />
                    <span className="text-3xl font-bold text-gradient">Rydo</span>
                </Link>

                <div className="glass rounded-2xl p-8">
                    <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>
                    <p className="text-center text-gray-600 mb-8">Join India's first hourly bike sharing platform</p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-red-800 text-sm">{error}</p>
                        </div>
                    )}

                    {success && !error && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <p className="text-green-800 text-sm">{success}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    className="input pl-12"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Email with OTP */}
                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                Email Address
                                {emailVerified && <span className="text-green-600 ml-2">✅ Verified</span>}
                            </label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        className="input pl-12"
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        onChange={(e) => {
                                            setFormData({ ...formData, email: e.target.value });
                                            setOtpSent(false);
                                            setEmailVerified(false);
                                        }}
                                        disabled={emailVerified}
                                        required
                                    />
                                </div>
                                {!emailVerified && (
                                    <button
                                        type="button"
                                        onClick={sendEmailOtp}
                                        disabled={sendingOtp || !formData.email.includes('@')}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                                    >
                                        {sendingOtp ? (
                                            <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                                        ) : otpSent ? 'Resend OTP' : 'Send OTP'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* OTP Input */}
                        {otpSent && !emailVerified && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <label className="block text-sm font-semibold mb-2">Enter OTP from Email</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        className="input flex-1 text-center text-xl tracking-widest"
                                        placeholder="______"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        maxLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={verifyEmailOtp}
                                        disabled={verifyingOtp || otp.length !== 6}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {verifyingOtp ? (
                                            <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</>
                                        ) : 'Verify'}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Check your inbox & spam folder. OTP valid for 5 minutes.</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold mb-2">Phone (Optional)</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="tel"
                                    className="input pl-12"
                                    placeholder="9876543210"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    maxLength={10}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    className="input pl-12"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <p className="text-green-800 text-sm">Get 100 EarnCoins as sign-up bonus!</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !emailVerified}
                            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating Account...' : emailVerified ? 'Create Account' : 'Verify Email First'}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                            Sign In
                        </Link>
                    </p>
                </div>

                <p className="text-center mt-6 text-gray-600">
                    <Link to="/" className="text-blue-600 hover:text-blue-700">
                        ← Back to Home
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
