const XPAY_API_KEY = process.env.XPAY_API_KEY || 'cpk_live_ex84lopcp2xexagmazz6za11';
const XPAY_BASE_URL = 'https://api.xpaybrasil.com/v1';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-KEY, Idempotency-Key');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    if (req.method === 'POST') {
      const bodyObj = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-API-KEY': XPAY_API_KEY
      };
      if (req.headers['idempotency-key']) {
        headers['Idempotency-Key'] = req.headers['idempotency-key'];
      }

      const response = await fetch(`${XPAY_BASE_URL}/charge/pix`, {
        method: 'POST',
        headers,
        body: JSON.stringify(bodyObj)
      });

      const data = await response.json().catch(() => ({}));
      return res.status(response.status).json(data);
    }

    if (req.method === 'GET') {
      const id = req.query.id;
      if (!id) {
        return res.status(400).json({ message: 'Missing charge id' });
      }

      const response = await fetch(`${XPAY_BASE_URL}/charge/${encodeURIComponent(id)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-API-KEY': XPAY_API_KEY
        }
      });

      const data = await response.json().catch(() => ({}));
      return res.status(response.status).json(data);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (err) {
    console.error('XPay proxy error:', err);
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
};
