"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import GlobalHeader from "./GlobalHeader";
import GlobalFooter from "./GlobalFooter";

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-background-dark text-slate-100 flex flex-col font-display overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,242,255,0.05)_0%,transparent_50%)]"></div>
      <GlobalHeader />
      <main className="flex-1 flex items-center justify-center pt-24 p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative">
            <div className="absolute -top-px left-10 right-10 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent"></div>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Join the Elite</h1>
              <p className="text-slate-400">
                Initialize your developer journey
              </p>
            </div>

            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-300">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-background-dark/50 border border-slate-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-slate-100"
                    placeholder="Alex"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-300">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-background-dark/50 border border-slate-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-slate-100"
                    placeholder="Neon"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-300">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full bg-background-dark/50 border border-slate-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-slate-100"
                  placeholder="alex@nexus.io"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-300">
                  Create Password
                </label>
                <input
                  type="password"
                  className="w-full bg-background-dark/50 border border-slate-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-slate-100"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-300">
                  Select Track
                </label>
                <select className="w-full bg-background-dark/50 border border-slate-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-slate-100">
                  <option>Full Stack AI Developer</option>
                  <option>System Architecture</option>
                  <option>Blockchain Engineering</option>
                </select>
              </div>

              <div className="pt-2">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    className="mt-1 rounded border-slate-700 bg-background-dark text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-xs text-slate-400">
                    I agree to the{" "}
                    <Link href="#" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                    . I understand this is for professional development.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-background-dark font-bold py-3 rounded-lg hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all uppercase tracking-widest text-sm mt-4"
              >
                Create Account
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="text-slate-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary font-bold hover:underline"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </main>
      <div className="mt-auto relative z-10">
        <GlobalFooter />
      </div>{" "}
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-3xl pointer-events-none transform translate-x-1/2"></div>
    </div>
  );
};

export default RegisterPage;
