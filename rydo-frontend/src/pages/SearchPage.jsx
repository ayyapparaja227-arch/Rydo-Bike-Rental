import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Bike, Filter, MapPin, DollarSign, Navigation } from 'lucide-react';
import { bikesAPI } from '../services/api';
import LocationPicker from '../components/LocationPicker';

const SearchPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [bikes, setBikes] = useState([]);
    const [filters, setFilters] = useState({
        location: searchParams.get('location') || '',
        bikeType: '',
        minPrice: '',
        maxPrice: '',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBikes();
    }, [filters]);

    const loadBikes = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.location) params.location = filters.location;
            if (filters.bikeType) params.bikeType = filters.bikeType;
            if (filters.minPrice) params.minPrice = parseFloat(filters.minPrice);
            if (filters.maxPrice) params.maxPrice = parseFloat(filters.maxPrice);

            const response = await bikesAPI.getAll(params);
            setBikes(response.data);
        } catch (error) {
            console.error('Error loading bikes:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            <nav className="glass sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
                        <Bike className="w-8 h-8 text-blue-600" />
                        <span className="text-2xl font-bold text-gradient">Rydo</span>          </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <h1 className="text-4xl font-bold mb-8">Find Your Perfect Bike</h1>

                {/* Filters */}
                <div className="glass rounded-xl p-6 mb-8">
                    <div className="grid md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">📍 Your Location</label>
                            <LocationPicker
                                value={filters.location ? { name: filters.location } : null}
                                onChange={(loc) => setFilters({ ...filters, location: loc.name })}
                                placeholder="Select pickup location"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">🏍️ Bike Type</label>
                            <select
                                className="input"
                                value={filters.bikeType}
                                onChange={(e) => setFilters({ ...filters, bikeType: e.target.value })}
                            >
                                <option value="">All Types</option>
                                <option value="SPORTS">Sports</option>
                                <option value="CRUISER">Cruiser</option>
                                <option value="COMMUTER">Commuter</option>
                                <option value="SCOOTER">Scooter</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">💰 Min Price (₹/hr)</label>
                            <input
                                type="number"
                                className="input"
                                placeholder="200"
                                value={filters.minPrice}
                                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">💰 Max Price (₹/hr)</label>
                            <input
                                type="number"
                                className="input"
                                placeholder="400"
                                value={filters.maxPrice}
                                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Inter-city booking info */}
                    <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg flex items-center gap-3">
                        <Navigation className="w-5 h-5 text-blue-600" />
                        <p className="text-sm text-gray-700">
                            <strong>🚀 Inter-city bookings available!</strong> Book from Tamil Nadu, travel to Kerala - return anywhere!
                        </p>
                    </div>
                </div>

                {/* Results */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                        <p className="mt-4 text-gray-600">Loading bikes...</p>
                    </div>
                ) : bikes.length === 0 ? (
                    <div className="text-center py-20">
                        <Bike className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-xl text-gray-600">No bikes found. Try adjusting your filters.</p>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-600 mb-6">{bikes.length} bikes available</p>
                        <div className="grid md:grid-cols-3 gap-6">
                            {bikes.map((bike) => (
                                <div
                                    key={bike.id}
                                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 group"
                                >
                                    {/* Bike Image & Badge */}
                                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                                        {/* Badge */}
                                        <div className="absolute top-3 left-3 z-10 bg-black text-white text-xs font-bold px-2 py-1 rounded">
                                            {bike.id % 3 === 0 ? '1 Left' : bike.id % 2 === 0 ? '4 Left' : 'Available'}
                                        </div>

                                        {bike.dynamicPricing && (
                                            <div className="absolute top-3 right-3 z-10 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                                <span>⚡</span> HUGE DISCOUNTS
                                            </div>
                                        )}

                                        {bike.imageUrl1 ? (
                                            <img
                                                src={bike.imageUrl1}
                                                alt={`${bike.brand} ${bike.model}`}
                                                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Bike className="w-16 h-16 text-gray-300" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
                                            {bike.brand}
                                        </div>
                                        <h3 className="font-bold text-lg text-gray-900 mb-3 truncate">
                                            {bike.model.toUpperCase()} {bike.year} MODEL
                                        </h3>

                                        {/* Features */}
                                        <div className="flex items-center gap-4 text-xs text-gray-600 mb-4">
                                            <div className="flex items-center gap-1">
                                                <span className="font-medium">⛽ {bike.fuelType}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="font-medium">⚙️ {bike.bikeType === 'SCOOTER' ? 'Automatic' : 'Manual'}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="font-medium">👥 2 Seater</span>
                                            </div>
                                        </div>

                                        {/* Price & Action */}
                                        <div className="flex items-end justify-between mt-2">
                                            <div>
                                                <div className="text-2xl font-black text-gray-900">
                                                    ₹ {Math.round(bike.hourlyPrice)}
                                                </div>
                                                <div className="text-[10px] text-red-500 font-medium mt-1">
                                                    {bike.mileage} Km | Prices Exclude fuel cost
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => navigate(`/bikes/${bike.id}`)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-1"
                                            >
                                                Book <span className="text-lg">›</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
