"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Program } from "./types";

interface ProgramsProps {
  programs: Program[];
  programsLoading: boolean;
  programViewMode: "grid" | "list";
  setProgramViewMode: (mode: "grid" | "list") => void;
  setShowProgramModal: (show: boolean) => void;
  openEditProgram: (program: Program) => void;
  handleToggleProgramActive: (program: Program) => void;
  handleToggleProgramVisibility: (program: Program) => void;
  handleDeleteProgram: (id: string) => void;
}

const Programs = ({
  programs,
  programsLoading,
  programViewMode,
  setProgramViewMode,
  setShowProgramModal,
  openEditProgram,
  handleToggleProgramActive,
  handleToggleProgramVisibility,
  handleDeleteProgram,
}: ProgramsProps) => {
  return (
    <motion.div
      key="programs"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black mb-2 text-foreground">
            Curriculum Programs
          </h1>
          <p className="text-foreground/50">
            Create and manage learning paths for your students.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* View Toggle */}
          <div className="flex bg-foreground/5 rounded-xl p-1 border border-foreground/10">
            <button
              onClick={() => setProgramViewMode("grid")}
              className={`size-10 flex items-center justify-center rounded-lg transition-all ${
                programViewMode === "grid"
                  ? "bg-primary text-primary-content shadow-lg"
                  : "text-foreground/40 hover:text-foreground"
              }`}
              title="Grid View"
            >
              <span className="material-symbols-outlined text-xl">
                grid_view
              </span>
            </button>
            <button
              onClick={() => setProgramViewMode("list")}
              className={`size-10 flex items-center justify-center rounded-lg transition-all ${
                programViewMode === "list"
                  ? "bg-primary text-primary-content shadow-lg"
                  : "text-foreground/40 hover:text-foreground"
              }`}
              title="List View"
            >
              <span className="material-symbols-outlined text-xl">
                view_list
              </span>
            </button>
          </div>

          <button
            onClick={() => {
              setShowProgramModal(true);
            }}
            className="px-6 py-3 bg-primary text-primary-content font-black rounded-xl hover:brightness-110 flex items-center gap-2 shadow-xl shadow-primary/20 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">add_circle</span>
            New Program
          </button>
        </div>
      </div>

      {programsLoading ? (
        <div className="p-24 text-center">
          <div className="size-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-primary font-bold animate-pulse tracking-widest text-sm uppercase">
            Fetching program data…
          </p>
        </div>
      ) : programs.length === 0 ? (
        <div className="bg-background/40 backdrop-blur-xl border border-foreground/10 rounded-3xl p-24 text-center">
          <div className="size-24 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="material-symbols-outlined text-5xl text-foreground/10">
              terminal
            </span>
          </div>
          <h3 className="text-xl font-black text-foreground mb-3">
            No Programs found
          </h3>
          <p className="text-foreground/40 font-bold mb-8 max-w-xs mx-auto">
            You haven&apos;t added any educational paths yet. Click the button
            above to begin.
          </p>
          <button
            onClick={() => setShowProgramModal(true)}
            className="text-primary font-black hover:underline underline-offset-8"
          >
            Create Your First Program →
          </button>
        </div>
      ) : (
        <div
          className={
            programViewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
              : "space-y-4"
          }
        >
          <AnimatePresence mode="popLayout">
            {programs
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((prog) => (
                <motion.div
                  key={prog._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`${
                    programViewMode === "grid"
                      ? "bg-background/40 backdrop-blur-xl border rounded-4xl p-6 group"
                      : "bg-background/40 backdrop-blur-xl border rounded-2xl p-4 flex items-center gap-4"
                  } transition-all relative overflow-hidden ${
                    prog.isActive
                      ? "border-foreground/10 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5"
                      : "border-rose-500/10 opacity-60"
                  }`}
                >
                  {/* Status Badges */}
                  <div className="absolute top-4 right-4 flex gap-2 z-10">
                    {!prog.isActive && (
                      <span className="bg-rose-500 text-white text-[9px] font-black uppercase px-2 py-1 rounded-lg">
                        Inactive
                      </span>
                    )}
                    {prog.isVisible === false && (
                      <span className="bg-amber-500 text-white text-[9px] font-black uppercase px-2 py-1 rounded-lg">
                        Hidden
                      </span>
                    )}
                  </div>

                  {programViewMode === "grid" ? (
                    <>
                      {/* Image Preview */}
                      <div className="aspect-video bg-foreground/5 rounded-2xl mb-6 overflow-hidden relative group-hover:shadow-lg transition-all duration-500">
                        {prog.image ? (
                          <img
                            src={prog.image}
                            alt={prog.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center uppercase text-[10px] font-black text-foreground/10 tracking-widest">
                            No Preview Image
                          </div>
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end p-4">
                          <p className="text-white/80 text-[10px] font-black tracking-widest uppercase">
                            {prog.tagline || "Kasauli Coder Program"}
                          </p>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-xl font-black text-foreground mb-2 group-hover:text-primary transition-colors">
                          {prog.name}
                        </h3>
                        <p className="text-xs text-foreground/50 line-clamp-2 leading-relaxed h-8">
                          {prog.description}
                        </p>
                      </div>

                      {/* Management Controls */}
                      <div className="grid grid-cols-2 gap-4 mt-auto">
                        <button
                          onClick={() => openEditProgram(prog)}
                          className="flex items-center justify-center gap-2 py-3 bg-foreground/5 hover:bg-foreground/10 text-foreground font-black rounded-2xl text-[10px] uppercase tracking-wider transition-all"
                        >
                          <span className="material-symbols-outlined text-sm">
                            edit_square
                          </span>
                          Configure
                        </button>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleToggleProgramActive(prog)}
                            className={`flex-1 flex items-center justify-center rounded-2xl transition-all border ${
                              prog.isActive
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20"
                                : "bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20"
                            }`}
                            title={prog.isActive ? "Deactivate" : "Activate"}
                          >
                            <span className="material-symbols-outlined text-lg">
                              {prog.isActive ? "bolt" : "power_off"}
                            </span>
                          </button>
                          <button
                            onClick={() => handleToggleProgramVisibility(prog)}
                            className={`flex-1 flex items-center justify-center rounded-2xl transition-all border ${
                              prog.isVisible !== false
                                ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                                : "bg-foreground/5 text-foreground/30 border-foreground/10 hover:bg-foreground/10"
                            }`}
                            title={
                              prog.isVisible !== false
                                ? "Hide on Site"
                                : "Show on Site"
                            }
                          >
                            <span className="material-symbols-outlined text-lg">
                              {prog.isVisible !== false
                                ? "visibility"
                                : "visibility_off"}
                            </span>
                          </button>
                          <button
                            onClick={() => handleDeleteProgram(prog._id)}
                            className="flex-1 flex items-center justify-center rounded-2xl bg-foreground/5 text-foreground/20 hover:text-rose-500 hover:bg-rose-500/5 transition-all"
                            title="Purge"
                          >
                            <span className="material-symbols-outlined text-lg">
                              delete
                            </span>
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="size-12 shrink-0 bg-foreground/5 rounded-xl overflow-hidden border border-foreground/10">
                        {prog.image && (
                          <img
                            src={prog.image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-foreground truncate">
                          {prog.name}
                        </h4>
                        <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-tighter truncate">
                          {prog.tagline || "Untitled Path"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditProgram(prog)}
                          className="size-9 flex items-center justify-center text-foreground/40 hover:text-primary transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">
                            edit
                          </span>
                        </button>
                        <button
                          onClick={() => handleToggleProgramActive(prog)}
                          className={`size-9 flex items-center justify-center rounded-lg transition-all ${
                            prog.isActive
                              ? "text-emerald-500 bg-emerald-500/10"
                              : "text-rose-500 bg-rose-500/10"
                          }`}
                        >
                          <span className="material-symbols-outlined text-lg">
                            {prog.isActive ? "toggle_on" : "toggle_off"}
                          </span>
                        </button>
                        <button
                          onClick={() => handleToggleProgramVisibility(prog)}
                          className={`size-9 flex items-center justify-center rounded-lg transition-all ${
                            prog.isVisible !== false
                              ? "text-primary bg-primary/10"
                              : "text-foreground/20 bg-foreground/5"
                          }`}
                        >
                          <span className="material-symbols-outlined text-lg">
                            {prog.isVisible !== false
                              ? "visibility"
                              : "visibility_off"}
                          </span>
                        </button>
                        <button
                          onClick={() => handleDeleteProgram(prog._id)}
                          className="size-9 flex items-center justify-center text-foreground/20 hover:text-rose-500"
                        >
                          <span className="material-symbols-outlined text-lg">
                            delete
                          </span>
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default Programs;
