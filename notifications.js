const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-client');

// Initialisation sécurisée de Supabase à partir des clés configurées sur Render
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// 🆕 ROUTE MAGIQUE : Intercepte les signaux de l'application et réveille le téléphone ciblé
router.post('/send-push', async (req, res) => {
  const { receiverId, message } = req.body;

  try {
    // 1. Recherche du jeton Expo Push Token de l'utilisateur dans Supabase
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('expo_push_token')
      .eq('id', receiverId)
      .single();

    if (error || !profile || !profile.expo_push_token) {
      return res.status(404).json({ success: false, message: "Aucun jeton d'alerte trouvé pour cet utilisateur." });
    }

    // 2. Envoi direct de l'impulsion vers les serveurs mondiaux d'Expo Notifications
    const response = await fetch('https://exp.host', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: profile.expo_push_token,
        sound: 'default',
        title: '💬 Nouveau message sur Jula',
        body: message,
        priority: 'high',
        data: { screen: 'chat' }
      }),
    });

    const result = await response.json();
    console.log("Notification push propulsée au téléphone :", result);
    return res.status(200).json({ success: true, result });

  } catch (err) {
    console.error("Erreur système d'alerte push :", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;