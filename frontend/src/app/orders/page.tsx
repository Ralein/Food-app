'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { getUser, canCancelOrder, canCheckout } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import { FiClock, FiCheck, FiX, FiRefreshCw, FiChevronRight, FiShoppingBag } from 'react-icons/fi';

const GET_ORDERS = gql`
  query GetOrders {
    orders {
      id
      totalAmount
      status
      createdAt
      restaurant {
        name
      }
      user {
        name
        email
      }
      orderItems {
        quantity
        price
        menuItem {
          name
        }
      }
      payment {
        id
      }
    }
  }
`;

const CANCEL_ORDER = gql`
  mutation CancelOrder($id: String!) {
    cancelOrder(id: $id) {
      id
      status
    }
  }
`;

export default function OrdersPage() {
  const router = useRouter();
  const [user, setUser] = useState(getUser());
  const { data, loading, refetch } = useQuery(GET_ORDERS);
  const [cancelOrder] = useMutation(CANCEL_ORDER);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      await cancelOrder({ variables: { id: orderId } });
      refetch();
      alert('Order cancelled successfully');
    } catch (error: any) {
      alert(error.message || 'Failed to cancel order');
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      case 'CONFIRMED':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'PREPARING':
        return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'DELIVERED':
        return 'bg-green-50 text-green-700 border-green-100';
      case 'CANCELLED':
        return 'bg-red-50 text-red-700 border-red-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Your Orders</h1>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 text-sm font-bold text-primary hover:bg-primary/5 px-4 py-2 rounded-xl transition-all"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        )}

        {data?.orders && data.orders.length === 0 && (
          <div className="bg-surface rounded-3xl border border-border border-dashed p-16 text-center">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
              <FiShoppingBag className="w-8 h-8" />
            </div>
            <p className="text-text-primary font-bold text-lg">No orders yet</p>
            <p className="text-text-secondary text-sm mt-2">Hungry? Discover delicious healthy meals today!</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="mt-8 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-hover shadow-lg shadow-primary/10 transition-all"
            >
              Order Now
            </button>
          </div>
        )}

        <div className="space-y-6">
          {data?.orders.map((order: any) => (
            <div key={order.id} className="group bg-surface rounded-2xl border border-border overflow-hidden hover:shadow-md transition-all duration-300">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-primary text-2xl">
                      🥙
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors">
                        {order.restaurant.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-text-secondary font-medium">
                        <span className="flex items-center gap-1">
                          <FiClock className="w-3.5 h-3.5" />
                          {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {user.role !== 'MEMBER' && (
                          <span className="flex items-center gap-3">
                            <span className="w-1 h-1 bg-border rounded-full hidden sm:block"></span>
                            <span>{order.user.name}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center flex-wrap gap-4">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusStyle(order.status)} tracking-wider`}>
                      {order.status}
                    </span>
                    {order.payment && (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                        <FiCheck strokeWidth={3} className="w-3.5 h-3.5" />
                        PAID
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-background rounded-2xl p-5 mb-6 border border-border/50">
                  <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-4">Order Items</h4>
                  <ul className="space-y-3">
                    {order.orderItems.map((item: any, idx: number) => (
                      <li key={idx} className="flex justify-between items-center text-sm font-medium">
                        <div className="flex items-center gap-3">
                          <span className="text-primary">{item.quantity}x</span>
                          <span className="text-text-primary">{item.menuItem.name}</span>
                        </div>
                        <span className="text-text-primary">
                          {user.country === 'INDIA' ? '₹' : '$'}
                          {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-border/50 mt-4 pt-4 flex justify-between items-center">
                    <span className="text-sm font-bold text-text-primary">Total Amount</span>
                    <span className="text-lg font-bold text-primary">
                      {user.country === 'INDIA' ? '₹' : '$'}
                      {order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  {canCheckout(user) && order.status === 'PENDING' && !order.payment && (
                    <button
                      onClick={() => router.push(`/checkout/${order.id}`)}
                      className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-hover shadow-lg shadow-primary/10 transition-all text-sm"
                    >
                      Complete Payment
                      <FiChevronRight />
                    </button>
                  )}
                  {canCancelOrder(user) && order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-6 py-2.5 rounded-xl font-bold transition-all text-sm"
                    >
                      <FiX strokeWidth={3} />
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
