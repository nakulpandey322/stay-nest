import { Link } from 'react-router-dom';

export default function ListingCard({ listing }) {
  return (
    <Link
      to={`/listings/${listing._id}`}
      className="group block rounded-2xl overflow-hidden bg-white border border-harbor-800/5 shadow-sm hover:shadow-lg transition-shadow"
    >
      <div className="aspect-[4/3] overflow-hidden bg-sand-100">
        <img
          src={listing.images?.[0] || 'https://picsum.photos/seed/staynest/800/600'}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg leading-snug text-harbor-900">{listing.title}</h3>
          {listing.ratingCount > 0 && (
            <span className="shrink-0 text-sm text-harbor-700">★ {listing.ratingAverage.toFixed(1)}</span>
          )}
        </div>
        <p className="text-sm text-harbor-700/70 mt-1">{listing.address?.city}, {listing.address?.country}</p>
        <p className="mt-2 text-harbor-900">
          <span className="font-semibold">₹{listing.pricePerNight.toLocaleString('en-IN')}</span>
          <span className="text-harbor-700/70 text-sm"> / night</span>
        </p>
      </div>
    </Link>
  );
}
