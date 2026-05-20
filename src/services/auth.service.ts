import api from './api';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  company?: string;
}

class AuthService {
  async login(credentials: LoginPayload) {
    try {
      const response = await api.login(credentials.email, credentials.password);
      const { accessToken, user } = response.data.data;

      localStorage.setItem('authToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));

      return { success: true, user };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  }

  async register(payload: RegisterPayload) {
    try {
      const response = await api.register(payload);
      const { accessToken, user } = response.data.data;

      localStorage.setItem('authToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));

      return { success: true, user };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      };
    }
  }

  async forgotPassword(email: string) {
    try {
      await api.forgotPassword(email);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to send reset email',
      };
    }
  }

  async verifyOtp(email: string, otp: string) {
    try {
      const response = await api.verifyOtp(email, otp);
      return { success: true, resetToken: response.data.resetToken };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Invalid OTP',
      };
    }
  }

  async resetPassword(token: string, password: string) {
    try {
      await api.resetPassword(token, password);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to reset password',
      };
    }
  }

  async logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return { success: true };
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  async updateProfile(data: any) {
    try {
      const response = await api.updateProfile(data);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return { success: true, user: response.data.user };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update profile',
      };
    }
  }

  async changePassword(oldPassword: string, newPassword: string) {
    try {
      await api.changePassword(oldPassword, newPassword);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to change password',
      };
    }
  }
}

export default new AuthService();
