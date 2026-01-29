'use client';

import Link from 'next/link';
import { FiStar, FiClock, FiMapPin } from 'react-icons/fi';

interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  imageUrl?: string;
  rating?: number;
  deliveryTime?: string;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const rating = restaurant.rating || 4.5;
  const deliveryTime = restaurant.deliveryTime || '25-35 min';

  return (
    <Link href={`/restaurant/${restaurant.id}`}>
      <div className="group bg-surface rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer">
        <div className="relative h-48 bg-accent/10 overflow-hidden">
          {restaurant.imageUrl ? (
            <img
              src={restaurant.imageUrl}
              alt={restaurant.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 to-primary/10">
              <span className="text-5xl">🥙</span>
            </div>
          )}
          <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
            <FiStar className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-bold text-text-primary">{rating}</span>
          </div>
        </div>
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors leading-tight">
              {restaurant.name}
            </h3>
          </div>
          <p className="text-text-secondary text-sm mb-4 line-clamp-1">{restaurant.description}</p>

          <div className="flex items-center gap-4 border-t border-border pt-4">
            <div className="flex items-center gap-1.5 text-text-secondary">
              <FiClock className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium">{deliveryTime}</span>
            </div>
            <div className="flex items-center gap-1.5 text-text-secondary">
              <FiMapPin className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium truncate max-w-[120px]">{restaurant.address}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
