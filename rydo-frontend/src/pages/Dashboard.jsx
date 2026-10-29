import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bike, Calendar, Coins, TrendingUp, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { bikesAPI, bookingsAPI } from '../services/api';
import Navbar from '../components/Navbar';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [myBikes, setMyBikes] = useState([]);
    const [myBookings, setMyBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingBikeId, setDeletingBikeId] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        loadDashboardData();
    }, [user]);

    const loadDashboardData = async () => {
        try {
            if (user.role === 'OWNER' || user.bikesListed > 0) {
                const bikesResponse = await bikesAPI.getOwnerBikes(user.id);
                setMyBikes(bikesResponse.data);
            }

            const bookingsResponse = await bookingsAPI.getRenterBookings(user.id);
            setMyBookings(bookingsResponse.data);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBike = async (e, bikeId, bikeName) => {
        e.stopPropagation(); // Prevent card click navigation

        if (!window.confirm(`Are you sure you want to remove "${bikeName}"? This action cannot be undone.`)) {
            return;
        }

        setDeletingBikeId(bikeId);
        try {
            await bikesAPI.delete(bikeId);
            setMyBikes(prev => prev.filter(bike => bike.id !== bikeId));
            alert('✅ Bike removed successfully!');
        } catch (error) {
            console.error('Error deleting bike:', error);
            alert('❌ Failed to remove bike. Please try again.');
        } finally {
            setDeletingBikeId(null);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Welcome back, {user.name}!</h1>
                        <p className="text-gray-600">Manage your bikes and bookings</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-4 gap-6 mb-12">
                    <div className="glass rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingUp className="w-10 h-10 text-blue-600" />
                            <div>
                                <p className="text-sm text-gray-600">Trust Score</p>
                                <p className="text-2xl font-bold">{user.trustScore?.toFixed(1) || '0.0'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Coins className="w-10 h-10 text-yellow-600" />
                            <div>
                                <p className="text-sm text-gray-600">EarnCoins</p>
                                <p className="text-2xl font-bold">{user.earnCoins || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Bike className="w-10 h-10 text-green-600" />
                            <div>
                                <p className="text-sm text-gray-600">Bikes Listed</p>
                                <p className="text-2xl font-bold">{myBikes.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Calendar className="w-10 h-10 text-purple-600" />
                            <div>
                                <p className="text-sm text-gray-600">Total Bookings</p>
                                <p className="text-2xl font-bold">{myBookings.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* My Bikes */}
                {myBikes.length > 0 && (
                    <div className="mb-12">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">My Bikes</h2>
                            <Link to="/add-bike" className="btn-primary">
                                + List a Bike
                            </Link>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {myBikes.map((bike) => (
                                <div key={bike.id} className="card relative group" onClick={() => navigate(`/bikes/${bike.id}`)}>
                                    {/* Remove Button */}
                                    <button
                                        onClick={(e) => handleDeleteBike(e, bike.id, `${bike.brand} ${bike.model}`)}
                                        disabled={deletingBikeId === bike.id}
                                        className="absolute top-3 right-3 z-10 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Remove this bike"
                                    >
                                        {deletingBikeId === bike.id ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <Trash2 className="w-5 h-5" />
                                        )}
                                    </button>

                                    <div className="aspect-video bg-gray-900 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                                        {bike.imageUrl1 ? (
                                            <img
                                                src={bike.imageUrl1}
                                                alt={`${bike.brand} ${bike.model}`}
                                                className="w-full h-full object-contain"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80';
                                                }}
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <Bike className="w-12 h-12 text-blue-600" />
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-lg mb-1">{bike.brand} {bike.model}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{bike.location}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-blue-600 font-bold">₹{bike.hourlyPrice}/hr</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bike.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                            bike.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {bike.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* My Bookings */}
                <div>
                    <h2 className="text-2xl font-bold mb-6">My Bookings</h2>
                    {myBookings.length === 0 ? (
                        <div className="glass rounded-xl p-12 text-center">
                            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 mb-4">No bookings yet</p>
                            <button onClick={() => navigate('/search')} className="btn-primary">
                                Browse Bikes
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {myBookings.map((booking) => (
                                <div key={booking.id} className="glass rounded-xl p-6 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">Booking #{booking.id}</h3>
                                        <p className="text-sm text-gray-600">{booking.hours} hours • ₹{booking.totalPrice}</p>
                                    </div>
                                    <span className={`px-4 py-2 rounded-full font-semibold ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                                        booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                            booking.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                                                'bg-red-100 text-red-700'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

export default Dashboard;
