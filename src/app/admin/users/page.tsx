'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Backend_URL } from '@/app/lib/Constants';
import { User } from '@/app/lib/types';
import toast from 'react-hot-toast';

const USERS_PER_PAGE = 10;

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    async function fetchUsers() {
      const response = await axios.get(`${Backend_URL}/users`);
      setUsers(response.data);
    }
    fetchUsers();
  }, []);

  const handleSort = (criteria: string) => {
    setSortCriteria(criteria);
    let sortedUsers = [...users];

    switch(criteria) {
      case "name":
        return sortedUsers.sort((a, b) => a.name.localeCompare(b.name));
      case "role":
        sortedUsers.sort((a, b) => (a.isAdmin === b.isAdmin ? 0 : a.isAdmin ? -1 : 1));
    }
    setUsers(sortedUsers);
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      await axios.delete(`${Backend_URL}/users/${userId}`);
      toast.success('User deleted successfully!');
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <div className="flex justify-between mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name"
          className="border border-gray-300 p-2 rounded-lg w-1/2"
        />
        <select
          value={sortCriteria}
          onChange={(e) => handleSort(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg"
        >
          <option value="">Sort by</option>
          <option value="name">Name (A-Z)</option>
          <option value="role">Role (Admin/User)</option>
        </select>
      </div>

      <table className="min-w-full bg-white">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-2 px-4">ID</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Role</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map(user => (
            <tr key={user.id} className="border-b">
              <td className="py-2 px-4 cursor-pointer hover:underline"
                  onClick={() => router.push(`/admin/users/${user.id}`)}>
                {user.id}
              </td>
              <td className="py-2 px-4">{user.email}</td>
              <td className="py-2 px-4">{user.name}</td>
              <td className="py-2 px-4 text-center">
                {user.isAdmin ? 'Admin' : 'User'}
              </td>
              <td className="py-2 px-4 text-center">
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => router.push(`/admin/users/${user.id}/edit`)}
                >
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDeleteUser(user.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center mt-4 space-x-2">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2"
        >
          Previous
        </Button>
        <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
