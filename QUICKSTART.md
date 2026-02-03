# MediTrack - Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
```

If you encounter network issues, try:
```bash
npm install --force
```

### Step 2: Start MongoDB
Make sure MongoDB is running on your system:

**Windows:**
```bash
# Start MongoDB service
net start MongoDB

# Or run mongod directly
mongod
```

**Mac/Linux:**
```bash
mongod

# Or if using Homebrew
brew services start mongodb-community
```

**Alternative:** Use MongoDB Atlas (cloud) and update MONGODB_URI in `.env.local`

### Step 3: Run the Application

**Terminal 1 - WebSocket Server:**
```bash
npm run server
```

**Terminal 2 - Next.js App:**
```bash
npm run dev
```

**Terminal 3 (Optional) - Seed Database:**
```bash
npm run seed
```

## 📱 Access the Application

Open your browser and navigate to: **http://localhost:3000**

## 🧪 Quick Test

### Option 1: Use Seeded Accounts
If you ran `npm run seed`, use these credentials:

- **Patient**: `patient@example.com` / `password123`
- **Driver**: `driver1@example.com` / `password123`
- **Admin**: `admin@example.com` / `password123`

### Option 2: Create New Account
1. Click "Login / Sign Up" on homepage
2. Click "Sign Up"
3. Fill in your details
4. Select role (Patient, Driver, or Admin)
5. Submit form

## 🎯 Test the Emergency Flow

### 1. As a Patient:
1. Login with patient account
2. Allow location permissions
3. Click "🚨 Request Emergency Ambulance"
4. Watch the map for ambulance assignment

### 2. As a Driver:
1. Login with driver account (in a different browser or incognito)
2. Wait for emergency request notification
3. Click "✅ Accept"
4. Update status through the workflow

### 3. As Admin:
1. Login with admin account
2. View all ambulances on the map
3. Monitor active trips
4. Check analytics

## 🛠️ Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Start MongoDB service

### Port Already in Use
```
Error: Port 3000 is already in use
```
**Solution:** Kill the process or use a different port:
```bash
npx kill-port 3000
# Then retry
npm run dev
```

### WebSocket Connection Failed
```
Socket connection error
```
**Solution:** Ensure WebSocket server is running:
```bash
npm run server
```

### Location Not Working
**Solution:** 
- Enable location permissions in your browser
- Use HTTPS in production (required for geolocation)
- For local testing, use localhost (not 127.0.0.1)

## 📝 Environment Variables

Check `.env.local` file:

```env
MONGODB_URI=mongodb://localhost:27017/meditrack
JWT_SECRET=your-super-secret-jwt-key
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

## 🌐 Browser Requirements

- **Recommended:** Chrome, Firefox, Edge (latest versions)
- **Required:** Geolocation API support
- **Note:** Safari may have restrictions on geolocation

## 💡 Tips

1. **Multi-Tab Testing:** Open separate browser tabs for patient, driver, and admin to see real-time sync
2. **Mobile Testing:** Use Chrome DevTools device emulation
3. **Clear LocalStorage:** If login issues occur, clear browser localStorage
4. **Check Console:** Open browser DevTools to see WebSocket connection logs

## 📚 Next Steps

- Read [README.md](./README.md) for full documentation
- Check [walkthrough.md](./walkthrough.md) for detailed features
- Explore the API endpoints in `/app/api`
- Customize the design in `/app/globals.css`

## 🎉 You're All Set!

MediTrack is now running. Start testing the emergency flow and explore all the features!

For issues or questions, check the console logs or refer to the full documentation.
