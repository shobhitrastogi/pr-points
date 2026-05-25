"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/public/gemini.webp";
import { Sparkles } from "lucide-react";
import { useCalc } from "../context/CalcContext";
import { QUESTIONS, PASS_MARK } from "../constants";

export default function Navbar() {
    const { total, answered, passed, pct, animatedTotal } = useCalc();
    return (
        <>
  <motion.nav
  className="flex items-center justify-between border-b px-6 py-4 bg-white sticky top-0 z-50 relative"
  initial={{ opacity: 0, y: -16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
>

  {/* LEFT SIDE TEXT (always visible, mobile left aligned) */}
  <h1 className="text-base md:text-xl font-bold whitespace-normal md:whitespace-nowrap max-w-[140px] md:max-w-none leading-tight">
  Your Australian Dream Partner
</h1>

  {/* CENTER LOGO — ALWAYS CENTERED using absolute centering */}
  <Link
    href="/"
    className="absolute left-1/2 -translate-x-1/2 flex items-center"
  >
    <motion.img
      src={logo.src}
      alt="Logo"
      className="h-12 w-auto"
      initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{
        delay: 0.15,
        duration: 0.45,
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      whileHover={{ scale: 1.08, rotate: 4, transition: { duration: 0.2 } }}
    />
  </Link>

  {/* RIGHT MENU — Only on desktop */}
  <motion.div
    className="hidden md:flex gap-6 text-sm"
    initial={{ opacity: 0, x: 12 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.28, duration: 0.35 }}
  >
    <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
      <Link href="/" className="transition-colors hover:text-primary">
        Home
      </Link>
    </motion.div>
  </motion.div>

</motion.nav>
             <motion.header  style={{
    position: "fixed",
    top: 8,
    left: 0,
    width: "100%",
    marginTop:"40px",
    background: "white",
  }}
                     className="flex items-center justify-center md:justify-between border-b px-6 py-2 z-49"
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                    <div   style={{ maxWidth: 1080, margin: "0 auto", padding: "24px 28px" }}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15, duration: 0.35 }}
                      >
                        <Sparkles size={12} color="#3b82f6" />
                        <span style={{
                          fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                          color: "#3b82f6", textTransform: "uppercase",
                        }}>
                          Skilled Migration · 2026
                        </span>
                      </motion.div>

                      <motion.h1
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.38 }}
                        style={{
                          fontSize: "clamp(24px, 3.5vw, 34px)",
                          fontWeight: 800, letterSpacing: "-0.025em",
                          color: "#0f172a", margin: "0 0 8px", lineHeight: 1.15,
                        }}
                      >
                        Australia PR Points Calculator
                      </motion.h1>

                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.38 }}
                        style={{ fontSize: 14, color: "#64748b", margin: 0, lineHeight: 1.65, maxWidth: 540 }}
                      >
                        Estimate your score for the{" "}
                        <strong style={{ color: "#1d4ed8" }}>189</strong>,{" "}
                        <strong style={{ color: "#1d4ed8" }}>190</strong> and{" "}
                        <strong style={{ color: "#1d4ed8" }}>491</strong> skilled visas.
                      </motion.p>
                       {/* Live score chip — visible once any question is answered */}
                    <AnimatePresence>
                      {answered > 0 && (
                        <motion.div
                          key="header-score"
                          className="header-score-chip"
                          initial={{ opacity: 0, scale: 0.8, y: -6 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: -6 }}
                          transition={{ type: "spring", stiffness: 340, damping: 22 }}
                          style={{
                            marginTop: 14,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 10,
                            background: passed
                            ? "linear-gradient(90deg, #0ea5e9, #6366f1)"
                              : "linear-gradient(90deg, #f59e0b, #f97316)",
                            borderRadius: 999,
                            padding: "6px 14px 6px 8px",
                        }}
                        >
                          {/* Animated number */}
                          <span style={{
                            background: "rgba(255,255,255,0.18)",
                            borderRadius: 999,
                            padding: "2px 10px",
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 15,
                            fontWeight: 800,
                            color: "#fff",
                          }}>
                            <motion.span>{animatedTotal}</motion.span>
                            <span style={{ fontSize: 10, fontWeight: 500, opacity: 0.75, marginLeft: 2 }}>pts</span>
                          </span>

                          {/* Mini progress bar */}
                          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>
                              {answered}/{QUESTIONS.length} answered
                              {passed ? " · ✓ Pass mark reached" : ` · ${PASS_MARK - total > 0 ? PASS_MARK - total : 0} pts to go`}
                            </span>
                            <div style={{
                              width: 140,
                              height: 4,
                              borderRadius: 999,
                              background: "rgba(255,255,255,0.25)",
                              overflow: "hidden",
                            }}>
                              <motion.div
                                animate={{ width: `${pct}%` }}
                                transition={{ type: "spring", stiffness: 80, damping: 18 }}
                                style={{
                                    height: "100%",
                                  borderRadius: 999,
                                  background: "rgba(255,255,255,0.88)",
                                }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    </div>
                  </motion.header>
                                </>

    );
}
