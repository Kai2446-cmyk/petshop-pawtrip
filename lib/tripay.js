// lib/tripay.js

const TRIPAY_API_KEY = process.env.NEXT_PUBLIC_TRIPAY_API_KEY;
const TRIPAY_MERCHANT_CODE = process.env.NEXT_PUBLIC_TRIPAY_MERCHANT_CODE;
const TRIPAY_PRIVATE_KEY = process.env.NEXT_PUBLIC_TRIPAY_PRIVATE_KEY;
const TRIPAY_BASE_URL = 'https://tripay.co.id/api-sandbox';

/**
 * Membuat pembayaran Tripay (mengirim request ke endpoint transaksi)
 */
export async function createTripayTransaction(payload) {
  const response = await fetch(`${TRIPAY_BASE_URL}/transaction/create`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TRIPAY_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  return data;
}

/**
 * Mendapatkan detail transaksi berdasarkan reference
 */
export async function getTripayTransactionDetail(reference) {
  const response = await fetch(`${TRIPAY_BASE_URL}/transaction/detail?reference=${reference}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${TRIPAY_API_KEY}`,
    },
  });

  const data = await response.json();
  return data;
}

// Alias ekspor agar bisa digunakan dengan nama fetchTransactionDetail
export { getTripayTransactionDetail as fetchTransactionDetail };
