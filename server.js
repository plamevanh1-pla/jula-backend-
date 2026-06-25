import { createClient } from '@supabase/supabase-js';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import ws from 'ws'; // 🆕 Correction pour Node.js 20 : Support des Websockets

// Chargement des variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration de CORS pour autoriser votre application Expo Go à communiquer
app.use(cors());
app.use(express.json());

 // Initialisation du client Supabase côté Serveur avec sécurité de secours
const supabaseUrl = process.env.SUPABASE_URL || 'https://bgfmnjvhlonrfpfsxefe.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_W_q0i6GH_dKXr2QFc3xu_Q_EUZzpDMK';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("⚠️ Erreur : Les clés SUPABASE_URL ou SUPABASE_ANON_KEY sont manquantes dans le fichier .env");
  process.exit(1);
}

// Initialisation sécurisée du client Supabase côté Serveur avec le transport Websocket
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
  realtime: { transport: ws } // 🆕 Injection du transport ws pour éviter le crash
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
    // Simulation d'une attente réseau avec la passerelle Mobile Money (Wave / Orange)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mise à jour automatique du statut en arrière-plan sur Supabase
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

// Tout en bas de server.js, remplacez app.listen par :
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n=================================================`);
  console.log(`🚀 Serveur Jula lancé sur le réseau local !`);
  console.log(`📡 URL réseau : http://192.168.100.10:${PORT}`);
  console.log(`=================================================\n`);
});