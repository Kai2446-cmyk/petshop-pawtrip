import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../../lib/supabase'

const AdminServices = () => {
  const router = useRouter()
  const [services, setServices] = useState([])
  const [form, setForm] = useState({
    id: null,
    name: '',
    description: '',
    price: '',
    image_url: '',
  })
  const [isEditMode, setIsEditMode] = useState(false)
  const fileInputRef = useRef(null)

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('id', { ascending: true })
    if (!error) setServices(data)
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const resetForm = () => {
    setForm({ id: null, name: '', description: '', price: '', image_url: '' })
    fileInputRef.current.value = null
    setIsEditMode(false)
  }

  const uploadImage = async (file) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    const { data, error } = await supabase.storage
      .from('service-images') // ✅ sesuai bucket kamu
      .upload(filePath, file)

    if (error) {
      console.error('Upload gagal:', error)
      return null
    }

    const { data: publicUrlData } = supabase.storage
      .from('service-images') // ✅ sesuai bucket kamu
      .getPublicUrl(filePath)

    return publicUrlData?.publicUrl || null
  }

  const handleSubmit = async () => {
    if (!form.name || !form.description || !form.price) {
      alert('Lengkapi semua data layanan!')
      return
    }

    let imageUrl = form.image_url

    if (fileInputRef.current?.files[0]) {
      const file = fileInputRef.current.files[0]
      const uploadedUrl = await uploadImage(file)
      if (uploadedUrl) imageUrl = uploadedUrl
    }

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      image_url: imageUrl,
    }

    if (isEditMode) {
      const { error } = await supabase
        .from('services')
        .update(payload)
        .eq('id', form.id)

      if (!error) {
        fetchServices()
        resetForm()
      } else {
        console.error('Gagal update:', error)
        alert('Gagal update layanan.')
      }
    } else {
      const { error } = await supabase.from('services').insert(payload) // ✅ Fix di sini

      if (!error) {
        fetchServices()
        resetForm()
      } else {
        console.error('Gagal insert:', error)
        alert('Gagal menambahkan layanan.')
      }
    }
  }

  const handleEdit = (service) => {
    setForm({
      id: service.id,
      name: service.name,
      description: service.description,
      price: service.price,
      image_url: service.image_url || '',
    })
    setIsEditMode(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    const confirm = window.confirm('Yakin ingin menghapus layanan ini?')
    if (!confirm) return

    const { error } = await supabase.from('services').delete().eq('id', id)
    if (!error) fetchServices()
    else alert('Gagal menghapus layanan.')
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <button
        onClick={() => router.push('/admin')}
        className="mb-4 inline-flex items-center text-orange-600 hover:text-orange-800 font-medium"
      >
        ← Kembali ke Dashboard
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">💼 Kelola Layanan</h1>

      {/* Form Tambah/Edit */}
      <div className="bg-white p-4 rounded shadow mb-6 border">
        <h2 className="text-lg font-semibold mb-3">
          {isEditMode ? '📝 Edit Layanan' : '➕ Tambah Layanan'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Nama Layanan"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Deskripsi"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border px-3 py-2 rounded"
          />
          <input
            type="number"
            placeholder="Harga"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="border px-3 py-2 rounded"
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="border px-3 py-2 rounded"
          />
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleSubmit}
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
          >
            {isEditMode ? 'Simpan Perubahan' : 'Tambah'}
          </button>
          {isEditMode && (
            <button onClick={resetForm} className="text-gray-600 underline">
              Batal Edit
            </button>
          )}
        </div>
      </div>

      {/* Tabel Layanan */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border">
        <table className="min-w-full text-sm">
          <thead className="bg-orange-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Layanan</th>
              <th className="px-4 py-2 text-left">Deskripsi</th>
              <th className="px-4 py-2 text-right">Harga</th>
              <th className="px-4 py-2 text-left">Gambar</th>
              <th className="px-4 py-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {services.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{item.description}</td>
                <td className="px-4 py-2 text-right">
                  Rp {Number(item.price).toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-4 py-2 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:underline"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminServices
