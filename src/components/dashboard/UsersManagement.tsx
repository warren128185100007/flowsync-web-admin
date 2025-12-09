// src/components/dashboard/UsersManagement.tsx
'use client';

import { UserPlus, Search, MoreVertical, Mail, Shield } from 'lucide-react';
import { users } from '@/lib/mock-data';
import { useState } from 'react';

export default function UsersManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUsers, setCurrentUsers] = useState(users);

  const filteredUsers = currentUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    const newUser = {
      id: currentUsers.length + 1,
      name: `New User ${currentUsers.length + 1}`,
      email: `user${currentUsers.length + 1}@email.com`,
      role: 'User',
      devices: 1,
      status: 'active' as const
    };
    setCurrentUsers([...currentUsers, newUser]);
  };

  const toggleUserStatus = (id: number) => {
    setCurrentUsers(currentUsers.map(user =>
      user.id === id ? {
        ...user,
        status: user.status === 'active' ? 'inactive' : 'active'
      } : user
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Users Management
          </h2>
          <p className="text-gray-600">
            Manage system users and permissions
          </p>
        </div>
        <button
          onClick={handleAddUser}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors font-medium"
        >
          <UserPlus size={18} />
          Add User
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search users by name, email, or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
        />
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                USER
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                ROLE
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                DEVICES
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                STATUS
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Mail size={12} />
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Shield size={16} className={
                      user.role === 'Administrator' ? 'text-red-500' :
                      user.role === 'Operator' ? 'text-amber-500' :
                      'text-blue-500'
                    } />
                    <span className="font-medium text-gray-800">{user.role}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">{user.devices}</span>
                    <span className="text-sm text-gray-500">devices</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => toggleUserStatus(user.id)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {user.status === 'active' ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="py-4 px-6">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical size={18} className="text-gray-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination/Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t border-gray-200">
        <p className="text-gray-600 mb-4 sm:mb-0">
          Showing {filteredUsers.length} of {currentUsers.length} users
        </p>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
            Previous
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            1
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
            2
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}