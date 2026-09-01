import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ checkIn: '', checkOut: '', guests: 1 });
  const [message, setMessage] = useState('');
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    api.get(`/listings/${id}`).then((res) => setListing(res.data));
    api.get(`/reviews/listing/${id}`).then((res) => setReviews(res.data));
  }, [id]);

  const nights =
    form.checkIn && form.checkOut
      ? Math.max(0, Math.ceil((new Date(form.checkOut) - new Date(form.checkIn)) / 86400000))
      : 0;
  const total = listing ? nights * listing.pricePerNight : 0;

  const handleBook = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!user) { setMessage('Please log in to book.'); return; }
    setBooking(true);
    try {
      await api.post('/bookings', {
        listingId: id,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: Number(form.guests),
      });
      setMessage('Booking confirmed! Check "My trips" for details.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (!listing) return <p className="p-10 text-center text-harbor-700">Loading…</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl text-harbor-900">{listing.title}</h1>
      <p className="text-harbor-700/70 mt-1">{listing.address.city}, {listing.address.country}</p>

      <div className="mt-6 rounded-2xl overflow-hidden aspect-video bg-sand-100">
        <img
          src={listing.images?.[0] || 'https://picsum.photos/seed/staynest/1200/700'}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <p className="text-harbor-800 leading-relaxed">{listing.description}</p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-harbor-700">
            <span className="px-3 py-1.5 bg-sand-100 rounded-full">{listing.maxGuests} guests</span>
            <span className="px-3 py-1.5 bg-sand-100 rounded-full">{listing.bedrooms} bedrooms</span>
            <span className="px-3 py-1.5 bg-sand-100 rounded-full">{listing.beds} beds</span>
            <span className="px-3 py-1.5 bg-sand-100 rounded-full">{listing.baths} baths</span>
          </div>

          {listing.amenities?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-display text-xl text-harbor-900 mb-2">Amenities</h3>
              <ul className="grid grid-cols-2 gap-2 text-harbor-700 text-sm">
                {listing.amenities.map((a) => <li key={a}>• {a}</li>)}
              </ul>
            </div>
          )}

          <div className="mt-10">
            <h3 className="font-display text-xl text-harbor-900 mb-3">
              Reviews {listing.ratingCount > 0 && `· ★ ${listing.ratingAverage.toFixed(1)} (${listing.ratingCount})`}
            </h3>
            {reviews.length === 0 ? (
              <p className="text-harbor-700/70 text-sm">No reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r._id} className="border-b border-harbor-800/10 pb-3">
                    <p className="font-medium text-harbor-900">{r.author?.name} · ★ {r.rating}</p>
                    <p className="text-harbor-700 text-sm">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="lg:col-span-1">
          <form onSubmit={handleBook} className="border border-harbor-800/10 rounded-2xl p-5 shadow-sm sticky top-24">
            <p className="text-lg text-harbor-900">
              <span className="font-semibold">₹{listing.pricePerNight.toLocaleString('en-IN')}</span>
              <span className="text-harbor-700/70 text-sm"> / night</span>
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-harbor-700">Check-in</label>
                <input
                  type="date" required value={form.checkIn}
                  onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
                  className="w-full mt-1 px-2 py-2 rounded-lg border border-harbor-800/15 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-harbor-700">Check-out</label>
                <input
                  type="date" required value={form.checkOut}
                  onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
                  className="w-full mt-1 px-2 py-2 rounded-lg border border-harbor-800/15 text-sm"
                />
              </div>
            </div>

            <div className="mt-2">
              <label className="text-xs text-harbor-700">Guests</label>
              <input
                type="number" min="1" max={listing.maxGuests} required
                value={form.guests}
                onChange={(e) => setForm({ ...form, guests: e.target.value })}
                className="w-full mt-1 px-2 py-2 rounded-lg border border-harbor-800/15 text-sm"
              />
            </div>

            {nights > 0 && (
              <p className="mt-3 text-sm text-harbor-700">
                ₹{listing.pricePerNight.toLocaleString('en-IN')} × {nights} night{nights > 1 ? 's' : ''} = <span className="font-semibold text-harbor-900">₹{total.toLocaleString('en-IN')}</span>
              </p>
            )}

            <button
              type="submit" disabled={booking}
              className="mt-4 w-full py-3 rounded-xl bg-gold-500 text-harbor-900 font-semibold hover:bg-gold-600 transition-colors disabled:opacity-50"
            >
              {booking ? 'Booking…' : 'Reserve'}
            </button>

            {message && <p className="mt-3 text-sm text-harbor-800">{message}</p>}
          </form>
        </aside>
      </div>
    </div>
  );
}
