"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import GlobalHeader from "./GlobalHeader";
import GlobalFooter from "./GlobalFooter";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-background-dark text-slate-100 flex flex-col font-display overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,242,255,0.05)_0%,transparent_50%)]"></div>

      <GlobalHeader />

      <main className="flex-1 flex items-center justify-center pt-24 p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative">
            <div className="absolute -top-px left-10 right-10 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent"></div>

            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
              <p className="text-slate-400">Access your developer dashboard</p>
            </div>

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xl">
                    mail
                  </span>
                  <input
                    type="email"
                    className="w-full bg-background-dark/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-slate-100"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-300">
                    Password
                  </label>
                  <Link
                    href="#"
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xl">
                    lock
                  </span>
                  <input
                    type="password"
                    className="w-full bg-background-dark/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-slate-100"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="rounded border-slate-700 bg-background-dark text-primary focus:ring-primary"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-slate-400"
                >
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-background-dark font-bold py-3 rounded-lg hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all uppercase tracking-widest text-sm"
              >
                Sign In
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-white/5 text-center">
              <p className="text-slate-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-primary font-bold hover:underline"
                >
                  Sign up now
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      <div className="mt-auto relative z-10">
        <GlobalFooter />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 -left-20 size-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-1/4 -right-20 size-64 bg-primary/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
    </div>
  );
};

export default LoginPage;
