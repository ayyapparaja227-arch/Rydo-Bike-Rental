import { useState, useEffect } from 'react';
import { MapPin, Navigation, X } from 'lucide-react';

const SOUTH_INDIA_CITIES = [
    { name: 'Chennai, T Nagar', lat: 13.0418, lng: 80.2341, state: 'Tamil Nadu' },
    { name: 'Chennai, Anna Nagar', lat: 13.0850, lng: 80.2101, state: 'Tamil Nadu' },
    { name: 'Coimbatore, RS Puram', lat: 11.0168, lng: 76.9558, state: 'Tamil Nadu' },
    { name: 'Madurai, Anna Nagar', lat: 9.9252, lng: 78.1198, state: 'Tamil Nadu' },
    { name: 'Salem, Fairlands', lat: 11.6643, lng: 78.1460, state: 'Tamil Nadu' },
    { name: 'Trichy, Thillai Nagar', lat: 10.8150, lng: 78.6869, state: 'Tamil Nadu' },
    { name: 'Tirunelveli, Palayamkottai', lat: 8.7139, lng: 77.7567, state: 'Tamil Nadu' },
    { name: 'Kochi, MG Road', lat: 9.9312, lng: 76.2673, state: 'Kerala' },
    { name: 'Kochi, Edappally', lat: 10.0261, lng: 76.3125, state: 'Kerala' },
    { name: 'Trivandrum, Technopark', lat: 8.5574, lng: 76.8814, state: 'Kerala' },
    { name: 'Kozhikode, Beach Road', lat: 11.2588, lng: 75.7804, state: 'Kerala' },
    { name: 'Thrissur, Round', lat: 10.5276, lng: 76.2144, state: 'Kerala' },
    { name: 'Bangalore, Koramangala', lat: 12.9352, lng: 77.6245, state: 'Karnataka' },
    { name: 'Bangalore, Indiranagar', lat: 12.9716, lng: 77.6412, state: 'Karnataka' },
];

export default function LocationPicker({
    value,
    onChange,
    placeholder = "Select your location",
    showCurrentLocation = true
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [currentLocation, setCurrentLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(value || null);

    const filteredCities = SOUTH_INDIA_CITIES.filter(city =>
        city.name.toLowerCase().includes(search.toLowerCase()) ||
        city.state.toLowerCase().includes(search.toLowerCase())
    );

    const getCurrentLocation = () => {
        setLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    // Find nearest city from our list
                    let nearestCity = SOUTH_INDIA_CITIES[0];
                    let minDistance = Infinity;

                    SOUTH_INDIA_CITIES.forEach(city => {
                        const distance = Math.sqrt(
                            Math.pow(city.lat - latitude, 2) +
                            Math.pow(city.lng - longitude, 2)
                        );
                        if (distance < minDistance) {
                            minDistance = distance;
                            nearestCity = city;
                        }
                    });

                    setCurrentLocation({
                        name: `Near ${nearestCity.name}`,
                        lat: latitude,
                        lng: longitude,
                        state: nearestCity.state
                    });
                    setLoading(false);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setLoading(false);
                    alert('Could not get your location. Please select manually.');
                }
            );
        } else {
            setLoading(false);
            alert('Geolocation is not supported by your browser');
        }
    };

    const handleSelect = (location) => {
        setSelectedLocation(location);
        onChange({
            name: location.name,
            lat: location.lat,
            lng: location.lng
        });
        setIsOpen(false);
        setSearch('');
    };

    return (
        <div className="relative">
            {/* Selected Location Display */}
            <div
                onClick={() => setIsOpen(true)}
                className="input-field flex items-center gap-2 cursor-pointer"
            >
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className={selectedLocation ? 'text-gray-900' : 'text-gray-400'}>
                    {selectedLocation?.name || placeholder}
                </span>
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-96 overflow-hidden">
                    {/* Header */}
                    <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                        <span className="font-semibold text-gray-800">Select Location</span>
                        <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 rounded">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Current Location Button */}
                    {showCurrentLocation && (
                        <button
                            onClick={getCurrentLocation}
                            disabled={loading}
                            className="w-full p-3 flex items-center gap-3 hover:bg-blue-50 border-b border-gray-100 text-left"
                        >
                            <div className="p-2 bg-blue-100 rounded-full">
                                <Navigation className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-medium text-blue-600">
                                    {loading ? 'Getting location...' : 'Use Current Location'}
                                </p>
                                {currentLocation && (
                                    <p className="text-sm text-gray-500">{currentLocation.name}</p>
                                )}
                            </div>
                        </button>
                    )}

                    {/* Show current location option if available */}
                    {currentLocation && (
                        <button
                            onClick={() => handleSelect(currentLocation)}
                            className="w-full p-3 flex items-center gap-3 hover:bg-green-50 border-b border-gray-100 text-left bg-green-50/50"
                        >
                            <MapPin className="w-5 h-5 text-green-600" />
                            <div>
                                <p className="font-medium text-green-700">{currentLocation.name}</p>
                                <p className="text-xs text-gray-500">{currentLocation.state} (Your location)</p>
                            </div>
                        </button>
                    )}

                    {/* Search */}
                    <div className="p-3 border-b border-gray-100">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search cities in Tamil Nadu, Kerala..."
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                        />
                    </div>

                    {/* City List */}
                    <div className="max-h-60 overflow-y-auto">
                        {/* Group by state */}
                        {['Tamil Nadu', 'Kerala', 'Karnataka'].map(state => {
                            const stateCities = filteredCities.filter(c => c.state === state);
                            if (stateCities.length === 0) return null;

                            return (
                                <div key={state}>
                                    <div className="px-3 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                                        {state}
                                    </div>
                                    {stateCities.map((city, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSelect(city)}
                                            className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 text-left"
                                        >
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-700">{city.name}</span>
                                        </button>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
