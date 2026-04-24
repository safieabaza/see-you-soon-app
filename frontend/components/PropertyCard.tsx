import Image from 'next/image';
import Link from 'next/link';

type PropertyCardProps = {
  property: {
    title: string;
    slug: string;
    city: string;
    pricePerNight: number;
    guests: number;
    bedrooms: number;
    bathrooms: number;
    images: string[];
  };
};

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/properties/${property.slug}`} className="block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-64 w-full">
        <Image src={property.images[0]} alt={property.title} fill className="object-cover" />
      </div>
      <div className="p-5">
        <p className="text-sm text-slate-500">{property.city}</p>
        <h3 className="mt-2 text-xl font-semibold text-slate-900">{property.title}</h3>
        <p className="mt-3 text-sm text-slate-600">{property.bedrooms} beds · {property.bathrooms} baths · {property.guests} guests</p>
        <div className="mt-4 text-lg font-semibold text-brand-700">${property.pricePerNight.toFixed(0)} / night</div>
      </div>
    </Link>
  );
}
