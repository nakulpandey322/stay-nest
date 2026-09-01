// Run with: node seed.js  (populates a few demo listings + a host user)
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Listing = require('./models/Listing');

const run = async () => {
  await connectDB();

  await Listing.deleteMany({});
  let host = await User.findOne({ email: 'host@staynest.com' });
  if (!host) {
    host = await User.create({
      name: 'Demo Host',
      email: 'host@staynest.com',
      password: 'password123',
      isHost: true,
    });
  }

  const listings = [
    {
      host: host._id,
      title: 'Sunlit Loft in the Arts District',
      description: 'A bright open-plan loft with exposed brick, five minutes from galleries and cafes.',
      images: ['https://picsum.photos/seed/loft1/800/600'],
      address: { city: 'Kolkata', country: 'India', line1: 'Park Street' },
      pricePerNight: 3200,
      maxGuests: 3,
      bedrooms: 1,
      beds: 1,
      baths: 1,
      amenities: ['WiFi', 'Kitchen', 'Air conditioning', 'Washer'],
      category: 'apartment',
    },
    {
      host: host._id,
      title: 'Riverside Cottage with Garden',
      description: 'A quiet cottage on the river, perfect for a weekend escape with morning coffee outside.',
      images: ['https://picsum.photos/seed/cottage1/800/600'],
      address: { city: 'Rishikesh', country: 'India', line1: 'Laxman Jhula Road' },
      pricePerNight: 2400,
      maxGuests: 4,
      bedrooms: 2,
      beds: 2,
      baths: 1,
      amenities: ['WiFi', 'Free parking', 'Garden', 'Bonfire pit'],
      category: 'cabin',
    },
    {
      host: host._id,
      title: 'Modern Beachfront Villa',
      description: 'Wake up to ocean views in this airy villa steps from the sand.',
      images: ['https://picsum.photos/seed/villa1/800/600'],
      address: { city: 'Goa', country: 'India', line1: 'Candolim Beach Road' },
      pricePerNight: 8500,
      maxGuests: 8,
      bedrooms: 4,
      beds: 5,
      baths: 3,
      amenities: ['WiFi', 'Pool', 'Beach access', 'Kitchen', 'Air conditioning'],
      category: 'beachfront',
    },
  ];

  await Listing.insertMany(listings);
  console.log('Seed complete. Host login: host@staynest.com / password123');
  mongoose.connection.close();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
