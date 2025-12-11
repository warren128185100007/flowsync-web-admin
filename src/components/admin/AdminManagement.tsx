// src/components/admin/AdminManagement.tsx - FIXED VERSION
'use client';

import React, { useState } from 'react';
import { AdminAuthService } from '@/lib/admin-auth.service';

interface AdminFormData {
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: string[];
}

const AdminManagement: React.FC = () => {
  const [formData, setFormData] = useState<AdminFormData>({
    email: '',
    name: '',
    role: 'admin',
    permissions: ['read']
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{success: boolean; message: string; tempPassword?: string} | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    
    try {
      const response = await AdminAuthService.createNewAdmin({
        ...formData,
        createdBy: 'system'
      });
      
      setResult(response);
      
      if (response.success) {
        setFormData({ 
          email: '', 
          name: '', 
          role: 'admin', 
          permissions: ['read'] 
        });
      }
    } catch (error: any) {
      setResult({ 
        success: false, 
        message: error.message || 'Failed to create admin' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Create New Admin</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            required
            placeholder="admin@example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            required
            placeholder="Admin Name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value as 'super_admin' | 'admin' | 'moderator'})}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          >
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
            <option value="moderator">Moderator</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Permissions</label>
          <div className="grid grid-cols-2 gap-2 p-3 border rounded bg-gray-50">
            {['read', 'write', 'delete', 'manage_users', 'manage_settings', 'view_analytics', 'export_data'].map(perm => (
              <label key={perm} className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.permissions.includes(perm)}
                  onChange={(e) => {
                    const perms = e.target.checked
                      ? [...formData.permissions, perm]
                      : formData.permissions.filter(p => p !== perm);
                    setFormData({...formData, permissions: perms});
                  }}
                  className="mr-2 h-4 w-4 text-blue-600"
                />
                <span className="text-sm capitalize">{perm.replace('_', ' ')}</span>
              </label>
            ))}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors shadow hover:shadow-md"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </span>
          ) : (
            'Create Admin'
          )}
        </button>
      </form>
      
      {result && (
        <div className={`mt-6 p-4 rounded-lg border ${result.success ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {result.success ? (
            <div className="space-y-2">
              <div className="flex items-center">
                <svg className="h-6 w-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="font-bold text-lg">Admin Created Successfully!</p>
              </div>
              
              <div className="bg-white p-3 rounded border mt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-600">Email:</p>
                    <p className="font-medium">{formData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Name:</p>
                    <p className="font-medium">{formData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Role:</p>
                    <p className="font-medium capitalize">{formData.role.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status:</p>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="font-bold text-yellow-800 mb-2">⚠️ Important Security Information</p>
                  <p className="text-sm text-yellow-700 mb-1">Temporary Password:</p>
                  <code className="block font-mono bg-yellow-100 p-2 rounded text-yellow-900 border border-yellow-300">
                    {result.tempPassword}
                  </code>
                  <p className="text-sm text-yellow-700 mt-2">
                    Send this password to the user. They <strong>must</strong> change it on first login.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start">
              <svg className="h-6 w-6 mr-2 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <p className="font-bold">Failed to Create Admin</p>
                <p className="mt-1">{result.message}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminManagement;