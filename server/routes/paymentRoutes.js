import express from "express";

const router = express.Router();

/* =========================================================
   PAYPAL CONFIG ROUTE
   - Sends PayPal Client ID to frontend
   - Used to initialize PayPal SDK
========================================================= */
router.get("/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});

export default router;