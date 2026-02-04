# MediTrack – Step-by-Step Hosting Guide

This guide gets your app live using **MongoDB Atlas** (database), **Netlify** (website), and **Render** (real-time server). All have free tiers.

---

## Part 1: Database (MongoDB Atlas)

### Step 1 – Create a MongoDB account
1. Go to **https://www.mongodb.com/cloud/atlas**
2. Click **Try Free** and sign up (Google/email).

### Step 2 – Create a free cluster
1. Choose **M0 FREE** (Shared).
2. Pick a cloud provider and region (e.g. AWS, closest to you).
3. Click **Create** and wait 1–2 minutes.

### Step 3 – Create a database user
1. In the left menu, go to **Database Access** → **Add New Database User**.
2. Choose **Password** authentication.
3. Set a **username** and **password** (save the password somewhere safe).
4. Under **Database User Privileges**, leave **Read and write to any database**.
5. Click **Add User**.

### Step 4 – Allow network access
1. In the left menu, go to **Network Access** → **Add IP Address**.
2. Click **Allow Access from Anywhere** (adds `0.0.0.0/0`).  
   *(Needed so Netlify and Render can connect.)*
3. Click **Confirm**.

### Step 5 – Get your connection string
1. Go back to **Database** in the left menu.
2. Click **Connect** on your cluster.
3. Choose **Connect your application**.
4. Copy the connection string. It looks like:
   ```text
   mongodb+srv://USERNAME:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with the **actual password** you set in Step 3.  
   If the password has special characters (e.g. `@`, `#`), replace them with URL-encoded values (e.g. `@` → `%40`).
6. Add a database name before the `?`: change `...mongodb.net/` to `...mongodb.net/meditrack?`  
   Final form: `mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/meditrack?retryWrites=true&w=majority`
7. **Save this full URI** – you’ll use it as `MONGODB_URI` in Netlify and Render.

---

## Part 2: Socket server (Render)

The real-time ambulance updates need a small Node server. Render runs it for free.

### Step 6 – Create a Render account
1. Go to **https://render.com**
2. Sign up (e.g. with GitHub).

### Step 7 – Create a new Web Service
1. Dashboard → **New +** → **Web Service**.
2. Connect your **GitHub** account if you haven’t.
3. Select the **MediTrack** repository (Ajay2760/MediTrack).
4. Click **Connect**.

### Step 8 – Configure the Web Service
Use these settings:

| Field | Value |
|-------|--------|
| **Name** | `meditrack-socket` (or any name) |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Instance Type** | **Free** |

### Step 9 – Add environment variables (Render)
1. Scroll to **Environment**.
2. Click **Add Environment Variable** and add:

| Key | Value |
|-----|--------|
| `MONGODB_URI` | *(paste your full MongoDB URI from Step 5)* |
| `CORS_ORIGIN` | `https://YOUR-NETLIFY-URL.netlify.app` |

*(You don’t have your Netlify URL yet – that’s OK. After Part 3 you’ll get something like `https://meditrack-xyz.netlify.app`. Then come back to Render → your service → **Environment** → edit `CORS_ORIGIN` to that URL and save.)*

3. Click **Create Web Service**. Render will build and start the app (may take a few minutes).

### Step 10 – Copy your Socket server URL
1. When the deploy finishes, the top of the page shows a URL like:
   ```text
   https://meditrack-socket.onrender.com
   ```
2. **Copy this URL** – you’ll use it as `NEXT_PUBLIC_SOCKET_URL` in Netlify.

---

## Part 3: Website (Netlify)

### Step 11 – Create a Netlify account
1. Go to **https://www.netlify.com**
2. Sign up (e.g. **Sign up with GitHub**).

### Step 12 – Add a new site from GitHub
1. Click **Add new site** → **Import an existing project**.
2. Choose **GitHub** and authorize Netlify if asked.
3. Find **MediTrack** (Ajay2760/MediTrack) and click **Import**.

### Step 13 – Configure build settings
Netlify often detects Next.js. If it shows:

- **Build command:** `npm run build` (or `next build`) – leave it.
- **Publish directory:** `.next` or leave as suggested.
- **Base directory:** leave blank.

