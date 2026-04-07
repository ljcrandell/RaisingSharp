export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  try {
    const response = await fetch(
      'https://api.beehiiv.com/v2/publications/pub_a6c195fa-9262-4e2c-b541-32bd3808eb24/subscriptions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer a6c195fa-9262-4e2c-b541-32bd3808eb24',
        },
        body: JSON.stringify({
          email,
          reactivate_existing: false,
          send_welcome_email: true,
        }),
      }
    );

    const data = await response.json();
    console.log('Beehiiv response:', JSON.stringify(data));

    if (data.data && data.data.id) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ error: 'Subscription failed', detail: data });
    }
  } catch (err) {
    console.error('Subscribe error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
