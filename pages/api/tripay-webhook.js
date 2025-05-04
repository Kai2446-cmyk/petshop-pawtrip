// pages/api/tripay-webhook.js

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Disable Next.js body parser to get raw request body
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to get raw body from request stream
const getRawBody = (req) => {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      resolve(data);
    });
    req.on('error', err => {
      reject(err);
    });
  });
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const rawBody = await getRawBody(req);
    const signature = req.headers['x-callback-signature'];

    const expectedSignature = crypto
      .createHmac('sha256', process.env.TRIPAY_PRIVATE_KEY)
      .update(rawBody)
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(403).json({ message: 'Invalid signature' });
    }

    const payload = JSON.parse(rawBody);
    const { reference, status } = payload;

    const { error } = await supabase
      .from('transactions')
      .update({ status })
      .eq('reference', reference);

    if (error) {
      console.error('Error updating transaction status:', error);
      return res.status(500).json({ message: 'Failed to update status' });
    }

    return res.status(200).json({ message: 'OK' });
  } catch (err) {
    console.error('Webhook handler error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}
