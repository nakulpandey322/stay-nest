import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const empty = {
  title: '', description: '', city: '', country: '', line1: '',
  pricePerNight: '', maxGuests: 2, bedrooms: 1, beds: 1, baths: 1,
  category: 'house', amenities: '', imageUrl: '',
};

export default function CreateListing() {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/listings', {
        title: form.title,
        description: form.description,
        address: { city: form.city, country: form.country, line1: form.line1 },
        pricePerNight: Number(form.pricePerNight),
        maxGuests: Number(form.maxGuests),
        bedrooms: Number(form.bedrooms),
        beds: Number(form.beds),
        baths: Number(form.baths),
        category: form.category,
        amenities: form.amenities.split(',').map((a) => a.trim()).filter(Boolean),
        images: form.imageUrl ? [form.imageUrl] : [],
      });
      navigate('/host/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create listing');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl text-harbor-900 mb-6">List your space</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required placeholder="Title" value={form.title} onChange={update('title')}
          className="w-full px-4 py-3 rounded-xl border border-harbor-800/15" />
        <textarea required placeholder="Description" rows={4} value={form.description} onChange={update('description')}
          className="w-full px-4 py-3 rounded-xl border border-harbor-800/15" />

        <div className="grid grid-cols-2 gap-3">
          <input required placeholder="City" value={form.city} onChange={update('city')}
            className="px-4 py-3 rounded-xl border border-harbor-800/15" />
          <input required placeholder="Country" value={form.country} onChange={update('country')}
            className="px-4 py-3 rounded-xl border border-harbor-800/15" />
        </div>
        <input placeholder="Address line (optional)" value={form.line1} onChange={update('line1')}
          className="w-full px-4 py-3 rounded-xl border border-harbor-800/15" />

        <div className="grid grid-cols-2 gap-3">
          <input required type="number" min="0" placeholder="Price per night (₹)" value={form.pricePerNight} onChange={update('pricePerNight')}
            className="px-4 py-3 rounded-xl border border-harbor-800/15" />
          <select value={form.category} onChange={update('category')} className="px-4 py-3 rounded-xl border border-harbor-800/15">
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="cabin">Cabin</option>
            <option value="villa">Villa</option>
            <option value="unique">Unique</option>
            <option value="beachfront">Beachfront</option>
          </select>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <input type="number" min="1" placeholder="Guests" value={form.maxGuests} onChange={update('maxGuests')}
            className="px-3 py-3 rounded-xl border border-harbor-800/15" />
          <input type="number" min="0" placeholder="Bedrooms" value={form.bedrooms} onChange={update('bedrooms')}
            className="px-3 py-3 rounded-xl border border-harbor-800/15" />
          <input type="number" min="0" placeholder="Beds" value={form.beds} onChange={update('beds')}
            className="px-3 py-3 rounded-xl border border-harbor-800/15" />
          <input type="number" min="0" placeholder="Baths" value={form.baths} onChange={update('baths')}
            className="px-3 py-3 rounded-xl border border-harbor-800/15" />
        </div>

        <input placeholder="Amenities, comma separated (WiFi, Kitchen, Pool)" value={form.amenities} onChange={update('amenities')}
          className="w-full px-4 py-3 rounded-xl border border-harbor-800/15" />
        <input placeholder="Image URL (optional)" value={form.imageUrl} onChange={update('imageUrl')}
          className="w-full px-4 py-3 rounded-xl border border-harbor-800/15" />

        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={submitting}
          className="w-full py-3 rounded-xl bg-harbor-900 text-sand-50 font-semibold hover:bg-harbor-800 transition-colors disabled:opacity-50">
          {submitting ? 'Publishing…' : 'Publish listing'}
        </button>
      </form>
    </div>
  );
}
