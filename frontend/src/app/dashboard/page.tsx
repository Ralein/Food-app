'use client';

import { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { getUser, logout } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import RestaurantCard from '@/components/RestaurantCard';

const GET_RESTAURANTS = gql`
  query GetRestaurants {
    restaurants {
      id
      name
      description
      country
      address
      imageUrl
    }
  }
`;

import CategoryChips from '@/components/CategoryChips';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(getUser());
  const { data, loading, error } = useQuery(GET_RESTAURANTS);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-text-primary tracking-tight mb-2">
                Fresh meals for you, {user.name.split(' ')[0]}!
              </h1>
              <p className="text-text-secondary font-medium">
                Showing top-rated healthy kitchens in {user.country === 'INDIA' ? '🇮🇳 India' : '🇺🇸 America'}
              </p>
            </div>

            <div className="hidden lg:flex items-center gap-2 bg-surface p-1.5 rounded-2xl border border-border shadow-sm">
              <button className="px-4 py-2 text-sm font-bold bg-primary text-white rounded-xl transition-all">Delivery</button>
              <button className="px-4 py-2 text-sm font-bold text-text-secondary hover:text-text-primary rounded-xl transition-all">Pickup</button>
            </div>
          </div>
        </header>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text-primary">All Categories</h2>
            <button className="text-sm font-bold text-primary hover:underline">View All</button>
          </div>
          <CategoryChips />
        </section>

        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-text-primary">Featured Restaurants</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-text-secondary font-medium">Sort by:</span>
              <select className="bg-transparent text-sm font-bold text-text-primary outline-none cursor-pointer">
                <option>Most Popular</option>
                <option>Fastest Delivery</option>
                <option>Top Rated</option>
              </select>
            </div>
          </div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-surface rounded-2xl border border-border h-[320px] animate-pulse">
                  <div className="h-48 bg-accent/5 rounded-t-2xl"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-accent/5 rounded w-1/2"></div>
                    <div className="h-4 bg-accent/5 rounded w-3/4"></div>
                    <div className="h-4 bg-accent/5 rounded w-1/4 mt-4"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl text-center">
              <p className="font-semibold">Oops! Something went wrong.</p>
              <p className="text-sm">We couldn't load the restaurants right now. Please try again later.</p>
            </div>
          )}

          {data && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.restaurants.map((restaurant: any) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          )}

          {data && data.restaurants.length === 0 && (
            <div className="text-center py-20 bg-surface rounded-3xl border border-dashed border-border">
              <span className="text-5xl mb-4 block">🏜️</span>
              <p className="text-text-primary font-bold text-lg">No restaurants found</p>
              <p className="text-text-secondary text-sm">Try changing your location or filters.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
