import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bike, Users, DollarSign, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [pendingBikes, setPendingBikes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            navigate('/');
            return;
        }
        loadAdminData();
    }, [user]);

    const loadAdminData = async () => {
        try {
            const [analyticsRes, bikesRes] = await Promise.all([
                adminAPI.getAnalytics(),
                adminAPI.getPendingBikes(),
            ]);
            setAnalytics(analyticsRes.data);
            setPendingBikes(bikesRes.data);
        } catch (error) {
            console.error('Error loading admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveBike = async (bikeId) => {
        try {
            await adminAPI.approveBike(bikeId);
            loadAdminData();
            alert('Bike approved successfully!');
        } catch (error) {
            alert('Error approving bike');
        }
    };

    const handleRejectBike = async (bikeId) => {
        try {
            await adminAPI.rejectBike(bikeId);
            loadAdminData();
            alert('Bike rejected');
        } catch (error) {
            alert('Error rejecting bike');
        }
    };

    if (!user || user.role !== 'ADMIN') return null;

    return (
        <div className="min-h-screen">
            <nav className="glass sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Bike className="w-8 h-8 text-blue-600" />
                            <span className="text-2xl font-bold text-gradient">Rydo Admin</span>
                        </div>
                        <button onClick={() => navigate('/dashboard')} className="text-blue-600 hover:text-blue-700 font-semibold">
                            My Dashboard →
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <h1 className="text-4xl font-bold mb-8">Platform Overview</h1>

                {/* Analytics */}
                {analytics && (
                    <div className="grid md:grid-cols-4 gap-6 mb-12">
                        <div className="glass rounded-xl p-6">
                            <div className="flex items-center gap-3">
                                <Users className="w-10 h-10 text-blue-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Total Users</p>
                                    <p className="text-3xl font-bold">{analytics.totalUsers}</p>
                                </div>
                            </div>
                        </div>

                        <div className="glass rounded-xl p-6">
                            <div className="flex items-center gap-3">
                                <Bike className="w-10 h-10 text-green-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Total Bikes</p>
                                    <p className="text-3xl font-bold">{analytics.totalBikes}</p>
                                </div>
                            </div>
                        </div>

                        <div className="glass rounded-xl p-6">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="w-10 h-10 text-purple-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Total Bookings</p>
                                    <p className="text-3xl font-bold">{analytics.totalBookings}</p>
                                </div>
                            </div>
                        </div>

                        <div className="glass rounded-xl p-6">
                            <div className="flex items-center gap-3">
                                <DollarSign className="w-10 h-10 text-yellow-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Revenue</p>
                                    <p className="text-3xl font-bold">₹{analytics.platformRevenue?.toFixed(0) || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pending Approvals */}
                <div>
                    <h2 className="text-2xl font-bold mb-6">Pending Bike Approvals ({pendingBikes.length})</h2>
                    {pendingBikes.length === 0 ? (
                        <div className="glass rounded-xl p-12 text-center">
                            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                            <p className="text-gray-600">All bikes approved!</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {pendingBikes.map((bike) => (
                                <div key={bike.id} className="glass rounded-xl p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg">{bike.brand} {bike.model}</h3>
                                            <p className="text-sm text-gray-600">{bike.location}</p>
                                            <p className="text-sm text-gray-600">Owner ID: {bike.ownerId}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-blue-600">₹{bike.hourlyPrice}</p>
                                            <p className="text-xs text-gray-500">per hour</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mb-4 text-sm">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                                            {bike.bikeType}
                                        </span>
                                        <span className="text-gray-600">{bike.year}</span>
                                        <span>•</span>
                                        <span className="text-gray-600">{bike.fuelType}</span>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-4">{bike.description}</p>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleApproveBike(bike.id)}
                                            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleRejectBike(bike.id)}
                                            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
