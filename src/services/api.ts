import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor
    this.api.interceptors.request.use(
      config => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor
    this.api.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.api.post('/auth/login', { email, password });
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    company?: string;
  }) {
    return this.api.post('/auth/register', data);
  }

  async forgotPassword(email: string) {
    return this.api.post('/auth/forgot-password', { email });
  }

  async verifyOtp(email: string, otp: string) {
    return this.api.post('/auth/verify-otp', { email, otp });
  }

  async resetPassword(token: string, password: string) {
    return this.api.post('/auth/reset-password', { token, password });
  }

  // Product endpoints
  async createProduct(data: any) {
    return this.api.post('/products', data);
  }

  async getProducts(page = 1, limit = 10, filters?: any) {
    return this.api.get('/products', { params: { page, limit, ...filters } });
  }

  async getProductById(id: string) {
    return this.api.get(`/products/${id}`);
  }

  async updateProduct(id: string, data: any) {
    return this.api.put(`/products/${id}`, data);
  }

  async getProductsByType(type: string) {
    return this.api.get(`/products/type/${type}`);
  }

  async deleteProduct(id: string) {
    return this.api.delete(`/products/${id}`);
  }

  // Order endpoints
  async createOrder(data: any) {
    return this.api.post('/orders', data);
  }

  async getOrders(page = 1, limit = 10) {
    return this.api.get('/orders', { params: { page, limit } });
  }

  async getOrderById(id: string) {
    return this.api.get(`/orders/${id}`);
  }

  async updateOrder(id: string, data: any) {
    return this.api.put(`/orders/${id}`, data);
  }

  async deleteOrder(id: string) {
    return this.api.delete(`/orders/${id}`);
  }


  // File upload
  async uploadDesign(file: File, orderId?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (orderId) formData.append('orderId', orderId);

    return this.api.post('/uploads/design', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  // User endpoints
  async getProfile() {
    return this.api.get('/users/profile');
  }

  async updateProfile(data: any) {
    return this.api.put('/users/profile', data);
  }

  async changePassword(oldPassword: string, newPassword: string) {
    return this.api.post('/users/change-password', { oldPassword, newPassword });
  }

  // Contact/Support
  async sendContactMessage(data: { name: string; email: string; subject: string; message: string }) {
    return this.api.post('/contact', data);
  }

  // Admin endpoints
  async getAdminDashboard() {
    return this.api.get('/admin/dashboard');
  }

  async getAdminOrders(page = 1, limit = 10, filters?: any) {
    return this.api.get('/admin/orders', { params: { page, limit, ...filters } });
  }

  async getAdminCustomers(page = 1, limit = 10) {
    return this.api.get('/admin/customers', { params: { page, limit } });
  }

  async updateAdminOrder(id: string, data: any) {
    return this.api.put(`/admin/orders/${id}`, data);
  }

  async deleteAdminOrder(id: string) {
    return this.api.delete(`/admin/orders/${id}`);
  }
}

export default new ApiService();
