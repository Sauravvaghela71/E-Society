import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import {
  X, CreditCard, Smartphone, QrCode, Loader2,
  CheckCircle2, IndianRupee, ShieldCheck, Lock, ChevronRight
} from "lucide-react";

const PAYMENT_API = "http://localhost:5100/api/payment";
const MAINTENANCE_API = "http://localhost:5100/api/maintenance";

/* ── Razorpay key helper ── */
let _cachedKey = import.meta.env.VITE_RAZORPAY_KEY_ID || "";
const getRazorpayKey = async () => {
  if (_cachedKey) return _cachedKey;
  try {
    const { data } = await axios.get(`${PAYMENT_API}/get-key`);
    if (data.success && data.key) { _cachedKey = data.key; return _cachedKey; }
  } catch (e) { console.error("Could not fetch Razorpay key:", e); }
  return null;
};

/* ── QR Code SVG generator (pure, no lib needed) ── */
// We use a UPI deeplink URL + a QR service
const UPI_ID  = "6354643123@rapl";
const UPI_NAME = "E-Society";

function buildUpiUrl(amount, billName) {
  return `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(billName)}`;
}
function buildQrImgUrl(amount, billName) {
  const upiUrl = buildUpiUrl(amount, billName);
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;
}

/* ─────────────────────────────────────────────────────────────── */
/*  Main export: RazorpayPayment (same API as before)             */
/* ─────────────────────────────────────────────────────────────── */
export default function RazorpayPayment({ bill, onSuccess, onFailure, children }) {
  const [open, setOpen]       = useState(false);
  const [method, setMethod]   = useState(null); // "razorpay" | "upi" | "card"
  const [busy, setBusy]       = useState(false);
  const [success, setSuccess] = useState(false);
  const [upiRef, setUpiRef]   = useState("");
  const [card, setCard]       = useState({ name: "", number: "", expiry: "", cvv: "" });
  const [cardErr, setCardErr] = useState({});
  const modalRef = useRef(null);

  /* Expose openRazorpay for render-prop children */
  const openModal = () => { setOpen(true); setMethod(null); setSuccess(false); setBusy(false); };
  const closeModal = () => {
    if (busy) return;
    setOpen(false); setMethod(null); setSuccess(false);
    setCard({ name: "", number: "", expiry: "", cvv: "" }); setCardErr({});
    setUpiRef("");
  };

  /* Close on backdrop click */
  useEffect(() => {
    const handler = (e) => { if (modalRef.current && !modalRef.current.contains(e.target)) closeModal(); };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, busy]);

  /* ── Razorpay flow ── */
  const handleRazorpay = useCallback(async () => {
    if (!bill) return;
    setBusy(true);
    try {
      // Load SDK
      const scriptLoaded = await new Promise((resolve) => {
        if (document.getElementById("razorpay-sdk")) return resolve(true);
        const s = document.createElement("script");
        s.id = "razorpay-sdk";
        s.src = "https://checkout.razorpay.com/v1/checkout.js";
        s.onload = () => resolve(true); s.onerror = () => resolve(false);
        document.body.appendChild(s);
      });
      if (!scriptLoaded) { alert("Failed to load Razorpay SDK."); setBusy(false); return; }

      const key = await getRazorpayKey();
      if (!key) { alert("Razorpay not configured."); setBusy(false); return; }

      const { data } = await axios.post(`${PAYMENT_API}/create-order`, { billId: bill._id, amount: bill.amount });
      if (!data.success) { alert(data.message || "Failed to create order."); setBusy(false); return; }

      const rzp = new window.Razorpay({
        key,
        amount    : data.order.amount,
        currency  : data.order.currency,
        name      : "E-Society",
        description: bill.billName,
        order_id  : data.order.id,
        theme     : { color: "#4f46e5" },
        method    : { upi: true, card: true, netbanking: true, wallet: true },
        handler: async (resp) => {
          try {
            const verifyRes = await axios.post(`${PAYMENT_API}/verify`, {
              razorpay_order_id  : resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature : resp.razorpay_signature,
              billId: bill._id,
              paymentMethod: "Razorpay",
            });
            if (verifyRes.data.success) {
              setSuccess(true);
              setTimeout(() => { closeModal(); onSuccess && onSuccess(verifyRes.data.data); }, 2000);
            } else {
              alert("Payment verification failed."); onFailure && onFailure(new Error(verifyRes.data.message));
            }
          } catch (err) { alert("Verification error."); onFailure && onFailure(err); }
          finally { setBusy(false); }
        },
        modal: { ondismiss: () => { setMethod(null); setBusy(false); } },
      });
      rzp.on("payment.failed", (r) => {
        alert(`Payment failed: ${r.error.description}`); onFailure && onFailure(r.error); setBusy(false);
      });
      rzp.open();
    } catch (err) {
      alert(err?.response?.data?.message || err.message || "Something went wrong.");
      onFailure && onFailure(err); setBusy(false);
    }
  }, [bill, onSuccess, onFailure]);

  /* ── UPI manual confirm ── */
  const handleUpiConfirm = async () => {
    if (!upiRef.trim() || upiRef.trim().length < 6) {
      alert("Please enter a valid UPI Reference / UTR number (min 6 chars)."); return;
    }
    setBusy(true);
    try {
      const res = await axios.put(`${MAINTENANCE_API}/${bill._id}/pay`, { paymentMethod: `UPI (Ref: ${upiRef.trim()})` });
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => { closeModal(); onSuccess && onSuccess(res.data.data); }, 2000);
      } else { alert(res.data.message || "Payment failed."); }
    } catch (err) { alert(err?.response?.data?.message || "Payment failed."); }
    finally { setBusy(false); }
  };

  /* ── Card validation & submit ── */
  const validateCard = () => {
    const errs = {};
    if (!card.name.trim()) errs.name = "Name is required";
    const raw = card.number.replace(/\s/g, "");
    if (!/^\d{16}$/.test(raw)) errs.number = "Enter valid 16-digit card number";
    if (!/^\d{2}\/\d{2}$/.test(card.expiry)) errs.expiry = "Use MM/YY format";
    if (!/^\d{3,4}$/.test(card.cvv)) errs.cvv = "Invalid CVV";
    setCardErr(errs);
    return Object.keys(errs).length === 0;
  };
  const handleCardPay = async () => {
    if (!validateCard()) return;
    setBusy(true);
    try {
      const res = await axios.put(`${MAINTENANCE_API}/${bill._id}/pay`, { paymentMethod: `Card (${card.number.replace(/\s/g,"").slice(-4)})` });
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => { closeModal(); onSuccess && onSuccess(res.data.data); }, 2000);
      } else { alert(res.data.message || "Payment failed."); }
    } catch (err) { alert(err?.response?.data?.message || "Payment failed."); }
    finally { setBusy(false); }
  };

  const fmtCard = (v) => v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const fmtExpiry = (v) => { const d = v.replace(/\D/g,"").slice(0,4); return d.length >= 3 ? d.slice(0,2)+"/"+d.slice(2) : d; };

  /* ── Render-prop support ── */
  if (typeof children === "function") {
    return (
      <>
        {children({ openRazorpay: openModal, loading: busy && !open })}
        {open && <PaymentModal {...{ bill, method, setMethod, busy, success, upiRef, setUpiRef, card, setCard, cardErr, fmtCard, fmtExpiry, handleRazorpay, handleUpiConfirm, handleCardPay, closeModal, modalRef }} />}
      </>
    );
  }

  /* Default button */
  return (
    <>
      <button
        onClick={openModal}
        disabled={busy}
        style={{ background: busy ? "#818cf8" : "#4f46e5", color: "#fff", border: "none", borderRadius: "12px", padding: "12px 28px", fontWeight: 800, fontSize: "14px", cursor: busy ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "background 0.2s" }}
      >
        {busy ? "Processing…" : `Pay ₹${bill?.amount?.toLocaleString()}`}
      </button>
      {open && <PaymentModal {...{ bill, method, setMethod, busy, success, upiRef, setUpiRef, card, setCard, cardErr, fmtCard, fmtExpiry, handleRazorpay, handleUpiConfirm, handleCardPay, closeModal, modalRef }} />}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  Modal UI                                                       */
/* ─────────────────────────────────────────────────────────────── */
function PaymentModal({ bill, method, setMethod, busy, success, upiRef, setUpiRef, card, setCard, cardErr, fmtCard, fmtExpiry, handleRazorpay, handleUpiConfirm, handleCardPay, closeModal, modalRef }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(15,15,30,0.65)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div ref={modalRef} style={{ background: "#fff", borderRadius: "24px", width: "100%", maxWidth: "460px", overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.3)", fontFamily: "'Inter', sans-serif" }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)", padding: "24px", color: "#fff", position: "relative" }}>
          <button onClick={closeModal} disabled={busy} style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
            <X size={16} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 12, padding: 10 }}>
              <IndianRupee size={22} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 12, opacity: 0.8, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Secure Payment</p>
              <p style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 900 }}>₹{bill?.amount?.toLocaleString()}</p>
            </div>
          </div>
          <p style={{ margin: "12px 0 0", fontSize: 13, opacity: 0.85, fontWeight: 500 }}>{bill?.billName}</p>
        </div>

        {/* Body */}
        <div style={{ padding: "24px" }}>
          {success ? (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <CheckCircle2 size={60} style={{ color: "#22c55e", margin: "0 auto 16px" }} />
              <h3 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 900, color: "#16a34a" }}>Payment Successful!</h3>
              <p style={{ margin: 0, color: "#6b7280", fontSize: 14 }}>Your bill has been marked as paid. Receipt sent to your email.</p>
            </div>
          ) : method === null ? (
            <MethodSelector setMethod={setMethod} handleRazorpay={handleRazorpay} busy={busy} />
          ) : method === "upi" ? (
            <UpiView bill={bill} upiRef={upiRef} setUpiRef={setUpiRef} handleUpiConfirm={handleUpiConfirm} busy={busy} setMethod={setMethod} />
          ) : method === "card" ? (
            <CardView card={card} setCard={setCard} cardErr={cardErr} fmtCard={fmtCard} fmtExpiry={fmtExpiry} handleCardPay={handleCardPay} busy={busy} setMethod={setMethod} />
          ) : null}
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 24px 20px", borderTop: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <ShieldCheck size={14} style={{ color: "#10b981" }} />
          <p style={{ margin: 0, fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>256-bit SSL Encrypted · Secured by E-Society</p>
        </div>
      </div>
    </div>
  );
}

