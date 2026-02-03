# MediTrack – How to Run & Host

## 1. Run locally (development)

### Prerequisites

- **Node.js** 18 or later  
- **MongoDB** running locally, or a MongoDB Atlas (cloud) URI

### Steps

**1. Install dependencies**

```bash
npm install
```

**2. Environment variables**

Create a file `.env.local` in the project root (copy from `.env.example`):

```env
MONGODB_URI=mongodb://localhost:27017/meditrack
JWT_SECRET=your-secret-key
SOCKET_PORT=3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

If using **MongoDB Atlas**, set:

```env
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.xxxxx.mongodb.net/meditrack
```

**3. Seed the database (first time)**

```bash
npm run seed
```

This creates sample users, ambulances, and Tamil Nadu hospitals.  
Demo login: `patient@example.com` / `password123` (and similar for driver/admin).

**4. Start the WebSocket server**

In one terminal:

```bash
npm run server
```

Runs on **port 3001** (real-time ambulance updates).

**5. Start the Next.js app**

In a second terminal:

```bash
npm run dev
```

Runs on **http://localhost:3000**.

**6. Open the app**

- App: http://localhost:3000  
- SOS (guest): http://localhost:3000/sos  
- Login: http://localhost:3000/auth/login  

---

## 2. Run in production (build)

Same env as above, then:

**Terminal 1 – Socket server**

```bash
npm run server
```

**Terminal 2 – Next.js (production)**

```bash
npm run build
npm run start
```

App will be on port **3000** (or the port you set with `PORT=3000`).

---

## 3. Host on Netlify

You can host the **Next.js app** on Netlify. The **Socket server** cannot run on Netlify (no long-running servers); host it on Railway, Render, or similar.

### Deploy Next.js to Netlify

1. Push your code to **GitHub** (or GitLab/Bitbucket).

2. In [Netlify](https://netlify.com): **Add new site** → **Import an existing project** → connect your repo.

3. **Build settings**
   - **Build command:** `npm run build`
   - **Publish directory:** `.next` (Netlify usually detects Next.js and sets this)
   - For Next.js, Netlify often uses **Next.js runtime**; if asked, choose the default Next.js setup.

4. **Environment variables** (Site settings → Environment variables)
   - `MONGODB_URI` – your MongoDB Atlas connection string
   - `JWT_SECRET` – a strong secret for production
   - `NEXT_PUBLIC_SOCKET_URL` – **URL of your Socket server** (see below), e.g. `https://meditrack-socket.onrender.com`

5. **Deploy.** Your app will be at `https://your-site.netlify.app`.

### Socket server (required for real-time features)

Host the Socket server somewhere that runs Node.js:

- **Render:** New **Web Service** → connect same repo → **Start command:** `node server.js` → add env `MONGODB_URI`, `CORS_ORIGIN=https://your-site.netlify.app`
- **Railway:** New project → deploy repo → set start command `node server.js` → add `MONGODB_URI`, `CORS_ORIGIN=https://your-site.netlify.app`

Then set **`NEXT_PUBLIC_SOCKET_URL`** in Netlify to the Socket service URL (e.g. `https://your-app.onrender.com`) and redeploy.

Without the Socket server, the site still works (SOS, login, maps, API), but live ambulance tracking and instant status updates won’t work until the server is running.

---

## 4. Host / deploy (other options)

MediTrack has **two** parts that must both be hosted:

| Part              | What it is              | Typical host              |
|-------------------|-------------------------|---------------------------|
| Next.js app + API | Web app & REST API      | Vercel, Railway, Render   |
| Socket server     | Real-time (Socket.IO)   | Railway, Render, VPS, etc.|
| Database          | MongoDB                 | MongoDB Atlas (cloud)     |

### Option A: Vercel (Next.js) + Railway/Render (Socket + DB)

**1. Database – MongoDB Atlas**

- Create a free cluster at https://www.mongodb.com/cloud/atlas  
- Create a database user and get the connection string  
- Use that as `MONGODB_URI` everywhere (Next.js and Socket server)

**2. Next.js on Vercel**

- Push code to GitHub  
- Import the repo in [Vercel](https://vercel.com)  
- Add env vars in Vercel: `MONGODB_URI`, `JWT_SECRET`  
- Deploy (Vercel runs `next build` and serves the app)

**3. Socket server on Railway or Render**

- In the same repo, they need to run **only** the Socket server  
- **Railway**: New Project → Deploy from GitHub → set **Start Command** to `node server.js` and **Root Directory** to the repo root (or where `server.js` is). Add env: `MONGODB_URI`, `SOCKET_PORT` (e.g. 3001), and optionally `CORS` origin for your Vercel URL.  
- **Render**: New Web Service → connect repo → Build: `npm install` (or leave empty) → Start: `node server.js`. Add env vars. Render gives a URL like `https://your-app.onrender.com`.

**4. Point frontend to the Socket server**

In Vercel (and in `.env.local` for local), set:

```env
NEXT_PUBLIC_SOCKET_URL=https://your-socket-server.onrender.com
```

Redeploy the Next.js app so it uses this URL.

**5. CORS on Socket server**

In `server.js`, set `cors.origin` to your Vercel URL (e.g. `https://your-app.vercel.app`) so the browser allows Socket connections from the frontend.

---

### Option B: All-in-one on Railway or Render

You can run both Next.js and the Socket server on the same provider:

- **Railway**:  
  - One service: build `npm install && npm run build`, start `npm run start` (Next.js).  
  - Second service: start `node server.js` (Socket).  
  - Use the same `MONGODB_URI` for both.  
  - Set `NEXT_PUBLIC_SOCKET_URL` to the Socket service’s public URL.

- **Render**:  
  - One Web Service for Next.js (build + start as above).  
  - Another Web Service for `node server.js`.  
  - Same idea: same MongoDB URI, and `NEXT_PUBLIC_SOCKET_URL` = Socket service URL.

---

### Option C: VPS (DigitalOcean, AWS EC2, etc.)

1. Install Node.js and MongoDB (or use Atlas).  
2. Clone repo, `npm install`, set `.env` / `.env.local` with `MONGODB_URI`, `JWT_SECRET`, `NEXT_PUBLIC_SOCKET_URL` (e.g. `http://YOUR_SERVER_IP:3001`).  
3. Build: `npm run build`.  
4. Run with **PM2** (or similar):

   ```bash
   pm2 start server.js --name meditrack-socket
   pm2 start npm --name meditrack-web -- start
   ```

5. Put Nginx (or another reverse proxy) in front and use SSL (e.g. Let’s Encrypt).

---

## 5. Environment variables summary

| Variable                  | Required | Description |
|---------------------------|----------|-------------|
| `MONGODB_URI`             | Yes      | MongoDB connection string |
| `JWT_SECRET`              | Yes (prod) | Secret for JWT tokens |
| `SOCKET_PORT`             | No       | Port for Socket server (default 3001) |
| `NEXT_PUBLIC_SOCKET_URL`  | Yes (prod) | Full URL of Socket server (e.g. https://...) |

---

## 6. After first deploy

1. Run the seed **once** against your production DB (from your machine with `MONGODB_URI` pointing to production), or create admin/driver users via your own script.  
2. Test SOS, login, and driver dashboard to ensure Socket connection works (check browser console and Socket server logs).  
3. For production, use strong `JWT_SECRET` and HTTPS everywhere.
