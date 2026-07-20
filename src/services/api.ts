/**
 * API Service for Pondok Pesantren Al-Ghuroba Website
 */

const API_BASE = "/api";

export const getAuthToken = () => {
  return localStorage.getItem("pp_al_ghuroba_token");
};

export const setAuthToken = (token: string) => {
  localStorage.setItem("pp_al_ghuroba_token", token);
};

export const clearAuthToken = () => {
  localStorage.removeItem("pp_al_ghuroba_token");
};

const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Terjadi kesalahan pada server");
  }
  return result;
};

export const apiService = {
  // Authentication
  login: async (credentials: any) => {
    const res = await fetchAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    if (res.success && res.data?.token) {
      setAuthToken(res.data.token);
    }
    return res;
  },
  logout: () => {
    clearAuthToken();
    return { success: true, message: "Berhasil logout" };
  },
  getCurrentUser: async () => {
    if (!getAuthToken()) return { success: false, data: null };
    try {
      return await fetchAPI("/auth/me");
    } catch {
      clearAuthToken();
      return { success: false, data: null };
    }
  },

  // Settings
  getSettings: async () => {
    return fetchAPI("/settings");
  },
  updateSettings: async (settings: any) => {
    return fetchAPI("/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  },

  // Static Pages
  getPages: async () => {
    return fetchAPI("/pages");
  },
  getPage: async (slug: string) => {
    return fetchAPI(`/pages/${slug}`);
  },
  updatePage: async (slug: string, data: any) => {
    return fetchAPI(`/pages/${slug}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // News (Berita)
  getNews: async (params?: { categoryId?: string; search?: string; published?: boolean }) => {
    const urlParams = new URLSearchParams();
    if (params?.categoryId) urlParams.append("categoryId", params.categoryId);
    if (params?.search) urlParams.append("search", params.search);
    if (params?.published !== undefined) urlParams.append("published", String(params.published));
    
    const query = urlParams.toString();
    return fetchAPI(`/news${query ? `?${query}` : ""}`);
  },
  getNewsByIdOrSlug: async (idOrSlug: string) => {
    return fetchAPI(`/news/${idOrSlug}`);
  },
  createNews: async (news: any) => {
    return fetchAPI("/news", {
      method: "POST",
      body: JSON.stringify(news),
    });
  },
  updateNews: async (id: string, news: any) => {
    return fetchAPI(`/news/${id}`, {
      method: "PUT",
      body: JSON.stringify(news),
    });
  },
  deleteNews: async (id: string) => {
    return fetchAPI(`/news/${id}`, {
      method: "DELETE",
    });
  },
  getCategories: async () => {
    return fetchAPI("/categories");
  },

  // Events (Agenda)
  getEvents: async () => {
    return fetchAPI("/events");
  },
  createEvent: async (event: any) => {
    return fetchAPI("/events", {
      method: "POST",
      body: JSON.stringify(event),
    });
  },
  updateEvent: async (id: string, event: any) => {
    return fetchAPI(`/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(event),
    });
  },
  deleteEvent: async (id: string) => {
    return fetchAPI(`/events/${id}`, {
      method: "DELETE",
    });
  },

  // Galleries
  getGalleries: async () => {
    return fetchAPI("/galleries");
  },
  createGallery: async (gallery: any) => {
    return fetchAPI("/galleries", {
      method: "POST",
      body: JSON.stringify(gallery),
    });
  },
  deleteGallery: async (id: string) => {
    return fetchAPI(`/galleries/${id}`, {
      method: "DELETE",
    });
  },

  // Banners
  getBanners: async () => {
    return fetchAPI("/banners");
  },
  createBanner: async (banner: any) => {
    return fetchAPI("/banners", {
      method: "POST",
      body: JSON.stringify(banner),
    });
  },
  updateBanner: async (id: string, banner: any) => {
    return fetchAPI(`/banners/${id}`, {
      method: "PUT",
      body: JSON.stringify(banner),
    });
  },
  deleteBanner: async (id: string) => {
    return fetchAPI(`/banners/${id}`, {
      method: "DELETE",
    });
  },

  // Donations
  getDonations: async () => {
    return fetchAPI("/donations");
  },
  createDonation: async (donation: any) => {
    return fetchAPI("/donations", {
      method: "POST",
      body: JSON.stringify(donation),
    });
  },
  updateDonation: async (id: string, donation: any) => {
    return fetchAPI(`/donations/${id}`, {
      method: "PUT",
      body: JSON.stringify(donation),
    });
  },
  deleteDonation: async (id: string) => {
    return fetchAPI(`/donations/${id}`, {
      method: "DELETE",
    });
  },

  // Contacts
  getContacts: async () => {
    return fetchAPI("/contacts");
  },
  submitContact: async (message: any) => {
    return fetchAPI("/contacts", {
      method: "POST",
      body: JSON.stringify(message),
    });
  },
  updateContactStatus: async (id: string, status: string) => {
    return fetchAPI(`/contacts/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  },
  deleteContact: async (id: string) => {
    return fetchAPI(`/contacts/${id}`, {
      method: "DELETE",
    });
  },

  // Logs
  getLogs: async () => {
    return fetchAPI("/logs");
  },

  // Admins
  getAdmins: async () => {
    return fetchAPI("/admins");
  },
  createAdmin: async (admin: any) => {
    return fetchAPI("/admins", {
      method: "POST",
      body: JSON.stringify(admin),
    });
  },
  updateAdmin: async (uid: string, admin: any) => {
    return fetchAPI(`/admins/${uid}`, {
      method: "PUT",
      body: JSON.stringify(admin),
    });
  },
  deleteAdmin: async (uid: string) => {
    return fetchAPI(`/admins/${uid}`, {
      method: "DELETE",
    });
  },

  // File Upload
  uploadImage: async (imageUrl?: string) => {
    return fetchAPI("/upload", {
      method: "POST",
      body: JSON.stringify({ imageUrl }),
    });
  }
};
