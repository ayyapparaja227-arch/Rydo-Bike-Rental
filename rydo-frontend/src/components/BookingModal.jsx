import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, FileText, Shield, CreditCard, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { bookingsAPI } from '../services/api';
import OTPVerificationModal from '../components/OTPVerificationModal';

export default function BookingModal({ isOpen, onClose, bike }) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [step, setStep] = useState(1); // 1: License upload, 2: Phone verify, 3: Date/Time, 4: Payment
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [bookingData, setBookingData] = useState({
        licenseFile: null,
        licenseNumber: '',
        phoneVerified: false,
        bookingDate: '',
        startTime: '09:00',
        endTime: '18:00',
        hours: 9
    });

    const [showOTPModal, setShowOTPModal] = useState(false);

    if (!isOpen || !bike) return null;

    const calculateHours = (start, end) => {
        const startHour = parseInt(start.split(':')[0]);
        const endHour = parseInt(end.split(':')[0]);
        return Math.max(1, endHour - startHour);
    };

    const calculatePrice = () => {
        const hours = calculateHours(bookingData.startTime, bookingData.endTime);
        const basePrice = bike.hourlyPrice * hours;
        const platformFee = basePrice * 0.10;
        const total = basePrice + platformFee;
        return { basePrice, platformFee, total, hours };
    };

    const handleLicenseUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBookingData({ ...bookingData, licenseFile: file });
        }
    };

    const handleNextStep = () => {
        if (step === 1 && (!bookingData.licenseFile || !bookingData.licenseNumber)) {
            setError('Please upload license and enter license number');
            return;
        }
        if (step === 2 && !bookingData.phoneVerified) {
            setShowOTPModal(true);
            return;
        }
        if (step === 3 && !bookingData.bookingDate) {
            setError('Please select booking date');
            return;
        }

        setError('');
        if (step < 4) {
            setStep(step + 1);
        }
    };

    const handleConfirmBooking = async () => {
        setLoading(true);
        setError('');

        try {
            const pricing = calculatePrice();

            const requestData = {
                bikeId: bike.id,
                renterId: user.id,
                hours: pricing.hours,
                pickupOTP: Math.floor(1000 + Math.random() * 9000).toString(),
                dropoffOTP: Math.floor(1000 + Math.random() * 9000).toString()
            };

            await bookingsAPI.create(requestData);
            alert('✅ Booking confirmed! Check your dashboard for details.');
            onClose();
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
        } finally {
            setLoading(false);
        }
    };

    const handleOTPVerified = ({ contact, verified }) => {
        setBookingData({ ...bookingData, phoneVerified: verified });
        setShowOTPModal(false);
        setStep(3); // Move to next step
    };

    const pricing = calculatePrice();

    return (
        <>
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 my-8 animate-slide-up border-2 border-gray-200">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-gray-100">
                        <div>
                            <h2 className="text-3xl font-bold mb-2 text-gray-900">Book {bike.brand} {bike.model}</h2>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="font-semibold text-blue-600">₹{bike.hourlyPrice}/hour</span>
                                <span>•</span>
                                <span>{bike.location}</span>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl font-light">
                            ×
                        </button>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-between mb-8 px-4">
                        {[
                            { num: 1, label: 'License', icon: FileText },
                            { num: 2, label: 'Verify Phone', icon: Shield },
                            { num: 3, label: 'Select Time', icon: Calendar },
                            { num: 4, label: 'Payment', icon: CreditCard }
                        ].map(({ num, label, icon: Icon }) => (
                            <div key={num} className="flex flex-col items-center flex-1">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${step >= num ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-lg scale-110' : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                                    }`}>
                                    {step > num ? <span className="text-xl">✓</span> : <Icon className="w-5 h-5" />}
                                </div>
                                <span className={`text-xs font-semibold ${step >= num ? 'text-blue-600' : 'text-gray-500'}`}>{label}</span>
                            </div>
                        ))}
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </div>
                    )}

                    {/* Step Content */}
                    <div className="mb-6">
                        {step === 1 && (
                            <div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-gray-900">Upload Your Driving License</h3>
                                    <p className="text-sm text-gray-600 mb-6">
                                        Required for verification and insurance purposes
                                    </p>

                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-gray-700">License Number</label>
                                            <input
                                                type="text"
                                                value={bookingData.licenseNumber}
                                                onChange={(e) => setBookingData({ ...bookingData, licenseNumber: e.target.value.toUpperCase() })}
                                                placeholder="DL-1234567890"
                                                className="input-field text-lg"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-gray-700">Upload License Image</label>
                                            <div className="border-3 border-dashed border-blue-300 bg-blue-50 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-blue-100 transition-all cursor-pointer">
                                                <input
                                                    type="file"
                                                    id="license"
                                                    accept="image/*,.pdf"
                                                    onChange={handleLicenseUpload}
                                                    className="hidden"
                                                />
                                                <label htmlFor="license" className="cursor-pointer">
                                                    <FileText className="w-14 h-14 text-blue-500 mx-auto mb-3" />
                                                    {bookingData.licenseFile ? (
                                                        <p className="text-sm text-green-700 font-semibold">✓ {bookingData.licenseFile.name}</p>
                                                    ) : (
                                                        <>
                                                            <p className="text-base font-semibold text-gray-700 mb-1">Click to upload</p>
                                                            <p className="text-xs text-gray-500">JPG, PNG, or PDF (max 5MB)</p>
                                                        </>
                                                    )}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Verify Your Phone Number</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    We'll send an OTP to confirm your identity and for booking notifications
                                </p>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                                    {bookingData.phoneVerified ? (
                                        <>
                                            <Shield className="w-12 h-12 text-green-600 mx-auto mb-2" />
                                            <p className="text-green-700 font-medium">Phone Verified ✓</p>
                                        </>
                                    ) : (
                                        <>
                                            <Shield className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                                            <p className="text-blue-700 font-medium">Click "Verify Phone" to continue</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div>
                                <h3 className="text-xl font-bold mb-2 text-gray-900">Select Date & Time</h3>
                                <p className="text-sm text-gray-600 mb-6">Choose when you need the bike</p>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-gray-700">Booking Date</label>
                                        <input
                                            type="date"
                                            value={bookingData.bookingDate}
                                            onChange={(e) => setBookingData({ ...bookingData, bookingDate: e.target.value })}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="input-field text-lg"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-gray-700">Start Time</label>
                                            <input
                                                type="time"
                                                value={bookingData.startTime}
                                                onChange={(e) => {
                                                    const newStart = e.target.value;
                                                    const hours = calculateHours(newStart, bookingData.endTime);
                                                    setBookingData({ ...bookingData, startTime: newStart, hours });
                                                }}
                                                className="input-field text-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-gray-700">End Time</label>
                                            <input
                                                type="time"
                                                value={bookingData.endTime}
                                                onChange={(e) => {
                                                    const newEnd = e.target.value;
                                                    const hours = calculateHours(bookingData.startTime, newEnd);
                                                    setBookingData({ ...bookingData, endTime: newEnd, hours });
                                                }}
                                                className="input-field text-lg"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-xl p-5">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-gray-700">Total Duration:</span>
                                            <span className="text-2xl font-bold text-blue-600">{pricing.hours} hours</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {step === 4 && (
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Confirm Payment</h3>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Base Price ({pricing.hours} hours)</span>
                                        <span>₹{pricing.basePrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Platform Fee (10%)</span>
                                        <span>₹{pricing.platformFee.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t pt-3 flex justify-between text-lg font-bold">
                                        <span>Total Amount</span>
                                        <span className="text-blue-600">₹{pricing.total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                                    <p className="text-sm text-green-700">
                                        ✓ License verified<br />
                                        ✓ Phone verified<br />
                                        ✓ {bookingData.bookingDate} • {bookingData.startTime} - {bookingData.endTime}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        {step > 1 && (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="btn-secondary flex-1"
                            >
                                Back
                            </button>
                        )}

                        {step < 4 ? (
                            <button
                                onClick={step === 2 && !bookingData.phoneVerified ? () => setShowOTPModal(true) : handleNextStep}
                                className="btn-primary flex-1"
                            >
                                {step === 2 && !bookingData.phoneVerified ? 'Verify Phone' : 'Continue'}
                            </button>
                        ) : (
                            <button
                                onClick={handleConfirmBooking}
                                disabled={loading}
                                className="btn-primary flex-1"
                            >
                                {loading ? 'Processing...' : `Pay ₹${pricing.total.toFixed(2)} & Book`}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <OTPVerificationModal
                isOpen={showOTPModal}
                onClose={() => setShowOTPModal(false)}
                onVerify={handleOTPVerified}
                verificationType="phone"
            />
        </>
    );
}
