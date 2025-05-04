import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../../lib/supabase';
import { fetchTransactionDetail } from '../../../lib/tripay';

export default function TransactionDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [transaction, setTransaction] = useState(null);
  const [tripayDetail, setTripayDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('transaction')
        .select(`
          *,
          profiles (full_name, email),
          transaction_items (
            *,
            product (name)
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching transaction:', error);
        setLoading(false);
        return;
      }

      setTransaction(data);

      if (data.reference) {
        const tripay = await fetchTransactionDetail(data.reference);
        if (tripay.success) {
          setTripayDetail(tripay.data);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [id]);

  const updateTransactionStatus = async (newStatus) => {
    const { error } = await supabase
      .from('transaction')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      console.error('Error updating transaction status:', error);
    } else {
      setTransaction({ ...transaction, status: newStatus });
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (!transaction) return <p className="p-4">Transaksi tidak ditemukan.</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Detail Transaksi</h1>

      <div className="mb-4">
        <p><strong>ID Transaksi:</strong> {transaction.id}</p>
        <p><strong>Status:</strong> {transaction.status}</p>
        <p><strong>Total Harga:</strong> Rp {transaction.total_price.toLocaleString()}</p>
        <p><strong>Waktu:</strong> {new Date(transaction.created_at).toLocaleString()}</p>
        {transaction.reference && (
          <p><strong>Reference:</strong> {transaction.reference}</p>
        )}
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Informasi Pelanggan</h2>
        <p><strong>Nama:</strong> {transaction.profiles?.full_name}</p>
        <p><strong>Email:</strong> {transaction.profiles?.email}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Produk</h2>
        <ul className="list-disc list-inside">
          {transaction.transaction_items?.map((item, index) => (
            <li key={index}>
              {item.product?.name} - {item.quantity} x Rp {item.price.toLocaleString()}
            </li>
          ))}
        </ul>
      </div>

      {tripayDetail && (
        <div className="mb-4 border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">Info Pembayaran (Tripay)</h2>
          <p><strong>Metode:</strong> {tripayDetail.payment_method}</p>
          <p><strong>Provider:</strong> {tripayDetail.payment_name}</p>
          <p><strong>Merchant Ref:</strong> {tripayDetail.merchant_ref}</p>
          <p><strong>Status:</strong> {tripayDetail.status}</p>
          <p><strong>Amount Paid:</strong> Rp {tripayDetail.amount_received?.toLocaleString()}</p>
          {tripayDetail.pay_code && (
            <p><strong>Kode Bayar:</strong> {tripayDetail.pay_code}</p>
          )}
          {tripayDetail.payment_url && (
            <p>
              <a href={tripayDetail.payment_url} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                Lihat Halaman Pembayaran
              </a>
            </p>
          )}
        </div>
      )}

      <div className="mt-6 flex gap-4">
        {transaction.status === 'pending' && (
          <button
            onClick={() => updateTransactionStatus('canceled')}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Batalkan Transaksi
          </button>
        )}

        {transaction.status === 'paid' && (
          <button
            onClick={() => updateTransactionStatus('completed')}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Konfirmasi Pembayaran
          </button>
        )}
      </div>
    </div>
  );
}
