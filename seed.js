const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/meditrack';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });

// Define schemas (simplified for seeding)
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    password: String,
    role: String,
    bloodGroup: String,
    allergies: [String],
    location: { lat: Number, lng: Number },
}, { timestamps: true });

const ambulanceSchema = new mongoose.Schema({
    registrationNumber: String,
    driver: mongoose.Schema.Types.ObjectId,
    location: { lat: Number, lng: Number },
    status: String,
    hospital: String,
    phoneNumber: String,
}, { timestamps: true });

const hospitalSchema = new mongoose.Schema({
    name: String,
    nameTamil: String,
    location: { lat: Number, lng: Number },
    address: String,
    district: String,
    phone: String,
    emergencyPhone: String,
    email: String,
    emergencyServices: Boolean,
    bedAvailability: Number,
    totalBeds: Number,
    specialties: [String],
    isGovernment: Boolean,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Ambulance = mongoose.model('Ambulance', ambulanceSchema);
const Hospital = mongoose.model('Hospital', hospitalSchema);

// Tamil Nadu hospitals (Chennai, Coimbatore, Madurai, etc.)
const tamilNaduHospitals = [
    { name: 'Government General Hospital', nameTamil: 'அரசு பொது மருத்துவமனை', location: { lat: 13.0790, lng: 80.2832 }, address: 'Park Town, Chennai 600003', district: 'Chennai', phone: '044-25305000', emergencyPhone: '044-25305700', emergencyServices: true, bedAvailability: 45, totalBeds: 2000, specialties: ['Emergency', 'Trauma', 'All Specialties'], isGovernment: true },
    { name: 'Apollo Hospitals', nameTamil: 'அப்பல்லோ மருத்துவமனை', location: { lat: 13.0067, lng: 80.2206 }, address: '21 Greams Lane, Chennai 600006', district: 'Chennai', phone: '044-28290234', emergencyPhone: '044-28296565', emergencyServices: true, bedAvailability: 28, totalBeds: 250, specialties: ['Emergency', 'Cardiology', 'Neurology'], isGovernment: false },
    { name: 'MIOT International', location: { lat: 13.0145, lng: 80.2073 }, address: '4/112, Mount Poonamallee Road, Chennai 600089', district: 'Chennai', phone: '044-22492288', emergencyServices: true, bedAvailability: 15, totalBeds: 100, specialties: ['Emergency', 'Orthopedics', 'Surgery'], isGovernment: false },
    { name: 'Fortis Malar Hospital', location: { lat: 13.0025, lng: 80.2578 }, address: '52, 1st Main Road, Adyar, Chennai 600020', district: 'Chennai', phone: '044-42892222', emergencyServices: true, bedAvailability: 12, totalBeds: 180, specialties: ['Emergency', 'Cardiology', 'ICU'], isGovernment: false },
    { name: 'Stanley Medical College Hospital', nameTamil: 'ஸ்டான்லி மருத்துவக் கல்லூரி மருத்துவமனை', location: { lat: 13.1042, lng: 80.2833 }, address: 'Old Washermanpet, Chennai 600021', district: 'Chennai', phone: '044-25281234', emergencyServices: true, bedAvailability: 60, totalBeds: 1200, specialties: ['Emergency', 'Trauma'], isGovernment: true },
    { name: 'Coimbatore Medical College Hospital', location: { lat: 11.0168, lng: 76.9558 }, address: 'Avinashi Road, Coimbatore 641014', district: 'Coimbatore', phone: '0422-2301393', emergencyServices: true, bedAvailability: 35, totalBeds: 1200, specialties: ['Emergency', 'All Specialties'], isGovernment: true },
    { name: 'PSG Hospitals', location: { lat: 11.0046, lng: 76.9619 }, address: 'Peelamedu, Coimbatore 641004', district: 'Coimbatore', phone: '0422-2570170', emergencyServices: true, bedAvailability: 20, totalBeds: 350, specialties: ['Emergency', 'Cardiology', 'Neurology'], isGovernment: false },
    { name: 'Madurai Government Rajaji Hospital', nameTamil: 'மதுரை அரசு இராஜாஜி மருத்துவமனை', location: { lat: 9.9252, lng: 78.1198 }, address: 'Panagal Road, Madurai 625020', district: 'Madurai', phone: '0452-2530123', emergencyServices: true, bedAvailability: 50, totalBeds: 1500, specialties: ['Emergency', 'Trauma'], isGovernment: true },
    { name: 'Apollo Speciality Hospital Madurai', location: { lat: 9.9189, lng: 78.1192 }, address: 'Tamil Nadu 625020', district: 'Madurai', phone: '0452-2585858', emergencyServices: true, bedAvailability: 18, totalBeds: 150, specialties: ['Emergency', 'Surgery'], isGovernment: false },
    { name: 'JIPMER', location: { lat: 11.9404, lng: 79.8083 }, address: 'Dhanvantari Nagar, Puducherry 605006', district: 'Puducherry', phone: '0413-2272340', emergencyServices: true, bedAvailability: 40, totalBeds: 2000, specialties: ['Emergency', 'All Specialties'], isGovernment: true },
];

async function seedDatabase() {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Ambulance.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Create sample users
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('password123', 10);

        // Tamil Nadu default center (Chennai)
        const chennai = { lat: 13.0827, lng: 80.2707 };
        const users = await User.create([
            {
                name: 'John Doe',
                email: 'patient@example.com',
                phone: '+919876543210',
                password: hashedPassword,
                role: 'user',
                bloodGroup: 'O+',
                allergies: ['Penicillin'],
                location: chennai,
            },
            {
                name: 'Driver One',
                email: 'driver1@example.com',
                phone: '+919876543211',
                password: hashedPassword,
                role: 'driver',
                location: { lat: 13.0850, lng: 80.2750 },
            },
            {
                name: 'Driver Two',
                email: 'driver2@example.com',
                phone: '+919876543212',
                password: hashedPassword,
                role: 'driver',
                location: { lat: 13.0780, lng: 80.2680 },
            },
            {
                name: 'Driver Three',
                email: 'driver3@example.com',
                phone: '+919876543213',
                password: hashedPassword,
                role: 'driver',
                location: { lat: 13.0900, lng: 80.2780 },
            },
            {
                name: 'Admin User',
                email: 'admin@example.com',
                phone: '+919876543214',
                password: hashedPassword,
                role: 'admin',
                location: chennai,
            },
        ]);

        console.log('✅ Created sample users');
        console.log('   - Patient: patient@example.com / password123');
        console.log('   - Driver 1: driver1@example.com / password123');
        console.log('   - Driver 2: driver2@example.com / password123');
        console.log('   - Driver 3: driver3@example.com / password123');
        console.log('   - Admin: admin@example.com / password123');

        // Create sample ambulances
        const drivers = users.filter(u => u.role === 'driver');

        const ambulances = await Ambulance.create([
            {
                registrationNumber: 'TN-01-AB-1234',
                driver: drivers[0]._id,
                location: { lat: 13.0850, lng: 80.2750 },
                status: 'available',
                hospital: 'Government General Hospital',
                phoneNumber: '+919876543211',
            },
            {
                registrationNumber: 'TN-01-AB-5678',
                driver: drivers[1]._id,
                location: { lat: 13.0780, lng: 80.2680 },
                status: 'available',
                hospital: 'Apollo Hospitals',
                phoneNumber: '+919876543212',
            },
            {
                registrationNumber: 'TN-01-AB-9012',
                driver: drivers[2]._id,
                location: { lat: 13.0900, lng: 80.2780 },
                status: 'available',
                hospital: 'Fortis Malar Hospital',
                phoneNumber: '+919876543213',
            },
        ]);

        console.log('✅ Created sample ambulances');
        console.log('   - TN-01-AB-1234 (Available)');
        console.log('   - TN-01-AB-5678 (Available)');
        console.log('   - TN-01-AB-9012 (Available)');

        // Seed Tamil Nadu hospitals (upsert by name to avoid duplicates)
        for (const h of tamilNaduHospitals) {
            await Hospital.findOneAndUpdate(
                { name: h.name, district: h.district },
                { $set: h },
                { upsert: true, new: true }
            );
        }
        console.log('✅ Seeded Tamil Nadu hospitals (' + tamilNaduHospitals.length + ' hospitals)');

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📝 You can now login with any of the above credentials');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        mongoose.connection.close();
        console.log('\n👋 Database connection closed');
    }
}

seedDatabase();
