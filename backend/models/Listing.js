const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    address: {
      city: { type: String, required: true },
      country: { type: String, required: true },
      line1: { type: String },
    },
    location: {
      // GeoJSON point for map / nearby search
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
    },
    pricePerNight: { type: Number, required: true, min: 0 },
    maxGuests: { type: Number, required: true, min: 1 },
    bedrooms: { type: Number, default: 1 },
    beds: { type: Number, default: 1 },
    baths: { type: Number, default: 1 },
    amenities: [{ type: String }],
    category: {
      type: String,
      enum: ['house', 'apartment', 'cabin', 'villa', 'unique', 'beachfront'],
      default: 'house',
    },
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

listingSchema.index({ location: '2dsphere' });
listingSchema.index({ title: 'text', description: 'text', 'address.city': 'text' });

module.exports = mongoose.model('Listing', listingSchema);
