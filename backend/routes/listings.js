const express = require('express');
const Listing = require('../models/Listing');
const Booking = require('../models/Booking');
const { protect, requireHost } = require('../middleware/auth');

const router = express.Router();

// @route  GET /api/listings
// Supports: ?city=&minPrice=&maxPrice=&guests=&category=&checkIn=&checkOut=&page=&limit=
router.get('/', async (req, res) => {
  try {
    const {
      city, minPrice, maxPrice, guests, category,
      checkIn, checkOut, page = 1, limit = 12,
    } = req.query;

    const filter = {};
    if (city) filter['address.city'] = new RegExp(city, 'i');
    if (category) filter.category = category;
    if (guests) filter.maxGuests = { $gte: Number(guests) };
    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
    }

    let listingIdsToExclude = [];
    if (checkIn && checkOut) {
      const overlapping = await Booking.find({
        status: { $ne: 'cancelled' },
        checkIn: { $lt: new Date(checkOut) },
        checkOut: { $gt: new Date(checkIn) },
      }).select('listing');
      listingIdsToExclude = overlapping.map((b) => b.listing);
    }
    if (listingIdsToExclude.length) {
      filter._id = { $nin: listingIdsToExclude };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [listings, total] = await Promise.all([
      Listing.find(filter).sort('-createdAt').skip(skip).limit(Number(limit)).populate('host', 'name avatar'),
      Listing.countDocuments(filter),
    ]);

    res.json({ listings, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route  GET /api/listings/:id
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('host', 'name avatar email');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route  POST /api/listings  (host only)
router.post('/', protect, requireHost, async (req, res) => {
  try {
    const listing = await Listing.create({ ...req.body, host: req.user._id });
    res.status(201).json(listing);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route  PUT /api/listings/:id  (owner only)
router.put('/:id', protect, requireHost, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your listing' });
    }
    Object.assign(listing, req.body);
    await listing.save();
    res.json(listing);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route  DELETE /api/listings/:id  (owner only)
router.delete('/:id', protect, requireHost, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your listing' });
    }
    await listing.deleteOne();
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route  GET /api/listings/host/mine  (host's own listings)
router.get('/host/mine', protect, requireHost, async (req, res) => {
  const listings = await Listing.find({ host: req.user._id }).sort('-createdAt');
  res.json(listings);
});

module.exports = router;
