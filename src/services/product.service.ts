import api from './api';
import { Product } from '../types';

class ProductService {
  async getProducts(page = 1, limit = 10, filters?: any) {
    try {
      const response = await api.getProducts(page, limit, filters);
      return { success: true, products: response.data.products, total: response.data.total };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch products',
      };
    }
  }

  async getProductById(id: string) {
    try {
      const response = await api.getProductById(id);
      return { success: true, product: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch product',
      };
    }
  }

  async getProductsByType(type: string) {
    try {
      const response = await api.getProductsByType(type);
      return { success: true, products: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch products',
      };
    }
  }

  async searchProducts(query: string) {
    try {
      const response = await api.getProducts(1, 20, { search: query });
      return { success: true, products: response.data.products };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to search products',
      };
    }
  }

  // Calculate price based on quantity and customization options
  calculatePrice(basePrice: number, quantity: number, customizations: any = {}): number {
    let price = basePrice * quantity;

    // Apply volume discounts
    if (quantity >= 1000) price *= 0.9;
    else if (quantity >= 500) price *= 0.95;

    // Apply customization charges
    if (customizations.hasLamination) price += quantity * 5;
    if (customizations.hasEmbossing) price += quantity * 8;
    if (customizations.hasFoilStamping) price += quantity * 10;
    if (customizations.hasSpecialBinding) price += quantity * 3;

    return Math.round(price);
  }

  // Get available customization options for a product
  getCustomizationOptions(productType: string): any[] {
    const customizations: any = {
      Calendars: [
        { id: 'lamination', name: 'Lamination', price: 5 },
        { id: 'spiral_binding', name: 'Spiral Binding', price: 8 },
        { id: 'foil_stamping', name: 'Foil Stamping', price: 10 },
      ],
      Diaries: [
        { id: 'embossing', name: 'Embossing', price: 8 },
        { id: 'foil_stamping', name: 'Foil Stamping', price: 10 },
        { id: 'ribbon', name: 'Ribbon Bookmark', price: 3 },
      ],
      Notebooks: [
        { id: 'lamination', name: 'Lamination', price: 5 },
        { id: 'spiral_binding', name: 'Spiral Binding', price: 8 },
      ],
      Invitations: [
        { id: 'foil_stamping', name: 'Foil Stamping', price: 10 },
        { id: 'embossing', name: 'Embossing', price: 8 },
      ],
    };

    return customizations[productType] || [];
  }

  // Get available materials
  getMaterials(): string[] {
    return ['Paper', 'Cardstock', 'Kraft Paper', 'Leather', 'Fabric'];
  }

  // Get available sizes
  getSizes(productType: string): any[] {
    const sizes: any = {
      Calendars: [
        { id: 'a3', name: 'A3 (420mm x 297mm)', price: 0 },
        { id: 'a4', name: 'A4 (297mm x 210mm)', price: -5 },
      ],
      Diaries: [
        { id: 'pocket', name: 'Pocket (85mm x 120mm)', price: -10 },
        { id: 'standard', name: 'Standard (105mm x 148mm)', price: 0 },
        { id: 'large', name: 'Large (148mm x 210mm)', price: 15 },
      ],
      Notebooks: [
        { id: 'a5', name: 'A5 (148mm x 210mm)', price: -5 },
        { id: 'a4', name: 'A4 (297mm x 210mm)', price: 0 },
      ],
    };

    return sizes[productType] || [];
  }
}

export default new ProductService();