If not, set:

- **Build command:** `npm run build`
- **Publish directory:** `.next`

(For newer Netlify + Next.js, they may use a different publish directory – follow their on-screen instructions if they appear.)

Click **Deploy site** (or **Deploy**). The first deploy may fail until you add env vars in the next step – that’s OK.

### Step 14 – Add environment variables (Netlify)
1. Go to **Site configuration** (or **Site settings**) → **Environment variables** → **Add a variable** / **Add environment variables**.
2. Add these one by one:

| Key | Value |
|-----|--------|
| `MONGODB_URI` | *(same full MongoDB URI from Step 5)* |
| `JWT_SECRET` | *(any long random string, e.g. 32+ characters)* |
| `NEXT_PUBLIC_SOCKET_URL` | *(the Render URL from Step 10, e.g. `https://meditrack-socket.onrender.com`)* |

3. Save. Then trigger a new deploy: **Deploys** → **Trigger deploy** → **Deploy site**.

### Step 15 – Get your live site URL
1. After the deploy succeeds, Netlify shows the site URL, e.g.:
   ```text
   https://random-name-12345.netlify.app
   ```
2. **(Optional)** Under **Site configuration** → **Domain management** you can change the name to something like `meditrack.netlify.app`.

### Step 16 – Update CORS on Render (important)
1. Go back to **Render** → your **meditrack-socket** service → **Environment**.
2. Set **CORS_ORIGIN** to your **exact** Netlify URL (e.g. `https://meditrack.netlify.app`), with no trailing slash.
3. Save. Render will redeploy automatically.  
   Without this, the browser may block real-time connections from your Netlify site.

---

## Part 4: Seed the database (one time)

Your app needs initial data (users, ambulances, hospitals).

### Step 17 – Run the seed script
1. On your computer, open the MediTrack project folder.
2. Create a `.env.local` file (or use a temporary env) with **only**:
   ```env
   MONGODB_URI=your_full_mongodb_atlas_uri_here
   ```
   *(Same URI you used in Netlify and Render.)*
3. In the terminal, run:
   ```bash
   npm run seed
   ```
4. When it finishes, you can delete or keep `.env.local` for local testing.

After this, your **production** database has demo users and Tamil Nadu hospitals.

---

## Part 5: Test your live site

### Step 18 – Open the app
1. Open your Netlify URL (e.g. `https://meditrack.netlify.app`).
2. Try:
   - **SOS** – `/sos` – request ambulance (guest).
   - **Login** – use `patient@example.com` / `password123` (from seed).
3. Check the browser console (F12) for any errors. If you see Socket/WebSocket errors, double-check:
   - `NEXT_PUBLIC_SOCKET_URL` in Netlify = your Render URL.
   - `CORS_ORIGIN` in Render = your Netlify URL (no trailing slash).

---

## Quick checklist

- [ ] MongoDB Atlas: cluster created, user created, IP allowlist set, connection string saved.
- [ ] Render: Web Service for `node server.js`, `MONGODB_URI` and `CORS_ORIGIN` set, URL copied.
- [ ] Netlify: site connected to GitHub, build command `npm run build`, `MONGODB_URI`, `JWT_SECRET`, `NEXT_PUBLIC_SOCKET_URL` set.
- [ ] CORS: Render’s `CORS_ORIGIN` = your Netlify URL.
- [ ] Seed: `npm run seed` run once with production `MONGODB_URI`.

---

## If something goes wrong

- **Build fails on Netlify:** Check the build log. Ensure **Build command** is `npm run build` and **Node version** is 18+ (set in Netlify or in the project with an `.nvmrc` or `engines` in `package.json`).
- **“No ambulances available”:** Run the seed (Step 17) with your production `MONGODB_URI`.
- **Real-time updates not working:** Confirm `NEXT_PUBLIC_SOCKET_URL` (Netlify) and `CORS_ORIGIN` (Render) match the other service’s URL exactly (https, no trailing slash).
- **Render free tier sleeps:** After 15 minutes of no traffic, the free service may sleep. The first request after that can take 30–60 seconds to wake it up.

You’re done. Your MediTrack app is hosted and running.
