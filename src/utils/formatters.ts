export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatDate = (date: Date | string, format: string = 'DD/MM/YYYY'): string => {
  const d = typeof date === 'string' ? new Date(date) : date;

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  const formatMap: any = {
    DD: day,
    MM: month,
    YYYY: year,
    HH: hours,
    mm: minutes,
  };

  let formatted = format;
  Object.entries(formatMap).forEach(([key, value]) => {
    formatted = formatted.replace(key, String(value));
  });

  return formatted;
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91-${cleaned.substring(0, 4)}-${cleaned.substring(4, 7)}-${cleaned.substring(7)}`;
  }
  return phone;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const formatOrderNumber = (id: string | number): string => {
  return `ORD-${String(id).padStart(6, '0')}`;
};

export const formatQuotationNumber = (id: string | number): string => {
  return `QUOT-${String(id).padStart(6, '0')}`;
};

export const truncateText = (text: string, length: number = 100): string => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const capitalizeWords = (text: string): string => {
  return text
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

export const formatAddress = (address: any): string => {
  const parts = [address.street, address.city, address.state, address.pincode, address.country];
  return parts.filter(Boolean).join(', ');
};
