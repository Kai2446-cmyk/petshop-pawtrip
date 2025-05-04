import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({
    id: null,
    name: '',
    price: '',
    stock: '',
    category: '',
    image: null,
  })
  const [isEditMode, setIsEditMode] = useState(false)
  const [filter, setFilter] = useState('Semua')
  const [loading, setLoading] = useState(false)

  const fetchProducts = async () => {
    setLoading(true)
    let query = supabase.from('products').select('*')
    if (filter !== 'Semua') {
      query = query.eq('category', filter)
    }
    const { data, error } = await query
    if (!error) setProducts(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [filter])

  const resetForm = () => {
    setForm({
      id: null,
      name: '',
      price: '',
      stock: '',
      category: '',
      image: null,
    })
    setIsEditMode(false)
  }

  const handleImageUpload = async (file) => {
    const fileName = `${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('product-images').upload(fileName, file)
    if (error) throw error
    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName)
    return urlData.publicUrl
  }

  const handleSubmit = async () => {
    try {
      if (!form.name || !form.price || !form.stock || !form.category) {
        alert('Mohon lengkapi semua field.')
        return
      }

      let imageUrl = null
      if (form.image) {
        imageUrl = await handleImageUpload(form.image)
      }

      if (isEditMode) {
        const { error } = await supabase
          .from('products')
          .update({
            name: form.name,
            price: Number(form.price),
            stock: Number(form.stock),
            category: form.category,
            ...(imageUrl && { image_url: imageUrl }),
          })
          .eq('id', form.id)

        if (!error) {
          fetchProducts()
          resetForm()
          alert('Produk berhasil diperbarui.')
        }
      } else {
        const { error } = await supabase.from('products').insert({
          name: form.name,
          price: Number(form.price),
          stock: Number(form.stock),
          category: form.category,
          image_url: imageUrl,
        })
        if (!error) {
          fetchProducts()
          resetForm()
          alert('Produk berhasil ditambahkan.')
        }
      }
    } catch (err) {
      console.error(err)
      alert('Gagal menyimpan produk.')
    }
  }

  const handleEdit = (product) => {
    setForm({
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category,
      image: null,
    })
    setIsEditMode(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    const confirmDelete = confirm('Yakin ingin menghapus produk ini?')
    if (!confirmDelete) return

    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) {
      fetchProducts()
      alert('Produk berhasil dihapus.')
    } else {
      alert('Gagal menghapus produk.')
    }
  }

  return (
    <div className="p-6">
      <button
        onClick={() => window.history.back()}
        className="text-orange-600 mb-2"
      >
        ← Kembali ke Dashboard
      </button>

      <h1 className="text-2xl font-bold mb-4">📦 Kelola Produk</h1>

      <div className="mb-4 flex items-center gap-2">
        <label>Filter:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="Semua">Semua</option>
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
        </select>
      </div>

      <div className="mb-6 border rounded p-4 bg-white">
        <h2 className="text-lg font-semibold mb-2">
          {isEditMode ? '📝 Edit Produk' : '➕ Tambah Produk'}
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Nama Produk"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border px-2 py-1 rounded"
          />
          <input
            type="number"
            placeholder="Harga"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="border px-2 py-1 rounded"
          />
          <input
            type="number"
            placeholder="Stok"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="border px-2 py-1 rounded"
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="border px-2 py-1 rounded"
          >
            <option value="">Pilih Kategori</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
          </select>
        </div>

        <input
          type="file"
          onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
        />
        {form.image && (
          <img
            src={URL.createObjectURL(form.image)}
            alt="Preview"
            className="h-20 mt-2 rounded"
          />
        )}

        <div className="mt-4 flex gap-2">
          <button
            onClick={handleSubmit}
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
          >
            {isEditMode ? 'Simpan Perubahan' : 'Tambah'}
          </button>
          {isEditMode && (
            <button
              onClick={resetForm}
              className="text-gray-600 underline"
            >
              Batal Edit
            </button>
          )}
        </div>
      </div>

      <table className="w-full table-auto border rounded shadow-sm">
        <thead className="bg-orange-100">
          <tr>
            <th className="p-2 border">Gambar</th>
            <th className="p-2 border">Nama</th>
            <th className="p-2 border">Harga</th>
            <th className="p-2 border">Stok</th>
            <th className="p-2 border">Kategori</th>
            <th className="p-2 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center p-4">Memuat data produk...</td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id} className="text-center">
                <td className="p-2 border">
                  {product.image_url && (
                    <img src={product.image_url} alt={product.name} className="h-16 mx-auto" />
                  )}
                </td>
                <td className="p-2 border">{product.name}</td>
                <td className="p-2 border">Rp {Number(product.price).toLocaleString()}</td>
                <td className="p-2 border">{product.stock}</td>
                <td className="p-2 border">{product.category}</td>
                <td className="p-2 border flex justify-center gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:underline"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default AdminProducts