"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProgramModalProps {
  showProgramModal: boolean;
  setShowProgramModal: (show: boolean) => void;
  editingProgram: any;
  programForm: any;
  setProgramForm: React.Dispatch<React.SetStateAction<any>>;
  handleProgramImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleProgramSubmit: (e: React.FormEvent) => void;
  programSubmitting: boolean;
  programError: string;
}

const ProgramModal = ({
  showProgramModal,
  setShowProgramModal,
  editingProgram,
  programForm,
  setProgramForm,
  handleProgramImageUpload,
  handleProgramSubmit,
  programSubmitting,
  programError,
}: ProgramModalProps) => {
  return (
    <AnimatePresence>
      {showProgramModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="bg-background border border-foreground/10 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <div className="p-8 border-b border-foreground/5 flex justify-between items-center bg-foreground/2">
              <div>
                <h2 className="text-2xl font-black text-foreground mb-1">
                  {editingProgram ? "Update Program" : "Architect New Program"}
                </h2>
                <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em]">
                  Learning Path Configuration
                </p>
              </div>
              <button
                onClick={() => setShowProgramModal(false)}
                className="size-10 flex items-center justify-center rounded-2xl hover:bg-rose-500 hover:text-white text-foreground/20 transition-all duration-300"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form
              onSubmit={handleProgramSubmit}
              className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar"
            >
              {/* Media & Essential Detail */}
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Image Upload Area */}
                <div className="w-full md:w-48 shrink-0">
                  <div className="aspect-4/5 rounded-4xl bg-foreground/5 border-2 border-dashed border-foreground/10 flex items-center justify-center overflow-hidden relative group transition-all hover:border-primary/40">
                    {programForm.image ? (
                      <>
                        <img
                          src={programForm.image}
                          alt="Program"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="material-symbols-outlined text-white text-3xl">
                            edit
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-4">
                        <span className="material-symbols-outlined text-4xl text-foreground/10 block mb-2">
                          image
                        </span>
                        <span className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">
                          Upload Poster
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProgramImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  <p className="mt-3 text-[9px] text-center text-foreground/30 font-bold uppercase tracking-tight">
                    Max size: 500KB
                  </p>
                </div>

                <div className="flex-1 space-y-4 w-full">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-foreground/40 ml-2 tracking-widest">
                      Program Identity
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Master React & Next.js"
                      value={programForm.name}
                      onChange={(e) =>
                        setProgramForm({ ...programForm, name: e.target.value })
                      }
                      className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary focus:bg-background transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-foreground/40 ml-2 tracking-widest">
                      Marketing Tagline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. From zero to deployment in 12 weeks"
                      value={programForm.tagline}
                      onChange={(e) =>
                        setProgramForm({
                          ...programForm,
                          tagline: e.target.value,
                        })
                      }
                      className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary focus:bg-background transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-foreground/40 ml-2 tracking-widest">
                  Comprehensive Overview
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the learning outcomes and scope…"
                  value={programForm.description}
                  onChange={(e) =>
                    setProgramForm({
                      ...programForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-3xl px-5 py-4 text-sm focus:outline-none focus:border-primary focus:bg-background transition-all resize-none min-h-30"
                />
              </div>

              {/* Features & Curriculum Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between ml-2">
                  <label className="text-[10px] font-black uppercase text-foreground/40 tracking-widest">
                    Core Modules / Features
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setProgramForm({
                        ...programForm,
                        features: [...programForm.features, ""],
                      })
                    }
                    className="text-[10px] font-black text-primary uppercase hover:tracking-widest transition-all"
                  >
                    + Add Step
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {programForm.features.map((feature: string, idx: number) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        placeholder={`Module #${idx + 1}`}
                        value={feature}
                        onChange={(e) => {
                          const newF = [...programForm.features];
                          newF[idx] = e.target.value;
                          setProgramForm({ ...programForm, features: newF });
                        }}
                        className="flex-1 bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newF = programForm.features.filter(
                            (_: any, i: number) => i !== idx,
                          );
                          setProgramForm({
                            ...programForm,
                            features: newF.length > 0 ? newF : [""],
                          });
                        }}
                        className="size-10 flex items-center justify-center rounded-xl bg-rose-500/5 text-rose-500/40 hover:text-rose-500 hover:bg-rose-500/10 transition-all shrink-0"
                      >
                        <span className="material-symbols-outlined text-sm">
                          close
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Settings */}
              <div className="bg-foreground/2 rounded-4xl p-6 border border-foreground/5 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5 text-center md:text-left">
                  <label className="text-[10px] font-black uppercase text-foreground/30 tracking-widest block mb-2">
                    Placement
                  </label>
                  <div className="flex flex-col items-center md:items-start gap-1">
                    <input
                      type="number"
                      value={programForm.sortOrder}
                      onChange={(e) =>
                        setProgramForm({
                          ...programForm,
                          sortOrder: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-20 bg-background border border-foreground/10 rounded-xl px-3 py-2 text-center text-sm font-bold focus:outline-none focus:border-primary"
                    />
                    <span className="text-[8px] text-foreground/20 font-bold uppercase">
                      Sort Index
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      onClick={() =>
                        setProgramForm({
                          ...programForm,
                          isActive: !programForm.isActive,
                        })
                      }
                      className={`w-12 h-6 rounded-full cursor-pointer transition-all p-1 ${
                        programForm.isActive
                          ? "bg-emerald-500"
                          : "bg-foreground/10"
                      }`}
                    >
                      <div
                        className={`size-4 bg-white rounded-full transition-all ${
                          programForm.isActive
                            ? "translate-x-6"
                            : "translate-x-0"
                        }`}
                      />
                    </div>
                    <span className="text-[10px] font-black uppercase text-foreground/60 tracking-wider">
                      Active
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      onClick={() =>
                        setProgramForm({
                          ...programForm,
                          isVisible: !programForm.isVisible,
                        })
                      }
                      className={`w-12 h-6 rounded-full cursor-pointer transition-all p-1 ${
                        programForm.isVisible
                          ? "bg-primary"
                          : "bg-foreground/10"
                      }`}
                    >
                      <div
                        className={`size-4 bg-white rounded-full transition-all ${
                          programForm.isVisible
                            ? "translate-x-6"
                            : "translate-x-0"
                        }`}
                      />
                    </div>
                    <span className="text-[10px] font-black uppercase text-foreground/60 tracking-wider">
                      Visible
                    </span>
                  </div>
                </div>
              </div>

              {programError && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-xs font-bold text-center"
                >
                  {programError}
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-foreground/5">
                <button
                  type="button"
                  onClick={() => setShowProgramModal(false)}
                  className="flex-1 py-4 text-foreground/40 font-black text-xs uppercase tracking-widest hover:text-rose-500 transition-colors"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  disabled={programSubmitting}
                  className="flex-2 py-4 bg-primary text-primary-content font-black text-xs uppercase tracking-widest rounded-3xl hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-2xl shadow-primary/20"
                >
                  {programSubmitting ? (
                    <div className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="material-symbols-outlined text-lg">
                      auto_awesome
                    </span>
                  )}
                  {editingProgram ? "Update Blueprint" : "Deploy Program"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProgramModal;
