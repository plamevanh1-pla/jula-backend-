import cors from 'cors';
import express from 'express';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const app = express();

// 1. Middlewares globaux indispensables pour Jula
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Route de test racine (http://localhost:5000)
app.get('/', (req, res) => {
  res.json({ 
    status: "success",
    message: "L'API modulaire de Jula-Backend (ES Modules) est connectée et opérationnelle !",
    version: "1.0.0"
  });
});

// 3. Chargeur intelligent de routes (gère les formats CommonJS et ES Modules)
const safeLoadRoute = (routePath) => {
  try {
    const loadedModule = require(routePath);
    
    // Si le fichier utilise "export default", on extrait le routeur contenu dedans
    if (loadedModule && loadedModule.default) {
      return loadedModule.default;
    }
    
    // Sinon, on renvoie le module brut (CommonJS)
    return loadedModule;
  } catch (error) {
    // Si le fichier est vide, introuvable ou plante, on génère une route temporaire pour éviter le crash général
    const router = express.Router();
    router.all('*', (req, res) => res.status(501).json({ error: `La route ${routePath} est en cours de configuration.` }));
    return router;
  }
};

// Liaison de toutes vos routes
app.use('/api/auth', safeLoadRoute('./routes/auth.js'));
app.use('/api/products', safeLoadRoute('./routes/products.js'));
app.use('/api/orders', safeLoadRoute('./routes/orders.js'));
app.use('/api/payment', safeLoadRoute('./routes/payment.js'));
app.use('/api/admin', safeLoadRoute('./routes/admin.js'));
app.use('/api/seller', safeLoadRoute('./routes/seller.js'));
app.use('/api/eta', safeLoadRoute('./routes/eta.js'));
app.use('/api/webhook', safeLoadRoute('./routes/webhook.js'));

// 4. Gestion des routes inexistantes (Erreur 404)
app.use((req, res) => {
  res.status(404).json({ error: "Route introuvable sur le serveur Jula." });
});

// 5. Middleware global de gestion des erreurs système
app.use((err, req, res, next) => {
  console.error("❌ Erreur serveur interne :", err.stack);
  res.status(500).json({ error: "Une erreur interne est survenue sur le backend." });
});

export default app;