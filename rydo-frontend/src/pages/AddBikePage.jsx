import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bikesAPI } from '../services/api';
import { Upload, Image, FileText, Calendar, Clock, MapPin, IndianRupee } from 'lucide-react';
import LocationPicker from '../components/LocationPicker';

export default function AddBikePage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        numberPlate: '',
        bikeType: 'COMMUTER',
        description: '',
        location: '',
        hourlyPrice: '',
        fuelType: 'PETROL',
        mileage: '',
        autoApproveBookings: true,
        dynamicPricing: true
    });

    const [images, setImages] = useState({
        image1: null,
        image2: null,
        image3: null
    });

    const [documents, setDocuments] = useState({
        rc: null,
        insurance: null,
        license: null
    });

    const [availabilitySlots, setAvailabilitySlots] = useState([
        { day: 'Monday', startTime: '09:00', endTime: '18:00', enabled: true },
        { day: 'Tuesday', startTime: '09:00', endTime: '18:00', enabled: true },
        { day: 'Wednesday', startTime: '09:00', endTime: '18:00', enabled: true },
        { day: 'Thursday', startTime: '09:00', endTime: '18:00', enabled: true },
        { day: 'Friday', startTime: '09:00', endTime: '18:00', enabled: true },
        { day: 'Saturday', startTime: '10:00', endTime: '17:00', enabled: true },
        { day: 'Sunday', startTime: '10:00', endTime: '17:00', enabled: false }
    ]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e, imageKey) => {
        const file = e.target.files[0];
        if (file) {
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prev => ({ ...prev, [imageKey]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDocumentChange = (e, docKey) => {
        const file = e.target.files[0];
        if (file) {
            setDocuments(prev => ({ ...prev, [docKey]: file }));
        }
    };

    const handleSlotChange = (index, field, value) => {
        const newSlots = [...availabilitySlots];
        newSlots[index] = { ...newSlots[index], [field]: value };
        setAvailabilitySlots(newSlots);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Validate user is logged in
            if (!user || !user.id) {
                setError('Please login to list a bike');
                setLoading(false);
                return;
            }

            // Validate price is between ₹200-400
            const price = parseFloat(formData.hourlyPrice);
            if (price < 200 || price > 400) {
                setError('Price must be between ₹200 and ₹400 per hour');
                setLoading(false);
                return;
            }

            // Create bike
            const bikeData = {
                ...formData,
                ownerId: user.id,
                latitude: 19.0760, // Default Mumbai coordinates
                longitude: 72.8777,
                imageUrl1: images.image1 || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400',
                imageUrl2: images.image2 || 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400',
                imageUrl3: images.image3 || 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=400'
            };

            console.log('Submitting bike data:', JSON.stringify(bikeData, null, 2));

            const response = await bikesAPI.create(bikeData);
            console.log('Bike created successfully:', response.data);
            alert('✅ Bike listed successfully! Awaiting admin approval.');
            navigate('/dashboard');
        } catch (err) {
            console.error('Bike creation error:', err);
            console.error('Error response:', err.response);
            const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Failed to list bike';
            setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="glass-card p-8">
                    <h1 className="text-3xl font-bold mb-2 gradient-text">List Your Bike</h1>
                    <p className="text-gray-600 mb-8">Fill in the details to start earning</p>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Details */}
                        <section>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Basic Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="brand"
                                    placeholder="Brand (e.g., Honda, Yamaha)"
                                    value={formData.brand}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    required
                                />
                                <input
                                    type="text"
                                    name="model"
                                    placeholder="Model (e.g., Activa, FZ)"
                                    value={formData.model}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    required
                                />
                                <input
                                    type="number"
                                    name="year"
                                    placeholder="Year"
                                    value={formData.year}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    required
                                />
                                <input
                                    type="text"
                                    name="numberPlate"
                                    placeholder="Number Plate"
                                    value={formData.numberPlate}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    required
                                />
                                <select
                                    name="bikeType"
                                    value={formData.bikeType}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    required
                                >
                                    <option value="COMMUTER">Commuter</option>
                                    <option value="SPORTS">Sports</option>
                                    <option value="CRUISER">Cruiser</option>
                                    <option value="SCOOTER">Scooter</option>
                                </select>
                                <select
                                    name="fuelType"
                                    value={formData.fuelType}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    required
                                >
                                    <option value="PETROL">Petrol</option>
                                    <option value="ELECTRIC">Electric</option>
                                    <option value="DIESEL">Diesel</option>
                                </select>
                                <input
                                    type="number"
                                    name="mileage"
                                    placeholder="Mileage (km/l or km/charge)"
                                    value={formData.mileage}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    required
                                />
                                <div className="relative">
                                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="number"
                                        name="hourlyPrice"
                                        placeholder="Hourly Price (₹200-400)"
                                        value={formData.hourlyPrice}
                                        onChange={handleInputChange}
                                        className="input-field pl-10"
                                        min="200"
                                        max="400"
                                        required
                                    />
                                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">₹200-400/hr</span>
                                </div>
                            </div>
                            <p className="text-xs text-orange-600 mt-1">💰 Price must be between ₹200 and ₹400 per hour</p>
                            <textarea
                                name="description"
                                placeholder="Description (e.g., Well-maintained, perfect for city rides...)"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="input-field mt-4"
                                rows="3"
                                required
                            />
                            <div className="mt-4">
                                <label className="block text-sm font-semibold mb-2">📍 Bike Location</label>
                                <LocationPicker
                                    value={formData.location ? { name: formData.location } : null}
                                    onChange={(loc) => setFormData({ ...formData, location: loc.name, latitude: loc.lat, longitude: loc.lng })}
                                    placeholder="Select where your bike is located"
                                />
                            </div>
                        </section>

                        {/* Bike Images */}
                        <section>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Image className="w-5 h-5" />
                                Bike Images (Upload 3 clear photos)
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {['image1', 'image2', 'image3'].map((key, index) => (
                                    <div key={key} className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                                        <input
                                            type="file"
                                            id={key}
                                            accept="image/*"
                                            onChange={(e) => handleImageChange(e, key)}
                                            className="hidden"
                                        />
                                        <label htmlFor={key} className="cursor-pointer">
                                            {images[key] ? (
                                                <img src={images[key]} alt={`Bike ${index + 1}`} className="w-full h-32 object-cover rounded mb-2" />
                                            ) : (
                                                <div className="h-32 flex items-center justify-center">
                                                    <Upload className="w-10 h-10 text-gray-400" />
                                                </div>
                                            )}
                                            <p className="text-sm text-gray-600">{images[key] ? 'Change' : 'Upload'} Image {index + 1}</p>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Documents */}
                        <section>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Verification Documents
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { key: 'rc', label: 'RC (Registration Certificate)' },
                                    { key: 'insurance', label: 'Insurance' },
                                    { key: 'license', label: 'Your Driving License' }
                                ].map(doc => (
                                    <div key={doc.key} className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-500 transition-colors">
                                        <input
                                            type="file"
                                            id={doc.key}
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(e) => handleDocumentChange(e, doc.key)}
                                            className="hidden"
                                        />
                                        <label htmlFor={doc.key} className="cursor-pointer">
                                            <FileText className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-600 text-center">{doc.label}</p>
                                            {documents[doc.key] && (
                                                <p className="text-xs text-green-600 mt-2 text-center">✓ Uploaded</p>
                                            )}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Availability Slots */}
                        <section>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Availability Schedule
                            </h2>
                            <div className="space-y-3">
                                {availabilitySlots.map((slot, index) => (
                                    <div key={slot.day} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                        <input
                                            type="checkbox"
                                            checked={slot.enabled}
                                            onChange={(e) => handleSlotChange(index, 'enabled', e.target.checked)}
                                            className="w-5 h-5"
                                        />
                                        <span className="w-28 font-medium">{slot.day}</span>
                                        <input
                                            type="time"
                                            value={slot.startTime}
                                            onChange={(e) => handleSlotChange(index, 'startTime', e.target.value)}
                                            disabled={!slot.enabled}
                                            className="input-field flex-1"
                                        />
                                        <span className="text-gray-500">to</span>
                                        <input
                                            type="time"
                                            value={slot.endTime}
                                            onChange={(e) => handleSlotChange(index, 'endTime', e.target.value)}
                                            disabled={!slot.enabled}
                                            className="input-field flex-1"
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Settings */}
                        <section>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={formData.autoApproveBookings}
                                        onChange={(e) => setFormData({ ...formData, autoApproveBookings: e.target.checked })}
                                        className="w-5 h-5"
                                    />
                                    <span>Auto-approve bookings (recommended)</span>
                                </label>
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={formData.dynamicPricing}
                                        onChange={(e) => setFormData({ ...formData, dynamicPricing: e.target.checked })}
                                        className="w-5 h-5"
                                    />
                                    <span>Enable dynamic pricing (earn more during peak hours)</span>
                                </label>
                            </div>
                        </section>

                        {/* Submit */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary flex-1"
                            >
                                {loading ? 'Listing...' : '🚲 List My Bike'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="btn-secondary flex-1"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
