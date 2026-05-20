import api from './api';
import { Order, Quotation } from '../types';

class OrderService {
  async createOrder(data: Partial<Order>) {
    try {
      const response = await api.createOrder(data);
      return { success: true, order: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create order',
      };
    }
  }

  async getOrders(page = 1, limit = 10) {
    try {
      const response = await api.getOrders(page, limit);
      return { success: true, orders: response.data.orders, total: response.data.total };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch orders',
      };
    }
  }

  async getOrderById(id: string) {
    try {
      const response = await api.getOrderById(id);
      return { success: true, order: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch order',
      };
    }
  }

  async updateOrder(id: string, data: Partial<Order>) {
    try {
      const response = await api.updateOrder(id, data);
      return { success: true, order: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update order',
      };
    }
  }

  async cancelOrder(id: string) {
    try {
      const response = await api.updateOrder(id, { status: 'cancelled' });
      return { success: true, order: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to cancel order',
      };
    }
  }

  async createQuotation(data: Partial<Quotation>) {
    try {
      const response = await api.createQuotation(data);
      return { success: true, quotation: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create quotation',
      };
    }
  }

  async getQuotations(page = 1, limit = 10) {
    try {
      const response = await api.getQuotations(page, limit);
      return { success: true, quotations: response.data.quotations, total: response.data.total };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch quotations',
      };
    }
  }

  async getQuotationById(id: string) {
    try {
      const response = await api.getQuotationById(id);
      return { success: true, quotation: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch quotation',
      };
    }
  }

  async updateQuotation(id: string, data: Partial<Quotation>) {
    try {
      const response = await api.updateQuotation(id, data);
      return { success: true, quotation: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update quotation',
      };
    }
  }

  async convertQuotationToOrder(quotationId: string) {
    try {
      const response = await api.updateQuotation(quotationId, { status: 'converted' });
      return { success: true, quotation: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to convert quotation',
      };
    }
  }
}

export default new OrderService();
