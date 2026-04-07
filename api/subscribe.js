export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, first_name } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  try {
    const payload = {
      email,
      reactivate_existing: false,
      send_welcome_email: true,
    };

    if (first_name) {
      payload.custom_fields = [
        { name: 'First Name', value: first_name }
      ];
    }

    const response = await fetch(
      'https://api.beehiiv.com/v2/publications/pub_a6c195fa-9262-4e2c-b541-32bd3808eb24/subscriptions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (data.data && data.data.id) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ error: 'Subscription failed' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}
