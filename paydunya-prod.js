import express from 'express';
const router = express.Router();

router.post('/initiate-real-payment', async (req, res) => {
  const { orderId, amount, phoneNumber, country } = req.body;

  const masterKey = process.env.PAYDUNYA_MASTER_KEY;
  const publicKey = process.env.PAYDUNYA_PUBLIC_KEY;
  const privateKey = process.env.PAYDUNYA_PRIVATE_KEY;
  const token = process.env.PAYDUNYA_TOKEN;

  if (!masterKey || !publicKey || !token) {
    return res.status(500).json({ 
      success: false, 
      message: "Configuration de production PayDunya manquante." 
    });
  }

  try {
    const paydunyaPayload = {
      invoice: { total_amount: amount, description: `Achat Jula #${orderId}` },
      store: { name: "Jula", tagline: "UEMOA Market", phone: "+22507000000", postal_address: "Abidjan" }
    };

    const response = await fetch('https://paydunya.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'PAYDUNYA-MASTER-KEY': masterKey,
        'PAYDUNYA-PUBLIC-KEY': publicKey,
        'PAYDUNYA-PRIVATE-KEY': privateKey,
        'PAYDUNYA-TOKEN': token
      },
      body: JSON.stringify(paydunyaPayload)
    });

    const result = await response.json();

    if (result.response_code === "00") {
      return res.status(200).json({ 
        success: true, 
        checkoutUrl: result.response_text, 
        token: result.token 
      });
    } else {
      return res.status(400).json({ success: false, message: result.response_text });
    }

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;