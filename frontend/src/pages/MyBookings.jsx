import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  const load = () => api.get('/bookings/mine').then((res) => setBookings(res.data));
  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    await api.patch(`/bookings/${id}/cancel`);
    load();
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl text-harbor-900 mb-6">My trips</h1>
      {bookings.length === 0 ? (
        <p className="text-harbor-700">No trips booked yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b._id} className="flex items-center justify-between border border-harbor-800/10 rounded-2xl p-4">
              <div>
                <p className="font-medium text-harbor-900">{b.listing?.title}</p>
                <p className="text-sm text-harbor-700">
                  {new Date(b.checkIn).toLocaleDateString()} → {new Date(b.checkOut).toLocaleDateString()} · {b.guests} guests
                </p>
                <p className="text-sm text-harbor-700/70">
                  ₹{b.totalPrice.toLocaleString('en-IN')} · <span className="capitalize">{b.status}</span>
                </p>
              </div>
              {b.status === 'confirmed' && (
                <button
                  onClick={() => cancel(b._id)}
                  className="text-sm px-3 py-1.5 rounded-full border border-harbor-800/20 hover:border-red-400 hover:text-red-600 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
