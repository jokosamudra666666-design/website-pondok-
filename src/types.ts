/**
 * Shared Type Interfaces for Pondok Pesantren Al-Ghuroba Website
 */

export interface IAdmin {
  uid: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin';
  photoURL?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface INews {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  categoryId: string;
  authorId: string;
  authorName: string;
  tags: string[];
  published: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface IEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  image?: string;
  createdAt: string;
}

export interface IGallery {
  id: string;
  title: string;
  image: string;
  category: string;
  description?: string;
  uploadedBy: string;
  createdAt: string;
}

export interface IBanner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  buttonText?: string;
  buttonLink?: string;
  order: number;
  isActive: boolean;
}

export interface IPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface ISettings {
  siteName: string;
  slogan: string;
  email: string;
  phone: string;
  address: string;
  maps: string;
  logo: string;
  favicon: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
}

export interface IContact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

export interface IDonation {
  id: string;
  title: string;
  description: string;
  bank: string;
  accountNumber: string;
  accountName: string;
  qris?: string;
  isActive: boolean;
}

export interface ILog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  module: string;
  description: string;
  ip?: string;
  createdAt: string;
}
