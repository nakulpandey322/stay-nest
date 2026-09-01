import { useEffect, useState } from 'react';
import api from '../api/axios';
import ListingCard from '../components/ListingCard';

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ city: '', guests: '', maxPrice: '' });

  const fetchListings = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await api.get('/listings', { params });
      setListings(data.listings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchListings(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (filters.city) params.city = filters.city;
    if (filters.guests) params.guests = filters.guests;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    fetchListings(params);
  };

  return (
    <div>
      <section className="bg-harbor-900 text-sand-50">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h1 className="font-display text-4xl md:text-5xl font-semibold max-w-xl leading-tight">
            Find a place that feels like yours, wherever you're headed.
          </h1>
          <p className="mt-3 text-aqua-300 max-w-md">
            Handpicked homes, cabins and villas — booked directly with the people who host them.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-8 bg-sand-50 rounded-2xl p-3 flex flex-col sm:flex-row gap-2 max-w-2xl shadow-xl"
          >
            <input
              type="text"
              placeholder="Where to?"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="flex-1 px-4 py-3 rounded-xl text-harbor-900 outline-none"
            />
            <input
              type="number"
              min="1"
              placeholder="Guests"
              value={filters.guests}
              onChange={(e) => setFilters({ ...filters, guests: e.target.value })}
              className="sm:w-28 px-4 py-3 rounded-xl text-harbor-900 outline-none"
            />
            <input
              type="number"
              min="0"
              placeholder="Max price"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              className="sm:w-32 px-4 py-3 rounded-xl text-harbor-900 outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gold-500 text-harbor-900 font-semibold hover:bg-gold-600 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="font-display text-2xl text-harbor-900 mb-6">
          {filters.city ? `Stays in ${filters.city}` : 'Popular stays'}
        </h2>

        {loading ? (
          <p className="text-harbor-700">Loading listings…</p>
        ) : listings.length === 0 ? (
          <p className="text-harbor-700">No listings match those filters yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((l) => (
              <ListingCard key={l._id} listing={l} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