/* ── Method Selector Screen ── */
function MethodSelector({ setMethod, handleRazorpay, busy }) {
  const methods = [
    {
      id: "razorpay",
      icon: <CreditCard size={22} color="#4f46e5" />,
      label: "Pay via Razorpay",
      sub: "UPI · Card · Netbanking · Wallet",
      badge: "Recommended",
      badgeColor: "#ede9fe",
      badgeText: "#6d28d9",
      bg: "#f5f3ff",
      border: "#c4b5fd",
    },
    {
      id: "upi",
      icon: <QrCode size={22} color="#0891b2" />,
      label: "UPI / QR Scanner",
      sub: "PhonePe · GPay · Paytm · BHIM",
      bg: "#ecfeff",
      border: "#a5f3fc",
    },
    {
      id: "card",
      icon: <Smartphone size={22} color="#059669" />,
      label: "Debit / Credit Card",
      sub: "Visa · Mastercard · RuPay",
      bg: "#f0fdf4",
      border: "#86efac",
    },
  ];

  return (
    <div>
      <p style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: "#374151" }}>Select Payment Method</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {methods.map((m) => (
          <button
            key={m.id}
            disabled={busy}
            onClick={() => m.id === "razorpay" ? handleRazorpay() : setMethod(m.id)}
            style={{ background: m.bg, border: `2px solid ${m.border}`, borderRadius: 14, padding: "14px 16px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 14, transition: "transform 0.15s, box-shadow 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
              {m.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontWeight: 800, fontSize: 14, color: "#111827" }}>{m.label}</span>
                {m.badge && <span style={{ fontSize: 10, fontWeight: 700, background: m.badgeColor, color: m.badgeText, padding: "2px 8px", borderRadius: 99, textTransform: "uppercase" }}>{m.badge}</span>}
              </div>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b7280", fontWeight: 500 }}>{m.sub}</p>
            </div>
            <ChevronRight size={18} style={{ color: "#9ca3af" }} />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── UPI + QR View ── */
function UpiView({ bill, upiRef, setUpiRef, handleUpiConfirm, busy, setMethod }) {
  const qrUrl = buildQrImgUrl(bill?.amount, bill?.billName);
  const [copied, setCopied] = useState(false);

  const copyUpi = () => {
    navigator.clipboard.writeText(UPI_ID).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  return (
    <div>
      <button onClick={() => setMethod(null)} style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: 13, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 4 }}>
        ← Back
      </button>
      <div style={{ textAlign: "center" }}>
        <p style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 700, color: "#374151" }}>Scan QR Code to Pay</p>
        <div style={{ display: "inline-block", background: "#fff", border: "3px solid #e0e7ff", borderRadius: 16, padding: 12, marginBottom: 12 }}>
          <img src={qrUrl} alt="UPI QR Code" width={180} height={180} style={{ display: "block", borderRadius: 8 }} />
        </div>
        <div style={{ background: "#f5f3ff", border: "1px solid #c4b5fd", borderRadius: 12, padding: "10px 16px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: "#7c3aed", fontWeight: 700, textTransform: "uppercase" }}>UPI ID</p>
            <p style={{ margin: "2px 0 0", fontSize: 14, fontWeight: 900, color: "#4f46e5", letterSpacing: 0.5 }}>{UPI_ID}</p>
          </div>
          <button onClick={copyUpi} style={{ background: copied ? "#22c55e" : "#4f46e5", color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <p style={{ margin: "0 0 10px", fontSize: 12, color: "#6b7280", fontWeight: 600 }}>After payment, enter UPI Reference / UTR Number</p>
        <input
          value={upiRef}
          onChange={e => setUpiRef(e.target.value)}
          placeholder="e.g. 412345678901"
          style={{ width: "100%", padding: "12px 14px", border: "2px solid #e5e7eb", borderRadius: 12, fontSize: 14, fontWeight: 600, outline: "none", boxSizing: "border-box", marginBottom: 12 }}
          onFocus={e => e.target.style.borderColor = "#4f46e5"}
          onBlur={e => e.target.style.borderColor = "#e5e7eb"}
        />
        <button
          onClick={handleUpiConfirm}
          disabled={busy || !upiRef.trim()}
          style={{ width: "100%", background: (busy || !upiRef.trim()) ? "#c7d2fe" : "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "#fff", border: "none", borderRadius: 12, padding: "14px", fontWeight: 800, fontSize: 15, cursor: (busy || !upiRef.trim()) ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          {busy ? <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Confirming…</> : <><Lock size={16} /> Confirm Payment</>}
        </button>
      </div>
    </div>
  );
}

/* ── Card View ── */
function CardView({ card, setCard, cardErr, fmtCard, fmtExpiry, handleCardPay, busy, setMethod }) {
  const field = (label, key, placeholder, type = "text", extra = {}) => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={card[key]}
        onChange={e => {
          let v = e.target.value;
          if (key === "number") v = fmtCard(v);
          if (key === "expiry") v = fmtExpiry(v);
          if (key === "cvv") v = v.replace(/\D/g,"").slice(0,4);
          setCard(c => ({ ...c, [key]: v }));
        }}
        style={{ width: "100%", padding: "12px 14px", border: `2px solid ${cardErr[key] ? "#ef4444" : "#e5e7eb"}`, borderRadius: 12, fontSize: 14, fontWeight: 600, outline: "none", boxSizing: "border-box", letterSpacing: key === "cvv" ? 4 : "normal" }}
        onFocus={e => e.target.style.borderColor = cardErr[key] ? "#ef4444" : "#4f46e5"}
        onBlur={e => e.target.style.borderColor = cardErr[key] ? "#ef4444" : "#e5e7eb"}
        {...extra}
      />
      {cardErr[key] && <p style={{ margin: "4px 0 0", fontSize: 11, color: "#ef4444", fontWeight: 600 }}>{cardErr[key]}</p>}
    </div>
  );

  return (
    <div>
      <button onClick={() => setMethod(null)} style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: 13, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 4 }}>
        ← Back
      </button>

      {/* Card preview */}
      <div style={{ background: "linear-gradient(135deg,#1e1b4b,#4f46e5)", borderRadius: 16, padding: "20px 22px", marginBottom: 20, color: "#fff", fontFamily: "monospace", position: "relative", overflow: "hidden", minHeight: 90 }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: -30, right: 30, width: 80, height: 80, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
        <p style={{ margin: "0 0 10px", fontSize: 18, letterSpacing: 4, fontWeight: 700 }}>
          {(card.number || "•••• •••• •••• ••••")}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, opacity: 0.8 }}>
          <span>{card.name || "CARDHOLDER NAME"}</span>
          <span>{card.expiry || "MM/YY"}</span>
        </div>
      </div>

      {field("Cardholder Name", "name", "John Doe")}
      {field("Card Number", "number", "0000 0000 0000 0000")}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          {field("Expiry", "expiry", "MM/YY")}
        </div>
        <div>
          {field("CVV", "cvv", "•••", "password")}
        </div>
      </div>

      <button
        onClick={handleCardPay}
        disabled={busy}
        style={{ width: "100%", background: busy ? "#c7d2fe" : "linear-gradient(135deg,#059669,#10b981)", color: "#fff", border: "none", borderRadius: 12, padding: "14px", fontWeight: 800, fontSize: 15, cursor: busy ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4 }}
      >
        {busy ? <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Processing…</> : <><Lock size={16} /> Pay ₹{bill?.amount?.toLocaleString()} Securely</>}
      </button>
    </div>
  );
}
