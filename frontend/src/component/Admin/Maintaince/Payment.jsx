import React, { useCallback } from "react";
import axios from "axios";

const PAYMENT_API = "http://localhost:5100/api/payment";

// Key is loaded from Vite env (set in frontend/.env as VITE_RAZORPAY_KEY_ID)
// Fallback: fetch from backend /api/payment/get-key
let _cachedKey = import.meta.env.VITE_RAZORPAY_KEY_ID || "";

const getRazorpayKey = async () => {
  if (_cachedKey) return _cachedKey;
  try {
    const { data } = await axios.get(`${PAYMENT_API}/get-key`);
    if (data.success && data.key) {
      _cachedKey = data.key;
      return _cachedKey;
    }
  } catch (e) {
    console.error("Could not fetch Razorpay key from backend:", e);
  }
  return null;
};

/**
 * RazorpayPayment – opens Razorpay checkout directly (UPI · Card · Scanner · Wallet built-in).
 *
 * Props:
 *  bill       – the maintenance bill object (must have _id, amount, billName)
 *  onSuccess  – callback(updatedBill) called after successful payment + verification
 *  onFailure  – optional callback(error) called on failure
 *  children   – render-prop: ({ openRazorpay, loading }) => JSX
 *               If omitted, a default "Pay Now" button is rendered.
 */
export default function RazorpayPayment({ bill, onSuccess, onFailure, children }) {
  const [loading, setLoading] = React.useState(false);

  /** Dynamically load the Razorpay checkout script */
  const loadScript = () =>
    new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) return resolve(true);
      const script = document.createElement("script");
      script.id  = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload  = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const openRazorpay = useCallback(async () => {
    if (!bill) return;
    setLoading(true);

    try {
      // 1. Load Razorpay SDK
      const scriptLoaded = await loadScript();
      if (!scriptLoaded) {
        alert("Failed to load Razorpay SDK. Check your internet connection.");
        setLoading(false);
        return;
      }

      // 2. Get the public Razorpay key
      const razorpayKey = await getRazorpayKey();
      if (!razorpayKey) {
        alert("Razorpay key not configured. Please contact support.");
        setLoading(false);
        return;
      }

      // 3. Create order on backend
      const { data } = await axios.post(`${PAYMENT_API}/create-order`, {
        billId: bill._id,
        amount: bill.amount,
      });

      if (!data.success) {
        alert(data.message || "Failed to create payment order.");
        setLoading(false);
        return;
      }

      const order = data.order;

      // 4. Open Razorpay checkout
      //    Explicitly enable UPI (includes UPI QR scanner), Card, Netbanking, Wallet.
      const options = {
        key         : razorpayKey,
        amount      : order.amount,   // in paise (set by backend)
        currency    : order.currency,
        name        : "E-Society",
        description : bill.billName,
        order_id    : order.id,
        theme       : { color: "#4f46e5" },

        // ── Explicitly enable all payment methods including UPI ──
        method: {
          upi        : true,   // UPI + UPI QR Scanner tab
          card       : true,   // Debit / Credit Cards
          netbanking : true,   // Netbanking
          wallet     : true,   // Wallets (Paytm, PhonePe, etc.)
          paylater   : true,   // Pay Later / EMI
        },

        // ── Make UPI the default/preferred method on open ──
        config: {
          display: {
            blocks: {
              utib: {             // UPI block label
                name  : "Pay via UPI or Scanner",
                instruments: [
                  { method: "upi" }
                ],
              },
            },
            sequence  : ["block.utib", "card", "netbanking", "wallet", "paylater"],
            preferences: { show_default_blocks: true },
          },
        },

        handler: async (response) => {

          try {
            // 5. Verify payment on backend
            const verifyRes = await axios.post(`${PAYMENT_API}/verify`, {
              razorpay_order_id  : response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature : response.razorpay_signature,
              billId             : bill._id,
              paymentMethod      : "Razorpay",
            });

            if (verifyRes.data.success) {
              onSuccess && onSuccess(verifyRes.data.data);
            } else {
              alert("Payment verification failed. Please contact support.");
              onFailure && onFailure(new Error(verifyRes.data.message));
            }
          } catch (err) {
            console.error("Verify error:", err);
            alert("Payment verification error. Please contact support.");
            onFailure && onFailure(err);
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        console.error("Razorpay payment failed:", response.error);
        alert(`Payment failed: ${response.error.description}`);
        onFailure && onFailure(response.error);
        setLoading(false);
      });
      rzp.open();

    } catch (err) {
      console.error("Razorpay error:", err);
      const msg = err?.response?.data?.message || err.message || "Something went wrong.";
      alert(`Razorpay Error: ${msg}`);
      onFailure && onFailure(err);
      setLoading(false);
    }
  }, [bill, onSuccess, onFailure]);

  // Render-prop pattern – let parent control the trigger button
  if (typeof children === "function") {
    return children({ openRazorpay, loading });
  }

  // Default button if no children provided
  return (
    <button
      onClick={openRazorpay}
      disabled={loading}
      style={{
        background   : loading ? "#818cf8" : "#4f46e5",
        color        : "#fff",
        border       : "none",
        borderRadius : "12px",
        padding      : "12px 28px",
        fontWeight   : 800,
        fontSize     : "14px",
        cursor       : loading ? "not-allowed" : "pointer",
        display      : "flex",
        alignItems   : "center",
        gap          : "8px",
        transition   : "background 0.2s",
      }}
    >
      {loading ? "Opening Razorpay…" : `Pay ₹${bill?.amount?.toLocaleString()} via Razorpay`}
    </button>
  );
}
