import api from './api';

interface PaymentInitiationData {
  orderId: string;
  amount: number;
  method: 'credit_card' | 'debit_card' | 'upi' | 'bank_transfer' | 'wallet';
  email: string;
  phone: string;
}

class PaymentService {
  async initiatePayment(data: PaymentInitiationData) {
    try {
      const response = await api.initiatePayment(data.orderId, data.amount, data.method);
      return { success: true, paymentId: response.data.paymentId, ...response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to initiate payment',
      };
    }
  }

  async verifyPayment(paymentId: string, verificationData: any) {
    try {
      const response = await api.verifyPayment(paymentId, verificationData);
      return { success: true, order: response.data.order };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Payment verification failed',
      };
    }
  }

  async getPayments(page = 1, limit = 10) {
    try {
      const response = await api.getPayments(page, limit);
      return { success: true, payments: response.data.payments, total: response.data.total };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch payments',
      };
    }
  }

  // Initialize Razorpay payment (if using Razorpay)
  initializeRazorpay(orderId: string, amount: number, email: string, phone: string) {
    return new Promise((resolve, reject) => {
      // This is a simplified example - actual implementation would depend on Razorpay setup
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: amount * 100, // Convert to paise
          currency: 'INR',
          order_id: orderId,
          customer: {
            email,
            phone,
          },
          handler: (response: any) => {
            resolve(response);
          },
          prefill: {
            email,
            contact: phone,
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      };
      script.onerror = () => {
        reject(new Error('Failed to load Razorpay'));
      };
      document.body.appendChild(script);
    });
  }

  // Generate invoice
  generateInvoice(orderId: string) {
    return new Promise((resolve, reject) => {
      try {
        // Call backend to generate PDF invoice
        window.location.href = `/api/v1/invoices/${orderId}/download`;
        resolve({ success: true });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Get payment methods available for an order
  getPaymentMethods(orderAmount: number): any[] {
    return [
      {
        id: 'credit_card',
        name: 'Credit Card',
        icon: '💳',
        enabled: true,
        description: 'Visa, Mastercard, American Express',
      },
      {
        id: 'debit_card',
        name: 'Debit Card',
        icon: '🏧',
        enabled: true,
        description: 'All major banks',
      },
      {
        id: 'upi',
        name: 'UPI',
        icon: '📱',
        enabled: true,
        description: 'Google Pay, PhonePe, Paytm',
      },
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        icon: '🏦',
        enabled: true,
        description: 'Direct bank transfer',
      },
      {
        id: 'wallet',
        name: 'Digital Wallet',
        icon: '👛',
        enabled: orderAmount > 0,
        description: 'PayTM, Amazon Pay',
      },
    ];
  }

  // Check payment status
  async checkPaymentStatus(paymentId: string) {
    try {
      const response = await api.api.get(`/payments/${paymentId}/status`);
      return { success: true, status: response.data.status };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to check payment status',
      };
    }
  }
}

export default new PaymentService();
