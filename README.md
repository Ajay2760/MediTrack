This is a comprehensive emergency ambulance tracking system built with Next.js, Socket.IO, MongoDB, and Leaflet maps.

## Features

- 🚑 Real-time ambulance tracking with GPS
- 📍 Live location updates for users and drivers
- 🚨 Emergency request system with automatic ambulance matching
- 👨‍⚕️ Multi-role authentication (Patient, Driver, Admin)
- 🏥 Hospital integration with condition-based search
- 📊 Admin analytics dashboard
- 🗺️ Interactive maps with Leaflet
- ⚡ WebSocket real-time communication
- 🌊 **NEW**: Disaster alert subscription system
- 🩸 **NEW**: Blood donor search and registration
- 📚 **NEW**: Emergency resources (First Aid, CPR, Helplines)
- ♿ **NEW**: Accessibility features (Text-to-Speech, Offline SMS)
- 🌐 **NEW**: Full Tamil/English bilingual support

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Vanilla CSS with medical theme
- **Maps**: Leaflet + OpenStreetMap
- **Backend**: Next.js API Routes + Express WebSocket Server
- **Real-time**: Socket.IO
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB running locally or connection URI

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Copy `.env.local` and update the MongoDB URI if needed.

3. Start MongoDB (if running locally):
```bash
mongod
```

4. Start the WebSocket server:
```bash
npm run server
```

5. Start the Next.js development server (in a new terminal):
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### For Patients/Users

1. Sign up with email or phone
2. Click "Request Emergency Ambulance"
3. Track ambulance in real-time on the map
4. View ETA and driver contact information

### For Drivers

1. Sign up as a driver
2. Accept/decline incoming emergency requests
3. Update trip status (On the way, Arrived, Patient Picked, Completed)
4. Navigate to patient location with live map

### For Admins

1. Sign up as an admin
2. Monitor all ambulances and trips on live map
3. View analytics and statistics
4. Manage ambulances and drivers
5. Access emergency request logs

## Project Structure

```
meditrack/
├── app/
│   ├── api/              # REST API endpoints
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Role-based dashboards
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/
│   └── Map/              # Map components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities (auth, geolocation, db)
├── models/               # MongoDB models
├── server.js             # WebSocket server
└── package.json
```

## Environment Variables

Required:
```
MONGODB_URI=mongodb://localhost:27017/meditrack
JWT_SECRET=your-super-secret-jwt-key
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

Optional (for SMS fallback feature):
```
# Twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# OR MSG91 (Indian SMS gateway)
MSG91_AUTH_KEY=your_auth_key
MSG91_SENDER_ID=your_sender_id
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify` - Verify JWT token

### Ambulances
- `GET /api/ambulances` - Get nearby ambulances
- `POST /api/ambulances` - Create ambulance (admin)
- `PATCH /api/ambulances/[id]` - Update ambulance
- `DELETE /api/ambulances/[id]` - Delete ambulance (admin)

### Emergency Requests
- `POST /api/emergency` - Create emergency request
- `GET /api/emergency` - Get requests
- `PATCH /api/emergency/[id]` - Update request status

### Hospitals
- `GET /api/hospitals` - Get nearby hospitals

## WebSocket Events

### Client → Server
- `authenticate` - Authenticate user/driver
- `ambulance:location` - Update ambulance location
- `emergency:created` - New emergency request
- `emergency:accept` - Driver accepts request
- `emergency:decline` - Driver declines request
- `emergency:status` - Update trip status

### Server → Client
- `ambulances:update` - Ambulance location update
- `emergency:new` - New emergency for driver
- `emergency:accepted` - Request accepted
- `emergency:status-update` - Status changed
- `ambulance:offline` - Ambulance disconnected

## Demo Accounts

For testing, you can create accounts with different roles:

- **Patient**: Select "Patient/User" during signup
- **Driver**: Select "Ambulance Driver" during signup
- **Admin**: Select "Admin" during signup

## Notes

- This is a demo application with mock OTP authentication
- For production, integrate real SMS/email services (Twilio, SendGrid)
- MongoDB must be running before starting the application
- WebSocket server runs on port 3001, Next.js on port 3000

## Features Documentation

See [FEATURES.md](./FEATURES.md) for detailed user guide on new features.

## Future Enhancements

- [ ] AI-based ambulance matching
- [ ] Traffic-aware routing with Google Maps
- [ ] Push notifications via FCM
- [x] ~~Voice emergency commands~~ ✅ Completed
- [x] ~~Multi-language support~~ ✅ Completed (English/Tamil)
- [ ] Payment integration
- [ ] Trip history and invoicing
- [x] ~~Disaster alerts~~ ✅ Completed
- [x] ~~Blood donor system~~ ✅ Completed
- [x] ~~First aid resources~~ ✅ Completed

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
