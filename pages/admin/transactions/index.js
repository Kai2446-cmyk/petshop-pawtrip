import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../../lib/supabase'

const AdminTransactions = () => {
  const router = useRouter()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (!user || userError) return router.push('/login')

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profileError || profile?.role !== 'admin') {
        alert('Akses hanya untuk admin')
        return router.push('/')
      }

      const { data: txData, error: txError } = await supabase
        .from('transaction')
        .select(`
          id,
          total_price,
          status,
          created_at,
          profiles (full_name),
          transaction_items (name, quantity, price)
        `)
        .order('created_at', { ascending: false })

      if (!txError) setTransactions(txData)
      setLoading(false)
    }

    fetchTransactions()
  }, [])

  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from('transaction')
      .update({ status: newStatus })
      .eq('id', id)

    if (!error) {
      const updated = transactions.map(tx =>
        tx.id === id ? { ...tx, status: newStatus } : tx
      )
      setTransactions(updated)
    }
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <button
        onClick={() => router.push('/admin')}
        className="mb-4 inline-flex items-center text-orange-600 hover:text-orange-800 font-medium"
      >
        ← Kembali ke Dashboard
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Kelola Transaksi</h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border">
        <table className="min-w-full text-sm">
          <thead className="bg-orange-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Tanggal</th>
              <th className="px-4 py-2 text-left">Item</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-t text-center">
                <td className="px-4 py-2 text-left">{tx.profiles?.full_name || '-'}</td>
                <td className="px-4 py-2">Rp {Number(tx.total_price).toLocaleString()}</td>
                <td className="px-4 py-2 capitalize">
                  <span className={`px-2 py-1 rounded text-white text-xs font-medium ${
                    tx.status === 'pending' ? 'bg-yellow-500' :
                    tx.status === 'paid' ? 'bg-blue-500' :
                    tx.status === 'selesai' ? 'bg-green-600' :
                    tx.status === 'canceled' ? 'bg-red-500' : 'bg-gray-400'
                  }`}>
                    {tx.status}
                  </span>
                </td>
                <td className="px-4 py-2">{new Date(tx.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-left">
                  <ul className="list-disc list-inside space-y-1">
                    {tx.transaction_items?.map((item, idx) => (
                      <li key={idx}>
                        {item.quantity}x {item.name} @Rp {Number(item.price).toLocaleString()}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-2 flex gap-2 justify-center flex-wrap">
                  {tx.status === 'pending' && (
                    <>
                      <button
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        onClick={() => updateStatus(tx.id, 'paid')}
                      >
                       Terima
                      </button>
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        onClick={() => updateStatus(tx.id, 'canceled')}
                      >
                        Tolak
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminTransactions
