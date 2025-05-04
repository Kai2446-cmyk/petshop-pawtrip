export default function handler(req, res) {
    const ip = 
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      'IP tidak diketahui';
  
    res.status(200).json({ ip });
  }
  