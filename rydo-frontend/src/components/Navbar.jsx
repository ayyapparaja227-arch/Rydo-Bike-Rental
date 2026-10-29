import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bike, Bell, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function Navbar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch notifications when component mounts or when notifications dropdown opens
    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Poll for new notifications every 30 seconds
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchNotifications = async () => {
        if (!user) return;

        try {
            const response = await axios.get(`/api/notifications/user/${user.id}`);
            setNotifications(response.data);

            const countResponse = await axios.get(`/api/notifications/user/${user.id}/unread-count`);
            setUnreadCount(countResponse.data.count || 0);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await axios.put(`/api/notifications/${notificationId}/read`);
            fetchNotifications(); // Refresh notifications
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const notifTime = new Date(timestamp);
        const diffMs = now - notifTime;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        return notifTime.toLocaleDateString();
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="glass sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-2">
                    <Bike className="w-8 h-8 text-blue-600" />
                    <span className="text-2xl font-bold gradient-text">Rydo</span>
                </Link>

                {/* Right Side */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            {/* List Your Bike Button */}
                            <Link
                                to="/add-bike"
                                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                            >
                                <span className="text-lg">+</span>
                                List Your Bike
                            </Link>

                            {/* Notifications */}
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setShowNotifications(!showNotifications);
                                        setShowProfileMenu(false);
                                    }}
                                    className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <Bell className="w-5 h-5 text-gray-700" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                {/* Notifications Dropdown */}
                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl p-4 animate-slide-up border-2 border-gray-100 max-h-96 overflow-y-auto">
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="font-bold text-lg">Notifications</h3>
                                            {unreadCount > 0 && (
                                                <span className="text-xs text-blue-600 font-semibold">{unreadCount} new</span>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            {notifications.length === 0 ? (
                                                <p className="text-center text-gray-500 py-8">No notifications yet</p>
                                            ) : (
                                                notifications.map((notif) => (
                                                    <div
                                                        key={notif.id}
                                                        onClick={() => {
                                                            if (!notif.isRead) markAsRead(notif.id);
                                                        }}
                                                        className={`p-3 rounded-lg cursor-pointer transition-colors ${notif.isRead ? 'bg-gray-50 hover:bg-gray-100' : 'bg-blue-50 hover:bg-blue-100'
                                                            }`}
                                                    >
                                                        <p className={`text-sm ${notif.isRead ? 'text-gray-700' : 'font-semibold text-gray-900'}`}>
                                                            {notif.message}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(notif.createdAt)}</p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Profile Menu */}
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setShowProfileMenu(!showProfileMenu);
                                        setShowNotifications(false);
                                    }}
                                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                </button>

                                {/* Profile Dropdown */}
                                {showProfileMenu && (
                                    <div className="absolute right-0 mt-2 w-64 glass rounded-xl shadow-lg p-4 animate-slide-up">
                                        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold">{user.name}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                                {user.verified && (
                                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                                        ✓ Verified
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Link
                                                to="/dashboard"
                                                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                onClick={() => setShowProfileMenu(false)}
                                            >
                                                <User className="w-4 h-4" />
                                                <span className="text-sm">Dashboard</span>
                                            </Link>
                                            <Link
                                                to="/settings"
                                                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                onClick={() => setShowProfileMenu(false)}
                                            >
                                                <Settings className="w-4 h-4" />
                                                <span className="text-sm">Settings</span>
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2 p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span className="text-sm">Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex gap-3">
                            <Link to="/login" className="btn-secondary">
                                Login
                            </Link>
                            <Link to="/register" className="btn-primary">
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
