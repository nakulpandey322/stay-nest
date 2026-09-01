# StayNest — MERN Booking Platform

An Airbnb-inspired full-stack app: MongoDB + Express + React (Vite) + Node.

## Structure
```
stay-nest/
  backend/     Express API (auth, listings, bookings, reviews)
  frontend/    React + Tailwind client
```

## 1. Backend setup
```bash
cd backend
npm install
cp .env.example .env      # then edit MONGO_URI / JWT_SECRET
npm run dev                # starts on http://localhost:5000
node seed.js                # optional: adds demo listings + host@staynest.com / password123
```

## 2. Frontend setup
```bash
cd frontend
npm install
npm run dev                 # starts on http://localhost:5173
```
Vite proxies `/api/*` to `http://localhost:5000`, so no CORS setup needed in dev.

## 3. Core features included
- JWT auth (register/login), password hashing with bcrypt
- Listings: create/edit/delete (hosts only), search & filter by city/guests/price/dates
- Bookings: date-overlap prevention, price calculation, cancel
- Reviews with aggregate rating recalculation
- Protected routes on the frontend (guest vs host)

## 4. Next steps to extend
- Real image uploads (multer + S3/Cloudinary) instead of image URLs
- Payments (Stripe)
- Map view (the Listing model already has a `location` GeoJSON field + 2dsphere index)
- Pagination UI, host earnings dashboard, messaging between guest/host
