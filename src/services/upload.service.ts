import api from './api';

interface UploadProgress {
  loaded: number;
  total: number;
}

class UploadService {
  async uploadDesignFile(file: File, orderId?: string, onProgress?: (progress: UploadProgress) => void) {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      const response = await api.uploadDesign(file, orderId);
      return { success: true, fileUrl: response.data.fileUrl, fileId: response.data.fileId };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'File upload failed',
      };
    }
  }

  validateFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 50 * 1024 * 1024; // 50 MB
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/tiff',
      'application/vnd.adobe.illustrator',
      'application/postscript',
      'application/x-cdr',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 50 MB' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'File type not supported. Please upload PDF, image, or design files.' };
    }

    return { valid: true };
  }

  getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  getFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  // Get allowed file types
  getAllowedFileTypes(): string[] {
    return ['.pdf', '.jpg', '.jpeg', '.png', '.tiff', '.ai', '.eps', '.cdr', '.docx'];
  }

  // Get file icon based on type
  getFileIcon(filename: string): string {
    const ext = this.getFileExtension(filename);
    const iconMap: any = {
      pdf: '📄',
      jpg: '🖼️',
      jpeg: '🖼️',
      png: '🖼️',
      tiff: '🖼️',
      ai: '🎨',
      eps: '🎨',
      cdr: '🎨',
      docx: '📝',
    };
    return iconMap[ext] || '📎';
  }
}

export default new UploadService();
