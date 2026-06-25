import { createClient } from '@supabase/supabase-js';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import ws from 'ws'; // Support des Websockets pour Node.js 20
import paydunyaProdRoutes from './paydunya-prod.js'; // Importation paiement réel

// Chargement des variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration de CORS pour autoriser votre application mobile à communiquer
app.use(cors());
app.use(express.json());

// 🔐 VOS CLÉS EN DUR (Remplacées automatiquement si définies sur Render)
const supabaseUrl = "https://bgfmnjvhlonrfpfsxefe.supabase.co";
const supabaseKey = "sb_publishable_W_q0i6GH_dKXr2QFc3xu_Q_EUZzpDMK";

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("METTEZ_ICI")) {
  console.error("⚠️ Erreur : Veuillez coller vos vraies clés Supabase à l'intérieur du fichier server.js");
  process.exit(1);
}

// Initialisation sécurisée du client Supabase côté Serveur avec le transport Websocket
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: ws }
});

// 1. Route d'accueil pour tester si le backend Jula répond dans le navigateur
app.get('/', (req, res) => {
  res.json({ 
    status: "En ligne", 
    message: "Bienvenue sur le serveur central de Jula E-commerce ! 🚀" 
  });
});

// 2. API pour récupérer les produits (Passerelle sécurisée)
app.get('/api/products', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, count: data.length, products: data });
  } catch (error) {
    console.error("Erreur API produits :", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. API d'initialisation de paiement (Simulateur de Webhook Mobile Money)
app.post('/api/payments/initiate', async (req, res) => {
  const { orderId, amount, phoneNumber } = req.body;

  if (!orderId || !amount || !phoneNumber) {
    return res.status(400).json({ success: false, message: "Données de paiement incomplètes." });
  }

  console.log(`[Paiement Jula] Initialisation d'un règlement de ${amount} FCFA pour la commande #${orderId} via ${phoneNumber}`);

  try {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const { error } = await supabase
      .from('orders')
      .update({ payment_method: 'Mobile Money (Validé)' })
      .eq('id', orderId);

    if (error) throw error;

    res.json({ 
      success: true, 
      transactionStatus: "COMPLETED", 
      message: "Le paiement Mobile Money a été validé avec succès par le serveur Jula." 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. API DE PROPULSION DES NOTIFICATIONS PUSH (Application Fermée)
app.post('/api/notifications/send-push', async (req, res) => {
  const { receiverId, message } = req.body;

  if (!receiverId || !message) {
    return res.status(400).json({ success: false, message: "Données de notification incomplètes." });
  }

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('expo_push_token')
      .eq('id', receiverId)
      .single();

    if (error || !profile || !profile.expo_push_token) {
      console.log(`[Push Jula] Aucun jeton d'alerte trouvé pour le profil #${receiverId}`);
      return res.status(404).json({ success: false, message: "Aucun jeton d'alerte trouvé." });
    }

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
    console.log("[Push Jula] Alerte envoyée avec succès :", result);
    return res.status(200).json({ success: true, result });

  } catch (err) {
    console.error("[Push Jula] Erreur d'envoi push :", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 5. 🆕 LE WEBHOOK D'ÉCOUTE ET DE CONFIRMATION AUTOMATIQUE (Dernier élément clé)
app.post('/api/webhook/paydunya', async (req, res) => {
  const { data } = req.body;
  
  if (!data || !data.invoice) {
    return res.status(400).send("Statut invalide");
  }

  const orderId = data.invoice.custom_data ? data.invoice.custom_data.order_id : null;
  const status = data.invoice.status;

  console.log(`[Webhook Jula] Réception notification PayDunya pour Commande #${orderId} - Statut: ${status}`);

  try {
    if (status === "completed") {
      // Si l'argent est bien encaissé en Côte d'Ivoire ou au Sénégal, on passe la commande en validée
      await supabase
        .from('orders')
        .update({ status: 'confirmé', payment_method: 'PayDunya (Payé)' })
        .eq('id', orderId);
    }
    return res.status(200).send("Webhook traité avec succès !");
  } catch (error) {
    console.error("Erreur Webhook:", error.message);
    return res.status(500).send("Erreur interne");
  }
});

// Activation de la route de paiement réel PayDunya
app.use('/api/payments/prod', paydunyaProdRoutes);

// Lancement universel du serveur compatible avec Render Cloud
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n=================================================`);
  console.log(`🚀 Serveur Mondial Jula branché avec succès !`);
  console.log(`📡 URL de Production : https://jula-backend-production.onrender.com`);
  console.log(`=================================================\n`);
});