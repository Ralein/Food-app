'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/auth';
import Navbar from '@/components/Navbar';

const GET_RESTAURANT = gql`
  query GetRestaurant($id: String!) {
    restaurant(id: $id) {
      id
      name
      description
      address
      menuItems {
        id
        name
        description
        price
        category
        imageUrl
      }
    }
  }
`;

const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      totalAmount
    }
  }
`;

export default function RestaurantPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [user, setUser] = useState(getUser());
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const { data, loading } = useQuery(GET_RESTAURANT, {
    variables: { id: params.id },
  });
  const [createOrder, { loading: orderLoading }] = useMutation(CREATE_ORDER);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const addToCart = (itemId: string) => {
    setCart((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId]--;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const getCartTotal = () => {
    if (!data?.restaurant?.menuItems) return 0;
    return Object.entries(cart).reduce((total, [itemId, quantity]) => {
      const item = data.restaurant.menuItems.find((i: any) => i.id === itemId);
      return total + (item?.price || 0) * quantity;
    }, 0);
  };

  const handleCreateOrder = async () => {
    const items = Object.entries(cart).map(([menuItemId, quantity]) => ({
      menuItemId,
      quantity,
    }));

    try {
      const { data: orderData } = await createOrder({
        variables: {
          input: {
            restaurantId: params.id,
            items,
          },
        },
      });
      alert(`Order created! Total: ${getCartTotal().toFixed(2)}`);
      router.push('/orders');
    } catch (error: any) {
      alert(error.message || 'Failed to create order');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {data?.restaurant && (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{data.restaurant.name}</h1>
              <p className="text-gray-600 mt-2">{data.restaurant.description}</p>
              <p className="text-gray-500 text-sm mt-1">📍 {data.restaurant.address}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-4">Menu</h2>
                <div className="space-y-4">
                  {data.restaurant.menuItems.map((item: any) => (
                    <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                        <p className="text-blue-600 font-bold mt-2">
                          {user.country === 'INDIA' ? '₹' : '$'}{item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        {cart[item.id] ? (
                          <>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600"
                            >
                              -
                            </button>
                            <span className="font-semibold">{cart[item.id]}</span>
                            <button
                              onClick={() => addToCart(item.id)}
                              className="bg-green-500 text-white w-8 h-8 rounded-full hover:bg-green-600"
                            >
                              +
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => addToCart(item.id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                  <h2 className="text-xl font-bold mb-4">Cart</h2>
                  {Object.keys(cart).length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Cart is empty</p>
                  ) : (
                    <>
                      <div className="space-y-2 mb-4">
                        {Object.entries(cart).map(([itemId, quantity]) => {
                          const item = data.restaurant.menuItems.find((i: any) => i.id === itemId);
                          return (
                            <div key={itemId} className="flex justify-between text-sm">
                              <span>{item?.name} x{quantity}</span>
                              <span className="font-semibold">
                                {user.country === 'INDIA' ? '₹' : '$'}
                                {((item?.price || 0) * quantity).toFixed(2)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="border-t pt-4 mb-4">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total</span>
                          <span>
                            {user.country === 'INDIA' ? '₹' : '$'}
                            {getCartTotal().toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={handleCreateOrder}
                        disabled={orderLoading}
                        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                      >
                        {orderLoading ? 'Creating...' : 'Place Order'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
