import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'
import AdminNavbar from '../../components/AdminNavbar'

const AdminDashboard = () => {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [onlineCount, setOnlineCount] = useState(0)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        alert('Akses ditolak. Halaman hanya untuk admin.')
        router.push('/')
        return
      }

      setUser(user)
      fetchProfiles()
    }

    fetchUser()
  }, [])

  const fetchProfiles = async () => {
    const { data, error } = await supabase.from('profiles').select('*')
    if (!error) {
      setProfiles(data)
      const onlineUsers = data.filter((p) => p.is_online).length
      setOnlineCount(onlineUsers)
      setLoading(false)
    }
  }

  if (loading) return <div className="p-6 text-lg font-semibold">Memuat data...</div>

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar Atas */}
      <AdminNavbar />

      {/* Konten Bawah */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md px-6 py-8">
          <h2 className="text-2xl font-bold text-orange-600 mb-8">Admin Panel</h2>
          <nav className="flex flex-col space-y-4 text-gray-700 font-medium">
            <Link href="/admin" className="hover:text-orange-500">Dashboard</Link>
            <Link href="/admin/users" className="hover:text-orange-500">Pengguna</Link>
            <Link href="/admin/products" className="hover:text-orange-500">Produk</Link>
            <Link href="/admin/transactions" className="hover:text-orange-500">Pesanan</Link>
            <Link href="/admin/services" className="hover:text-orange-500">Layanan</Link>
          </nav>
        </aside>

        {/* Konten Utama */}
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Admin</h1>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-sm text-gray-500">Total Pengguna</h2>
              <p className="text-2xl font-bold text-orange-600">{profiles.length}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-sm text-gray-500">Pengguna Online</h2>
              <p className="text-2xl font-bold text-green-500">{onlineCount}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-sm text-gray-500">Produk Terdaftar</h2>
              <p className="text-2xl font-bold text-blue-500">-</p>
            </div>
          </div>

          {/* Tabel pengguna */}
          <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-orange-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Nama</th>
                  <th className="px-4 py-2">Alamat</th>
                  <th className="px-4 py-2">Nomor HP</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((profile) => (
                  <tr key={profile.id} className="border-t">
                    <td className="px-4 py-2">{profile.full_name}</td>
                    <td className="px-4 py-2">{profile.address || '-'}</td>
                    <td className="px-4 py-2">{profile.phone || '-'}</td>
                    <td className="px-4 py-2 capitalize">{profile.role}</td>
                    <td className="px-4 py-2">
                      {profile.is_online ? (
                        <span className="text-green-500 font-medium">🟢 Online</span>
                      ) : (
                        <span className="text-gray-400">⚪️ Offline</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
