import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bike, Clock, DollarSign, Shield, Sparkles, TrendingUp, Users, Map } from 'lucide-react';
import { bikesAPI } from '../services/api';

const LandingPage = () => {
    const navigate = useNavigate();
    const [featuredBikes, setFeaturedBikes] = useState([]);
    const [searchLocation, setSearchLocation] = useState('');

    useEffect(() => {
        loadFeaturedBikes();
    }, []);

    const loadFeaturedBikes = async () => {
        try {
            const response = await bikesAPI.getFeatured();
            setFeaturedBikes(response.data.slice(0, 6));
        } catch (error) {
            console.error('Error loading featured bikes:', error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/search?location=${searchLocation}`);
    };

    return (
        <div className="min-h-screen">
            {/* Navbar */}
            <nav className="glass fixed top-0 left-0 right-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Bike className="w-8 h-8 text-blue-600" />
                        <span className="text-2xl font-bold text-gradient">Rydo</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link to="/search" className="text-gray-700 hover:text-blue-600 font-medium">Browse Bikes</Link>
                        <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">Login</Link>
                        <Link to="/register" className="btn-primary">Get Started</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full mb-6 animate-slide-up">
                            <Sparkles className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-semibold">India's First Hourly Bike Sharing Platform</span>
                        </div>

                        <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
                            Own a bike?{' '}
                            <span className="text-gradient">Earn hourly.</span>
                            <br />
                            Need a bike?{' '}
                            <span className="text-gradient">Ride hourly.</span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                            One platform. Zero friction. Turn your idle bike into earnings or rent one for just the hours you need.
                        </p>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="max-w-2xl mx-auto glass p-2 rounded-2xl flex items-center gap-2">
                            <Map className="w-5 h-5 text-gray-400 ml-4" />
                            <input
                                type="text"
                                placeholder="Enter your location (e.g., Mumbai, Bangalore...)"
                                className="flex-1 bg-transparent px-4 py-4 outline-none text-lg"
                                value={searchLocation}
                                onChange={(e) => setSearchLocation(e.target.value)}
                            />
                            <button type="submit" className="btn-primary !rounded-xl">
                                Search Bikes
                            </button>
                        </form>

                        {/* Stats */}
                        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                            <div>
                                <div className="text-4xl font-bold text-gradient">500+</div>
                                <div className="text-gray-600 mt-1">Bikes Available</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-gradient">1000+</div>
                                <div className="text-gray-600 mt-1">Happy Users</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-gradient">₹50/hr</div>
                                <div className="text-gray-600 mt-1">Starting Price</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-6 bg-white/50">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16">Why Choose Rydo?</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="card text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Clock className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Hourly Rentals</h3>
                            <p className="text-gray-600">
                                Book bikes for just the hours you need. No daily commitments, maximum flexibility.
                            </p>
                        </div>

                        <div className="card text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <TrendingUp className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Dynamic Pricing</h3>
                            <p className="text-gray-600">
                                Smart pricing based on demand. Get discounts during off-peak hours.
                            </p>
                        </div>

                        <div className="card text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <DollarSign className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">EarnCoins Rewards</h3>
                            <p className="text-gray-600">
                                Earn coins with every rental. Use them for discounts and premium features.
                            </p>
                        </div>

                        <div className="card text-center">
                            <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Shield className="w-8 h-8 text-yellow-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">AI Safety Check</h3>
                            <p className="text-gray-600">
                                RideGuard AI analyzes bike condition before every ride for your safety.
                            </p>
                        </div>

                        <div className="card text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Users className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">TrustShield Verified</h3>
                            <p className="text-gray-600">
                                All users verified with trust scores. Rent with confidence.
                            </p>
                        </div>

                        <div className="card text-center">
                            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Map className="w-8 h-8 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Local Discovery</h3>
                            <p className="text-gray-600">
                                Find bikes near you on our map. See real-time availability.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Bikes */}
            {featuredBikes.length > 0 && (
                <section className="py-20 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-4xl font-bold">Featured Bikes</h2>
                            <Link to="/search" className="text-blue-600 hover:text-blue-700 font-semibold">
                                View All →
                            </Link>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {featuredBikes.map((bike) => (
                                <div key={bike.id} className="card group" onClick={() => navigate(`/bikes/${bike.id}`)}>
                                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-green-100 rounded-lg mb-4 flex items-center justify-center">
                                        <Bike className="w-16 h-16 text-blue-600 group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="font-bold text-lg">{bike.brand} {bike.model}</h3>
                                            <p className="text-sm text-gray-600">{bike.location}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-blue-600">₹{bike.hourlyPrice}</div>
                                            <div className="text-xs text-gray-500">per hour</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                                            {bike.bikeType}
                                        </span>
                                        <span>• {bike.fuelType}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-green-600">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <h2 className="text-5xl font-bold mb-6">Ready to Start Your Journey?</h2>
                    <p className="text-xl mb-8 opacity-90">
                        Join thousands of riders and owners making mobility simple, affordable, and sustainable.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Link to="/register" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:shadow-2xl transition-all">
                            Sign Up Now
                        </Link>
                        <Link to="/search" className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition-all">
                            Browse Bikes
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-6 bg-gray-900 text-white text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                    <Bike className="w-6 h-6" />
                    <span className="text-lg font-bold">Rydo</span>
                </div>
                <p className="text-gray-400">India's First Hourly Peer-to-Peer Bike Sharing Platform</p>
                <p className="text-gray-500 text-sm mt-2">© 2024 Rydo. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
