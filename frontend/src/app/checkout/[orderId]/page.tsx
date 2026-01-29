'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { getUser, canCheckout } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import { FiCreditCard, FiShoppingBag, FiMapPin, FiCheckCircle } from 'react-icons/fi';

const GET_ORDER = gql`
  query GetOrder($id: String!) {
    order(id: $id) {
      id
      totalAmount
      status
      restaurant {
        name
      }
      orderItems {
        quantity
        price
        menuItem {
          name
        }
      }
    }
  }
`;

const GET_PAYMENT_METHODS = gql`
  query GetPaymentMethods {
    paymentMethods {
      id
      cardNumber
      cardHolder
      isDefault
    }
  }
`;

const PROCESS_PAYMENT = gql`
  mutation ProcessPayment($input: ProcessPaymentInput!) {
    processPayment(input: $input) {
      id
      amount
    }
  }
`;

export default function CheckoutPage({ params }: { params: { orderId: string } }) {
  const router = useRouter();
  const [user, setUser] = useState(getUser());
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const { data: orderData, loading: orderLoading } = useQuery(GET_ORDER, {
    variables: { id: params.orderId },
  });

  const { data: paymentData, loading: paymentLoading } = useQuery(GET_PAYMENT_METHODS);

  const [processPayment, { loading: processing }] = useMutation(PROCESS_PAYMENT);

  useEffect(() => {
    if (!user || !canCheckout(user)) {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    if (paymentData?.paymentMethods) {
      const defaultMethod = paymentData.paymentMethods.find((pm: any) => pm.isDefault);
      if (defaultMethod) {
        setSelectedPaymentMethod(defaultMethod.id);
      } else if (paymentData.paymentMethods.length > 0) {
        setSelectedPaymentMethod(paymentData.paymentMethods[0].id);
      }
    }
  }, [paymentData]);

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    try {
      await processPayment({
        variables: {
          input: {
            orderId: params.orderId,
            paymentMethodId: selectedPaymentMethod,
          },
        },
      });
      alert('Payment successful!');
      router.push('/orders');
    } catch (error: any) {
      alert(error.message || 'Payment failed');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <FiCheckCircle className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Complete Your Order</h1>
        </div>

        {(orderLoading || paymentLoading) && (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        )}

        {orderData?.order && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              {/* Delivery Section */}
              <section className="bg-surface rounded-2xl p-8 border border-border shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <FiMapPin className="text-primary w-5 h-5" />
                  <h2 className="text-xl font-bold text-text-primary">Delivery Address</h2>
                </div>
                <div className="p-4 bg-background rounded-xl border border-border/50">
                  <p className="font-bold text-text-primary">{user.name}</p>
                  <p className="text-text-secondary text-sm mt-1">123 Fresh Garden Street, Green Valley</p>
                  <p className="text-text-secondary text-sm">{user.country === 'INDIA' ? 'Bengaluru, India' : 'San Francisco, USA'}</p>
                </div>
              </section>

              {/* Payment Section */}
              <section className="bg-surface rounded-2xl p-8 border border-border shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <FiCreditCard className="text-primary w-5 h-5" />
                  <h2 className="text-xl font-bold text-text-primary">Payment Method</h2>
                </div>

                {paymentData?.paymentMethods.length === 0 ? (
                  <div className="text-center py-10 bg-background rounded-2xl border border-dashed border-border">
                    <p className="text-text-secondary mb-6">No payment methods saved yet</p>
                    <button
                      onClick={() => router.push('/payments')}
                      className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-hover transition-all"
                    >
                      Add Payment Method
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paymentData?.paymentMethods.map((method: any) => (
                      <label
                        key={method.id}
                        className={`
                          relative flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all
                          ${selectedPaymentMethod === method.id
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-border hover:border-primary/30 bg-surface'}
                        `}
                      >
                        <div className={`
                          w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 transition-all
                          ${selectedPaymentMethod === method.id ? 'border-primary bg-primary' : 'border-border'}
                        `}>
                          {selectedPaymentMethod === method.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={selectedPaymentMethod === method.id}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                          className="hidden"
                        />
                        <div className="flex-1">
                          <p className="font-bold text-text-primary uppercase tracking-tight text-sm">
                            {method.cardHolder}
                          </p>
                          <p className="text-text-secondary text-sm font-medium">
                            •••• •••• •••• {method.cardNumber.slice(-4)}
                          </p>
                        </div>
                        {method.isDefault && (
                          <span className="text-[10px] font-bold bg-accent text-primary px-2 py-1 rounded-lg uppercase tracking-wider">
                            Default
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* Order Sidebar */}
            <div className="space-y-6">
              <section className="bg-white rounded-2xl p-8 border border-border shadow-sm lg:sticky lg:top-24">
                <div className="flex items-center gap-3 mb-8">
                  <FiShoppingBag className="text-primary w-5 h-5" />
                  <h2 className="text-xl font-bold text-text-primary">Order Summary</h2>
                </div>

                <div className="mb-6">
                  <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">From</p>
                  <p className="font-bold text-primary text-lg">{orderData.order.restaurant.name}</p>
                </div>

                <div className="space-y-4 mb-8">
                  {orderData.order.orderItems.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-accent/20 text-primary font-bold rounded-lg flex items-center justify-center text-[10px]">{item.quantity}x</span>
                        <span className="text-text-primary font-medium">{item.menuItem.name}</span>
                      </div>
                      <span className="font-bold text-text-primary">
                        {user.country === 'INDIA' ? '₹' : '$'}
                        {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-6 border-t border-border mb-8">
                  <div className="flex justify-between text-sm text-text-secondary">
                    <span>Subtotal</span>
                    <span>{user.country === 'INDIA' ? '₹' : '$'}{orderData.order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-text-secondary">
                    <span>Delivery Fee</span>
                    <span className="text-primary font-bold">Free</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-text-primary pt-2">
                    <span>Total</span>
                    <span>
                      {user.country === 'INDIA' ? '₹' : '$'}
                      {orderData.order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={processing || !selectedPaymentMethod}
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none"
                >
                  {processing ? 'Processing...' : 'Place Order'}
                </button>
                <p className="text-center text-[10px] text-text-secondary mt-4 font-medium uppercase tracking-wider">
                  Secure checkout powered by HerbCream
                </p>
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
