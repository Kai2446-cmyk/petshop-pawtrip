// pages/admin/users/index.js
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../../lib/supabase'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const router = useRouter()

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, phone, address, role, created_at')
        .order('created_at', { ascending: false })

      if (!error) setUsers(data)
      else console.error('Error fetching users:', error)
    }

    fetchUsers()
  }, [])

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <button
        onClick={() => router.push('/admin')}
        className="mb-4 inline-flex items-center text-orange-600 hover:text-orange-800 font-medium"
      >
        ← Kembali ke Dashboard
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">👤 Manajemen Pengguna</h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border">
        <table className="min-w-full text-sm">
          <thead className="bg-orange-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Nama</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">No HP</th>
              <th className="px-4 py-2 text-left">Alamat</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Dibuat</th>
              <th className="px-4 py-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t hover:bg-orange-50">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.phone}</td>
                <td className="px-4 py-2">{user.address}</td>
                <td className="px-4 py-2 capitalize">{user.role}</td>
                <td className="px-4 py-2">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-center">
                  <button className="text-blue-600 hover:underline mr-2">Edit</button>
                  <button className="text-red-600 hover:underline">Hapus</button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  Belum ada data pengguna.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminUsers
