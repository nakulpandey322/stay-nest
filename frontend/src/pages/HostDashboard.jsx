import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function HostDashboard() {
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get('/listings/host/mine').then((res) => setListings(res.data));
    api.get('/bookings/host').then((res) => setBookings(res.data));
  }, []);

  const removeListing = async (id) => {
    if (!confirm('Delete this listing?')) return;
    await api.delete(`/listings/${id}`);
    setListings((prev) => prev.filter((l) => l._id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl text-harbor-900">Host dashboard</h1>
        <Link
          to="/host/new-listing"
          className="px-4 py-2 rounded-xl bg-gold-500 text-harbor-900 font-semibold hover:bg-gold-600 transition-colors"
        >
          + New listing
        </Link>
      </div>

      <h2 className="font-display text-xl text-harbor-900 mb-3">Your listings</h2>
      {listings.length === 0 ? (
        <p className="text-harbor-700 mb-8">You haven't published any listings yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {listings.map((l) => (
            <div key={l._id} className="border border-harbor-800/10 rounded-2xl p-4 flex justify-between items-start">
              <div>
                <p className="font-medium text-harbor-900">{l.title}</p>
                <p className="text-sm text-harbor-700/70">{l.address.city} · ₹{l.pricePerNight}/night</p>
              </div>
              <button
                onClick={() => removeListing(l._id)}
                className="text-sm text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <h2 className="font-display text-xl text-harbor-900 mb-3">Incoming bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-harbor-700">No bookings yet.</p>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b._id} className="border border-harbor-800/10 rounded-2xl p-4">
              <p className="font-medium text-harbor-900">{b.listing?.title}</p>
              <p className="text-sm text-harbor-700">
                {b.guest?.name} · {new Date(b.checkIn).toLocaleDateString()} → {new Date(b.checkOut).toLocaleDateString()}
              </p>
              <p className="text-sm text-harbor-700/70 capitalize">{b.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
