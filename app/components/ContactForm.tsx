import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useCalc } from "../context/CalcContext";
import { AlertCircle, CheckCircle2 } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(8, { message: "Please enter a valid phone number." }),
});

type ContactFormData = z.infer<typeof formSchema>;
const fields = [
  { name: "name" as const, label: "Full Name", type: "text", placeholder: "John Doe", icon: "👤" },
  { name: "email" as const, label: "Email Address", type: "email", placeholder: "john@example.com", icon: "✉️" },
  { name: "phone" as const, label: "Phone Number", type: "tel", placeholder: "+61 400 000 000", icon: "📞" },
];

function FloatingField({
  label, type, placeholder, icon, field, error, index,
}: {
  label: string; type: string; placeholder: string; icon: string;
  field: React.InputHTMLAttributes<HTMLInputElement> & { value: string };
  error?: string; index: number;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || !!field.value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 + 0.15, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: "relative" }}
    >
      <div
        style={{
          position: "relative",
          borderRadius: 14,
          background: focused ? "#f8faff" : "#fafafa",
          border: error
            ? "1.5px solid #f43f5e"
            : focused
              ? "1.5px solid #6366f1"
              : "1.5px solid #e2e8f0",
          boxShadow: focused
            ? "0 0 0 4px rgba(99,102,241,0.10)"
            : error
              ? "0 0 0 4px rgba(244,63,94,0.08)"
              : "none",
          transition: "all 0.2s ease",
          overflow: "hidden",
        }}
      >
        {/* Animated left accent bar */}
        <motion.div
          animate={{ scaleY: focused ? 1 : 0, opacity: focused ? 1 : 0 }}
          initial={{ scaleY: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "absolute", left: 0, top: 0, bottom: 0,
            width: 3, borderRadius: "14px 0 0 14px",
            background: "linear-gradient(180deg, #6366f1, #3b82f6)",
            transformOrigin: "top",
          }}
        />

        {/* Icon */}
        <span style={{
          position: "absolute", left: 16, top: "50%",
          transform: "translateY(-50%)",
          fontSize: 16, opacity: active ? 1 : 0.4,
          transition: "opacity 0.2s",
          pointerEvents: "none",
        }}>
          {icon}
        </span>

        {/* Floating label */}
        <motion.label
          animate={active
            ? { y: -10, scale: 0.78, color: focused ? "#6366f1" : "#64748b" }
            : { y: 0, scale: 1, color: "#94a3b8" }
          }
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute", left: 46,
            top: "50%", transform: "translateY(-50%)",
            transformOrigin: "left center",
            fontSize: 14, fontWeight: 500,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            marginTop: "-8px"
          }}
        >
          {label}
        </motion.label>

        <input
          {...field}
          type={type}
          placeholder={focused ? placeholder : ""}
          onFocus={() => setFocused(true)}
          onBlur={(e) => { setFocused(false); field.onBlur?.(e); }}
          style={{
            width: "100%", border: "none", outline: "none",
            background: "transparent",
            padding: active ? "24px 16px 10px 46px" : "17px 16px 17px 46px",
            fontSize: 14, fontWeight: 500, color: "#0f172a",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            transition: "padding 0.2s ease",
            boxSizing: "border-box",
          }}
        />
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            style={{
              fontSize: 11.5, color: "#f43f5e", fontWeight: 600,
              marginTop: 5, marginLeft: 4,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const { total, answers } = useCalc();
  // const [form, setForm] = useState({
  //   name:"",
  //   email:"",
  //   phone:"",
  //   message:""
  // }

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("")

  const visaLabel = answers['subclass']?.label ?? "";
  // const visaType = visaLabel.includes("491")
  // ? "491"
  // : visaLabel.includes("109")
  //   ? "109"
  //   : visaLabel.includes("189")
  //     ? "189"
  //     : undefined;

  const hasScore = Object.keys(answers).length > 0;
  const hasAnswers = Object.keys(answers).length > 0;
  const form = useForm<ContactFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", phone: "" },
  });
  const { isSubmitting } = form.formState;

  // const handleChange = (
  //     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  //   ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));


  // const handleSubmit = async () => {
  //   if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
  //     setErrorMsg("Please fill in your name, email and message.");
  //     setStatus("error");
  //     return;
  //   }

  //   setStatus("loading");
  //   setErrorMsg("");

  //   try {
  //     const res = await fetch("/api/contact", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         ...form,
  //         score: Object.keys(answers).length > 0 ? total : undefined,
  //         visaType,
  //       }),
  //     });

  //     const data = await res.json();

  //     if (!res.ok) {
  //       setErrorMsg(data.error ?? "Something went wrong.");
  //       setStatus("error");
  //       return;
  //     }

  //     setStatus("success");
  //     setForm({ name: "", email: "", phone: "", message: "" });
  //   } catch {
  //     setErrorMsg("Network error. Please check your connection.");
  //     setStatus("error");
  //   }
  // };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: 12,
          padding: "32px 24px", textAlign: "center",
        }}
      >
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: "#f0fdf4", border: "2px solid #bbf7d0",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <CheckCircle2 size={26} color="#22c55e" />
        </div>
        <div>
          <p style={{ fontWeight: 800, fontSize: 16, color: "#0f172a", margin: "0 0 4px" }}>
            Message sent!
          </p>
          <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
            Our team will get back to you shortly.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setStatus("idle")}
          style={{
            marginTop: 4, padding: "8px 20px",
            borderRadius: 8, border: "1.5px solid #e2e8f0",
            background: "#f8fafc", cursor: "pointer",
            fontSize: 13, fontWeight: 600, color: "#64748b",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          Send another
        </motion.button>
      </motion.div>
    );
  }



  async function onSubmit(values: ContactFormData) {
    setStatus("loading")
    setErrorMsg("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          score: total,
        })
      })
         if (!res.ok) {
      throw new Error("Failed to submit form");
    }

    setStatus("success");
    toast.success("Message sent successfully!");
    setSubmitted(true);
    }  catch (err: any) {
    setStatus("error");
    setErrorMsg(err.message || "Something went wrong");
    toast.error("Something went wrong. Try again!");
  }
  }

  return (
    <div style={{ width: "100%", maxWidth: 420, margin: "0 auto" }}>
      <AnimatePresence mode="wait">
        {submitted ? (
          /* ── Success state ── */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              textAlign: "center", padding: "40px 24px",
              background: "#fff", borderRadius: 20,
              border: "1.5px solid #bbf7d0",
              boxShadow: "0 8px 32px rgba(16,185,129,0.10)",
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 18 }}
              style={{
                width: 64, height: 64, borderRadius: "50%",
                background: "linear-gradient(135deg, #10b981, #059669)",
                margin: "0 auto 18px",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 8px 24px rgba(16,185,129,0.3)",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 8px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Message Sent!
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              style={{ fontSize: 13, color: "#64748b", margin: "0 0 24px", lineHeight: 1.6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Our migration experts will review your profile and get back to you shortly.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setSubmitted(false); form.reset(); }}
              style={{
                padding: "9px 22px", borderRadius: 10, cursor: "pointer",
                background: "#f1f5f9", border: "1.5px solid #e2e8f0",
                fontSize: 13, fontWeight: 600, color: "#475569",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Send another
            </motion.button>
          </motion.div>
        ) : (
          /* ── Form ── */
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              {fields.map((f, i) => (
                <Controller
                  key={f.name}
                  control={form.control}
                  name={f.name}
                  render={({ field, fieldState }) => (
                    <div style={{ margin: 0 }}>
                      <FloatingField
                        label={f.label}
                        type={f.type}
                        placeholder={f.placeholder}
                        icon={f.icon}
                        field={field as React.InputHTMLAttributes<HTMLInputElement> & { value: string }}
                        error={fieldState.error?.message}
                        index={i}
                      />
                    </div>
                  )}
                />
              ))}
                {hasAnswers && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "8px 12px", borderRadius: 8,
                      background: "#f8fafc", border: "1.5px solid #e2e8f0",
                      fontSize: 12, color: "#64748b",
                    }}
                  >
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 700, fontSize: 13,
                      color: total >= 65 ? "#1d4ed8" : "#b45309",
                    }}>
                      {total} pts
                    </span>
                    <span>will be included with your enquiry</span>
                    
                  </motion.div>
                )}

                {/* Error banner */}
                <AnimatePresence>
                  {status === "error" && errorMsg && (
                    <motion.div
                      key="banner"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      style={{
                        display: "flex", alignItems: "center", gap: 7,
                        padding: "9px 12px", borderRadius: 8,
                        background: "#fff1f2", border: "1.5px solid #fecdd3",
                        fontSize: 12, color: "#be123c",
                      }}
                    >
                      <AlertCircle size={13} />
                      {errorMsg}
                    </motion.div>
                  )}
                </AnimatePresence>
                {/* Submit button */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{ marginTop: 4 }}
                >
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={!isSubmitting ? { scale: 1.02, boxShadow: "0 8px 24px rgba(99,102,241,0.35)" } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    style={{
                      width: "100%", padding: "13px 20px",
                      borderRadius: 14, border: "none", cursor: isSubmitting ? "default" : "pointer",
                      background: isSubmitting
                        ? "linear-gradient(90deg, #a5b4fc, #93c5fd)"
                        : "linear-gradient(90deg, #6366f1, #3b82f6)",
                      color: "#fff", fontSize: 14, fontWeight: 700,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      boxShadow: "0 4px 16px rgba(99,102,241,0.25)",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      transition: "background 0.3s",
                      letterSpacing: "0.01em",
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {isSubmitting ? (
                        <motion.span
                          key="loading"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          style={{ display: "flex", alignItems: "center", gap: 8 }}
                        >
                          <motion.svg
                            width="16" height="16" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2.5"
                            strokeLinecap="round"
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                          >
                            <path d="M21 12a9 9 0 1 1-6.22-8.56" />
                          </motion.svg>
                          Sending…
                        </motion.span>
                      ) : (
                        <motion.span
                          key="idle"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          style={{ display: "flex", alignItems: "center", gap: 7 }}
                        >
                          Send Message
                          <motion.svg
                            width="15" height="15" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                            animate={{ x: [0, 3, 0] }}
                            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                          >
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </motion.svg>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.div>
              </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}