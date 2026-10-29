import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Fuel, Gauge, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { bikesAPI, availabilityAPI } from '../services/api';
import Navbar from '../components/Navbar';
import BookingModal from '../components/BookingModal';

export default function BikeDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [bike, setBike] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        loadBikeDetails();
    }, [id]);

    const loadBikeDetails = async () => {
        try {
            const bikeResponse = await bikesAPI.getById(id);
            setBike(bikeResponse.data);
        } catch (error) {
            console.error('Error loading bike details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBookNow = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setShowBookingModal(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    if (!bike) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-gray-600">Bike not found</p>
            </div>
        );
    }

    const images = [bike.imageUrl1, bike.imageUrl2, bike.imageUrl3].filter(Boolean);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
                >
                    ← Back
                </button>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Bike Images */}
                    <div>
                        <div className="relative aspect-video rounded-2xl overflow-hidden mb-4">
                            {images.length > 0 ? (
                                <>
                                    <img
                                        src={images[currentImageIndex]}
                                        alt={`${bike.brand} ${bike.model}`}
                                        className="w-full h-full object-cover"
                                    />
                                    {images.length > 1 && (
                                        <>
                                            <button
                                                onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
                                            >
                                                <ChevronLeft className="w-6 h-6" />
                                            </button>
                                            <button
                                                onClick={() => setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
                                            >
                                                <ChevronRight className="w-6 h-6" />
                                            </button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                                    <span className="text-gray-400">No image</span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {images.length > 1 && (
                            <div className="grid grid-cols-3 gap-4">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`aspect-video rounded-lg overflow-hidden ${idx === currentImageIndex ? 'ring-4 ring-blue-500' : ''
                                            }`}
                                    >
                                        <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Bike Details */}
                    <div>
                        <h1 className="text-4xl font-bold mb-2">{bike.brand} {bike.model}</h1>
                        <p className="text-gray-600 flex items-center gap-2 mb-6">
                            <MapPin className="w-4 h-4" />
                            {bike.location}
                        </p>

                        <div className="glass-card p-6 mb-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-gray-600 text-sm">Hourly Rate</p>
                                    <p className="text-4xl font-bold text-blue-600">₹{bike.hourlyPrice}</p>
                                </div>
                                {bike.dynamicPricing && (
                                    <div className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg font-semibold">
                                        🔥 Surge Pricing
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Gauge className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Type</p>
                                        <p className="font-semibold">{bike.bikeType}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <Fuel className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Fuel</p>
                                        <p className="font-semibold">{bike.fuelType}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                        <Star className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Rating</p>
                                        <p className="font-semibold">{bike.averageRating?.toFixed(1) || 'N/A'} ⭐</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                        <span className="text-yellow-600 font-bold">Y</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Year</p>
                                        <p className="font-semibold">{bike.year}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleBookNow}
                                className="btn-primary w-full text-lg py-4"
                            >
                                🚲 Book Now
                            </button>
                        </div>

                        <div className="glass-card p-6">
                            <h3 className="font-bold text-lg mb-3">Description</h3>
                            <p className="text-gray-700">{bike.description}</p>

                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bike.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                            bike.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                        }`}>
                                        {bike.status}
                                    </span>
                                    {bike.autoApproveBookings && (
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                            ⚡ Instant Booking
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BookingModal
                isOpen={showBookingModal}
                onClose={() => setShowBookingModal(false)}
                bike={bike}
            />
        </div>
    );
}
