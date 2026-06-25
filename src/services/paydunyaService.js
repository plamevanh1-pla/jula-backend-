  export const createPaydunyaInvoice = async ({ amount, customerName, customerEmail, orderId, }) => { try { console.log("PayDunya invoice request:", { amount, customerName, customerEmail, orderId, });
// Simulation paiement pour développement Expo Go
return {
  success: true,
  token: "TEST_TOKEN_" + Date.now(),
  url: "https://paydunya.com/test-payment",
  amount,
  orderId,
};
} catch (error) { console.log("PayDunya error:", error);
return {
  success: false,
  message: error.message,
};
} }; 