const express = require('express');
const Review = require('../models/Review');
const Listing = require('../models/Listing');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route  GET /api/reviews/listing/:listingId
router.get('/listing/:listingId', async (req, res) => {
  const reviews = await Review.find({ listing: req.params.listingId })
    .populate('author', 'name avatar')
    .sort('-createdAt');
  res.json(reviews);
});

// @route  POST /api/reviews  (one review per user per listing)
router.post('/', protect, async (req, res) => {
  try {
    const { listingId, rating, comment } = req.body;
    const review = await Review.create({ listing: listingId, author: req.user._id, rating, comment });

    // Recalculate listing's aggregate rating
    const stats = await Review.aggregate([
      { $match: { listing: review.listing } },
      { $group: { _id: '$listing', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    if (stats.length) {
      await Listing.findByIdAndUpdate(listingId, {
        ratingAverage: Math.round(stats[0].avg * 10) / 10,
        ratingCount: stats[0].count,
      });
    }

    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You already reviewed this listing' });
    }
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
