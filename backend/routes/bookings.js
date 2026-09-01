const express = require('express');
const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const { protect } = require('../middleware/auth');

const router = express.Router();

const nightsBetween = (checkIn, checkOut) => {
  const ms = new Date(checkOut) - new Date(checkIn);
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
};

// @route  POST /api/bookings  (create a booking)
router.post('/', protect, async (req, res) => {
  try {
    const { listingId, checkIn, checkOut, guests } = req.body;

    if (new Date(checkIn) >= new Date(checkOut)) {
      return res.status(400).json({ message: 'checkOut must be after checkIn' });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (guests > listing.maxGuests) {
      return res.status(400).json({ message: `Max ${listing.maxGuests} guests allowed` });
    }

    // Prevent double-booking: check for overlapping, non-cancelled bookings
    const overlap = await Booking.findOne({
      listing: listingId,
      status: { $ne: 'cancelled' },
      checkIn: { $lt: new Date(checkOut) },
      checkOut: { $gt: new Date(checkIn) },
    });
    if (overlap) return res.status(409).json({ message: 'These dates are already booked' });

    const nights = nightsBetween(checkIn, checkOut);
    const totalPrice = nights * listing.pricePerNight;

    const booking = await Booking.create({
      listing: listingId,
      guest: req.user._id,
      checkIn,
      checkOut,
      guests,
      totalPrice,
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route  GET /api/bookings/mine  (bookings made by the logged-in user)
router.get('/mine', protect, async (req, res) => {
  const bookings = await Booking.find({ guest: req.user._id })
    .populate('listing', 'title images address pricePerNight')
    .sort('-createdAt');
  res.json(bookings);
});

// @route  GET /api/bookings/host  (bookings for listings owned by the logged-in host)
router.get('/host', protect, async (req, res) => {
  const myListings = await Listing.find({ host: req.user._id }).select('_id');
  const listingIds = myListings.map((l) => l._id);
  const bookings = await Booking.find({ listing: { $in: listingIds } })
    .populate('listing', 'title images')
    .populate('guest', 'name email')
    .sort('-createdAt');
  res.json(bookings);
});

// @route  PATCH /api/bookings/:id/cancel
router.patch('/:id/cancel', protect, async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  if (booking.guest.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not your booking' });
  }
  booking.status = 'cancelled';
  await booking.save();
  res.json(booking);
});

module.exports = router;
