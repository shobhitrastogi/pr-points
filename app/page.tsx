"use client";

import { useMemo, useState } from "react";
import {
  motion,
  AnimatePresence,
  useSpring,
  useTransform,
  useMotionValue,
} from "framer-motion";
import {
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { ContactForm } from "@/app/components/ContactForm";
import { useCalc } from "@/app/context/CalcContext";
import { QUESTIONS, SECTION_COLORS, PASS_MARK } from "./constants";

type Option = { label: string; points: number };
type Question = {
  id: string;
  section: string;
  title: string;
  icon: React.ReactNode;
  options: Option[];
};

function useAnimatedCounter(target: number) {
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 100, damping: 22 });
  const rounded = useTransform(spring, (v) => Math.round(v));
  useMemo(() => { motionVal.set(target); }, [target, motionVal]);
  return rounded;
}

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.36, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function Home() {
   const { answers, setAnswers, total, answered, progress, passed, pct, animatedTotal, reset } = useCalc();
  return (
    <div style={{
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      background: "#f1f5f9",
      minHeight: "100vh",
      marginTop: "120px",
    }}>

      <main
        style={{
          maxWidth: 1080, margin: "0 auto",
          padding: "28px 28px 48px",
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: 24, alignItems: "start",
        }}
        className="calc-main"
      >
        {/* ── Questions ── */}
        <section style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {QUESTIONS.map((q, idx) => {
            const c = SECTION_COLORS[q.id];
            const isAnswered = answers[q.id] !== undefined;
            return (
              <motion.article
                key={q.id}
                custom={idx}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                style={{
                  background: "#ffffff",
                  borderRadius: 16,
                  border: isAnswered ? `1.5px solid ${c.border}` : "1.5px solid #e2e8f0",
                  boxShadow: isAnswered
                    ? `0 2px 12px ${c.dot}20`
                    : "0 1px 4px rgba(0,0,0,0.05)",
                  padding: "18px 20px",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                whileHover={{ y: -2, boxShadow: "0 6px 24px rgba(0,0,0,0.09)" }}
              >
                {/* Card header row */}
                <div style={{
                  display: "flex", alignItems: "center",
                  justifyContent: "space-between", marginBottom: 10, gap: 8,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: 8,
                      background: c.bg, border: `1px solid ${c.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: c.dot, flexShrink: 0,
                    }}>
                      {q.icon}
                    </div>
                    <span style={{
                      fontSize: 10.5, fontWeight: 700,
                      letterSpacing: "0.07em", textTransform: "uppercase",
                      color: c.text,
                    }}>
                      {String(idx + 1).padStart(2, "0")} · {q.section}
                    </span>
                  </div>

                  <AnimatePresence mode="wait">
                    {isAnswered && (
                      <motion.div
                        key={answers[q.id].points}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1, transition: { type: "spring", stiffness: 400, damping: 18 } }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        style={{
                          display: "flex", alignItems: "center", gap: 4,
                          background: answers[q.id].points > 0 ? c.bg : "#f8fafc",
                          border: `1px solid ${answers[q.id].points > 0 ? c.border : "#e2e8f0"}`,
                          borderRadius: 999, padding: "3px 10px",
                        }}
                      >
                        <CheckCircle2 size={10} color={answers[q.id].points > 0 ? c.dot : "#94a3b8"} />
                        <span style={{
                          fontSize: 11, fontWeight: 700,
                          fontFamily: "'JetBrains Mono', monospace",
                          color: answers[q.id].points > 0 ? c.dot : "#94a3b8",
                        }}>
                          +{answers[q.id].points} pts
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <h2 style={{
                  fontSize: 14.5, fontWeight: 700, color: "#0f172a",
                  lineHeight: 1.4, margin: "0 0 12px",
                }}>
                  {q.title}
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {q.options.map((opt) => {
                    const selected = answers[q.id]?.label === opt.label;
                    return (
                      <motion.button
                        type="button"
                        key={opt.label}
                        whileHover={{ scale: 1.008 }}
                        whileTap={{ scale: 0.993 }}
                        onClick={() =>
                          setAnswers((a) => ({ ...a, [q.id]: { label: opt.label, points: opt.points } }))
                        }
                        style={{
                          display: "flex", alignItems: "center",
                          justifyContent: "space-between", gap: 10,
                          padding: "9px 12px", borderRadius: 10,
                          cursor: "pointer", width: "100%", textAlign: "left",
                          border: selected ? `1.5px solid ${c.dot}` : "1.5px solid #e2e8f0",
                          background: selected ? c.bg : "#fafafa",
                          boxShadow: selected ? `0 0 0 3px ${c.dot}18` : "none",
                          transition: "all 0.16s ease",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 9, flex: 1 }}>
                          <div style={{
                            width: 17, height: 17, borderRadius: "50%", flexShrink: 0,
                            border: selected ? `2px solid ${c.dot}` : "2px solid #cbd5e1",
                            background: selected ? c.dot : "#fff",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "all 0.15s ease",
                          }}>
                            {selected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }}
                              />
                            )}
                          </div>
                          <span style={{
                            fontSize: 13, lineHeight: 1.45,
                            color: selected ? "#0f172a" : "#475569",
                            fontWeight: selected ? 600 : 400,
                            transition: "color 0.15s",
                          }}>
                            {opt.label}
                          </span>
                        </div>

                        <AnimatePresence>
                          {selected && (
                            <motion.span
                              key="pts"
                              initial={{ opacity: 0, scale: 0.5, x: 6 }}
                              animate={{ opacity: 1, scale: 1, x: 0 }}
                              exit={{ opacity: 0, scale: 0.5, x: 6 }}
                              transition={{ type: "spring", stiffness: 380, damping: 20 }}
                              style={{
                                flexShrink: 0,
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: 11.5, fontWeight: 700,
                                padding: "2px 8px", borderRadius: 6,
                                background: c.dot, color: "#fff",
                              }}
                            >
                              +{opt.points}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.article>
            );
          })}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: QUESTIONS.length * 0.05 + 0.25, duration: 0.4 }}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "#fff", border: "1.5px dashed #e2e8f0",
              borderRadius: 12, padding: "12px 16px", gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <AlertCircle size={13} color="#94a3b8" />
              <span style={{ fontSize: 12, color: "#94a3b8" }}>
                This calculator is a guide only and not a formal migration assessment.
              </span>
            </div>
            <motion.button
              type="button"
              onClick={reset}
              whileHover={{ scale: 1.04, background: "#f1f5f9" }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "flex", alignItems: "center", gap: 5, flexShrink: 0,
                background: "#f8fafc", border: "1.5px solid #e2e8f0",
                borderRadius: 8, padding: "6px 12px", cursor: "pointer",
                fontSize: 12, fontWeight: 600, color: "#64748b",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              <RotateCcw size={12} />
              Reset
            </motion.button>
          </motion.div>
        </section>

        <aside style={{ position: "sticky", top: 24 }}>
          <AnimatePresence mode="wait">
            {answered === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28 }}
                style={{
                  background: "#fff", borderRadius: 20,
                  border: "1.5px dashed #e2e8f0",
                  padding: "40px 24px", textAlign: "center",
                }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 14, margin: "0 auto 14px",
                  background: "#eff6ff", border: "1.5px solid #bfdbfe",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <TrendingUp size={22} color="#3b82f6" />
                </div>
                <p style={{ fontWeight: 700, color: "#0f172a", fontSize: 14, margin: "0 0 5px" }}>
                  Your score will appear here
                </p>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, lineHeight: 1.55 }}>
                  Select an answer to start calculating your points.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="score"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  background: "#fff", borderRadius: 20,
                  border: "1.5px solid #e2e8f0",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                  overflow: "hidden",
                }}
              >
                <div style={{
                  padding: "24px 22px 20px",
                  background: passed
                    ? "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)"
                    : "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
                  position: "relative", overflow: "hidden",
                }}>
                  <div style={{
                    position: "absolute", top: -28, right: -28,
                    width: 100, height: 100, borderRadius: "50%",
                    background: "rgba(255,255,255,0.12)",
                  }} />
                  <div style={{
                    position: "absolute", bottom: -20, left: -10,
                    width: 80, height: 80, borderRadius: "50%",
                    background: "rgba(255,255,255,0.07)",
                  }} />

                  <p style={{
                    fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em",
                    textTransform: "uppercase", color: "rgba(255,255,255,0.72)",
                    margin: "0 0 6px", position: "relative",
                  }}>
                    Your Score
                  </p>

                  <div style={{ display: "flex", alignItems: "baseline", gap: 6, position: "relative" }}>
                    <motion.span style={{
                      fontSize: 60, fontWeight: 800, lineHeight: 1,
                      fontFamily: "'JetBrains Mono', monospace",
                      color: "#ffffff",
                    }}>
                      {animatedTotal}
                    </motion.span>
                  </div>

                  <div style={{
                    marginTop: 16, height: 6, width: "100%",
                    borderRadius: 999, background: "rgba(255,255,255,0.2)",
                    overflow: "hidden",
                  }}>
                    <motion.div
                      animate={{ width: `${pct}%` }}
                      transition={{ type: "spring", stiffness: 80, damping: 18 }}
                      style={{
                        height: "100%", borderRadius: 999,
                        background: "rgba(255,255,255,0.88)",
                        boxShadow: "0 0 8px rgba(255,255,255,0.4)",
                      }}
                    />
                  </div>
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    fontSize: 10, color: "rgba(255,255,255,0.42)", marginTop: 5,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>
                  </div>
                </div>

                <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{
                    background: "#f8fafc", borderRadius: 12,
                    border: "1px solid #e2e8f0", overflow: "hidden",
                  }}>
                    <div style={{
                      padding: "8px 12px", borderBottom: "1px solid #e2e8f0",
                      fontSize: 10.5, fontWeight: 700, letterSpacing: "0.07em",
                      textTransform: "uppercase", color: "#94a3b8",
                    }}>
                      Points Breakdown
                    </div>
                    <div style={{ padding: "6px 6px" }}>
                      {QUESTIONS.filter((q) => answers[q.id] !== undefined).map((q) => {
                        const c = SECTION_COLORS[q.id];
                        const pts = answers[q.id].points;
                        return (
                          <motion.div
                            key={q.id}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            style={{
                              display: "flex", alignItems: "center",
                              justifyContent: "space-between",
                              padding: "5px 8px", borderRadius: 7,
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                              <div style={{
                                width: 7, height: 7, borderRadius: "50%",
                                background: pts > 0 ? c.dot : "#cbd5e1", flexShrink: 0,
                              }} />
                              <span style={{ fontSize: 12, color: "#475569" }}>{q.section}</span>
                            </div>
                            <span style={{
                              fontSize: 12, fontWeight: 700,
                              fontFamily: "'JetBrains Mono', monospace",
                              color: pts > 0 ? c.dot : "#94a3b8",
                            }}>
                              +{pts}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div style={{
                      display: "flex", justifyContent: "space-between",
                      fontSize: 11, color: "#94a3b8", marginBottom: 6,
                    }}>
                      <span>Questions answered</span>
                      <motion.span
                        key={answered}
                        initial={{ opacity: 0, y: -3 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontWeight: 600, color: "#64748b",
                        }}
                      >
                        {answered}/{QUESTIONS.length}
                      </motion.span>
                    </div>
                    <div style={{
                      height: 5, background: "#f1f5f9",
                      borderRadius: 999, overflow: "hidden",
                    }}>
                      <motion.div
                        animate={{ width: `${progress}%` }}
                        transition={{ type: "spring", stiffness: 80, damping: 18 }}
                        style={{
                          height: "100%", borderRadius: 999,
                          background: "linear-gradient(90deg, #6366f1, #3b82f6)",
                        }}
                      />
                    </div>
                  </div>

                  <p style={{
                    fontSize: 11, color: "#94a3b8", lineHeight: 1.55,
                    borderTop: "1px solid #f1f5f9", paddingTop: 12, margin: 0,
                  }}>
                    Reaching the pass mark does not guarantee an invitation — cut-offs vary by occupation and round.
                  </p>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02, boxShadow: "0 6px 20px rgba(99,102,241,0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.open("https://www.geminieducation.com.au/page-contact", "_blank")}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                      padding: "11px 16px", borderRadius: 12, cursor: "pointer",
                      background: "linear-gradient(90deg, #6366f1, #3b82f6)",
                      border: "none", color: "#fff",
                      fontSize: 13, fontWeight: 700,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      boxShadow: "0 4px 14px rgba(99,102,241,0.22)",
                    }}
                  >
                  Book An Appointment
                    <ChevronRight size={14} />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </main>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "0 28px 48px",
        }}
      >
        <div style={{
          background: "#fff",
          borderRadius: 20,
          border: "1.5px solid #e2e8f0",
          boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}>
          <div style={{
            padding: "40px 28px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 24,
          }}>
            <div>
              <h2 style={{
                fontSize: "clamp(20px, 3vw, 28px)",
                fontWeight: 800,
                color: "#0f172a",
                margin: "0 0 8px",
                letterSpacing: "-0.02em",
              }}>
                Get Expert Advice
              </h2>
              <p style={{
                fontSize: 14,
                color: "#64748b",
                margin: 0,
                lineHeight: 1.6,
                maxWidth: 500,
                marginInline: "auto",
              }}>
                Need help with your application? Drop us a message and our
                skilled migration experts will review your profile.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </motion.section>

      <footer style={{
        borderTop: "1px solid #e2e8f0",
        padding: "18px 28px",
        textAlign: "center",
        fontSize: 12, color: "#94a3b8",
        background: "#fff",
      }}>
        For informational use only · Not migration advice
      </footer>
       <style>{`
  @media (max-width: 820px) {
    .calc-main { grid-template-columns: 1fr !important; }
  }
  .header-score-chip { display: inline-flex; }
  @media (min-width: 821px) {
    .header-score-chip { display: none !important; }
  }
`}</style>
    </div>
    
  );
  
}
