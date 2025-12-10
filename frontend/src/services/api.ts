import axios from 'axios';
import { ApiResponse, Document, UploadResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const documentService = {
  // Upload document
  uploadDocument: async (file: File): Promise<ApiResponse<UploadResponse>> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<ApiResponse<UploadResponse>>(
      '/documents/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Get all documents
  getAllDocuments: async (): Promise<ApiResponse<Document[]>> => {
    const response = await api.get<ApiResponse<Document[]>>('/documents');
    return response.data;
  },

  // Download document
  downloadDocument: async (id: number, filename: string): Promise<void> => {
    const response = await api.get(`/documents/${id}`, {
      responseType: 'blob',
    });

    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // Delete document
  deleteDocument: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/documents/${id}`);
    return response.data;
  },
};

export default api;