import { useState } from 'react';
import { Phone, Mail, Lock } from 'lucide-react';
import axios from 'axios';

export default function OTPVerificationModal({ isOpen, onClose, onVerify, verificationType = 'phone' }) {
    const [step, setStep] = useState(1); // 1: Enter phone/email, 2: Enter OTP
    const [contact, setContact] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [generatedOTP, setGeneratedOTP] = useState('');

    if (!isOpen) return null;

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (verificationType === 'email') {
                // Real Email OTP
                await axios.post('/api/auth/send-otp', { email: contact });
                alert(`✅ OTP Sent to ${contact}! Check your email (and spam folder).`);
            } else {
                // Mock Phone OTP (since SMS is not integrated yet)
                const mockOTP = Math.floor(100000 + Math.random() * 900000).toString();
                setGeneratedOTP(mockOTP);
                await new Promise(resolve => setTimeout(resolve, 1000));
                alert(`✅ OTP Sent! (Demo Mode: Use ${mockOTP})`);
            }
            setStep(2);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (verificationType === 'email') {
                // Real Email Verification
                const response = await axios.post('/api/auth/verify-otp', { email: contact, otp });
                if (response.data.success) {
                    alert('✅ Verified successfully!');
                    onVerify({ contact, verified: true });
                    onClose();
                }
            } else {
                // Mock Phone Verification
                if (otp === generatedOTP || otp === '123456') {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    alert('✅ Verified successfully!');
                    onVerify({ contact, verified: true });
                    onClose();
                } else {
                    setError('Invalid OTP. Please try again.');
                }
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Verification failed. Invalid OTP.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="glass-card max-w-md w-full p-8 animate-slide-up">
                <h2 className="text-2xl font-bold mb-2">Verify Your {verificationType === 'phone' ? 'Phone Number' : 'Email'}</h2>
                <p className="text-gray-600 mb-6">Required for booking verification and security</p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleSendOTP}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">
                                {verificationType === 'phone' ? 'Phone Number' : 'Email Address'}
                            </label>
                            <div className="relative">
                                {verificationType === 'phone' ? (
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                ) : (
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                )}
                                <input
                                    type={verificationType === 'phone' ? 'tel' : 'email'}
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
                                    placeholder={verificationType === 'phone' ? '+91 98765 43210' : 'your@email.com'}
                                    className="input-field pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary flex-1"
                            >
                                {loading ? 'Sending...' : 'Send OTP'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn-secondary flex-1"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOTP}>
                        <p className="text-sm text-gray-600 mb-4">
                            We've sent a 6-digit code to {contact}
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="text-blue-600 ml-2 underline"
                            >
                                Change
                            </button>
                        </p>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Enter OTP</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="123456"
                                    className="input-field pl-10 text-center text-2xl tracking-widest"
                                    maxLength={6}
                                    required
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                💡 Demo Mode: Use <code className="bg-gray-100 px-2 py-1 rounded">123456</code> or the OTP shown in alert
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={loading || otp.length !== 6}
                                className="btn-primary flex-1"
                            >
                                {loading ? 'Verifying...' : 'Verify'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setStep(1);
                                    setOtp('');
                                    setError('');
                                }}
                                className="btn-secondary flex-1"
                            >
                                Resend OTP
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
