// pages/api/tripay-callback.js

import supabase from '../../lib/supabase'; // lokal, tanpa @
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const callbackSignature = req.headers['x-callback-signature'];
  const rawBody = JSON.stringify(req.body);

  // Verifikasi signature dari Tripay
  const expectedSignature = crypto
    .createHmac('sha256', process.env.TRIPAY_PRIVATE_KEY)
    .update(rawBody)
    .digest('hex');

  if (callbackSignature !== expectedSignature) {
    return res.status(403).json({ message: 'Invalid signature' });
  }

  const { reference, status } = req.body;

  if (!reference || !status) {
    return res.status(400).json({ message: 'Missing reference or status' });
  }

  // Update status transaksi di tabel 'transaction', cocokkan dengan kolom id
  const { error } = await supabase
    .from('transaction') // ← Sesuai nama tabel kamu
    .update({ status })
    .eq('id', reference); // ← Kolom id sebagai reference

  if (error) {
    console.error('Supabase update error:', error);
    return res.status(500).json({ message: 'Failed to update transaction' });
  }

  return res.status(200).json({ message: 'Success' });
}
