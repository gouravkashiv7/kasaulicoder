"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StaffModalProps {
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  editingStaff: any;
  setEditingStaff: (staff: any) => void;
  newStaff: any;
  setNewStaff: React.Dispatch<React.SetStateAction<any>>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCreateStaff: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  uploadError: string;
  submitError: string;
}

const roles = [
  {
    id: "admin",
    label: "Admin",
    icon: "shield_person",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    id: "editor",
    label: "Editor",
    icon: "edit_note",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    id: "support",
    label: "Support",
    icon: "support_agent",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
];

const CustomRoleDropdown = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedRole = roles.find((r) => r.id === value) || roles[0];

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm flex items-center justify-between cursor-pointer hover:border-primary/40 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span
            className={`material-symbols-outlined text-lg ${selectedRole.color}`}
          >
            {selectedRole.icon}
          </span>
          <span className="font-medium text-foreground">
            {selectedRole.label}
          </span>
        </div>
        <span
          className={`material-symbols-outlined text-foreground/30 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        >
          expand_more
        </span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-[60]"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute left-0 right-0 top-full mt-2 bg-background border border-foreground/10 rounded-2xl shadow-2xl z-[70] overflow-hidden p-1.5"
            >
              {roles.map((role) => (
                <div
                  key={role.id}
                  onClick={() => {
                    onChange(role.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
                    value === role.id
                      ? "bg-primary/10"
                      : "hover:bg-foreground/5"
                  }`}
                >
                  <div
                    className={`size-8 rounded-lg ${role.bg} flex items-center justify-center`}
                  >
                    <span
                      className={`material-symbols-outlined text-lg ${role.color}`}
                    >
                      {role.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-sm font-bold ${value === role.id ? "text-primary" : "text-foreground"}`}
                    >
                      {role.label}
                    </p>
                    <p className="text-[10px] text-foreground/40 font-medium">
                      {role.id === "admin"
                        ? "Full access to dashboard"
                        : role.id === "editor"
                          ? "Can manage content & plans"
                          : "Handle requests & support"}
                    </p>
                  </div>
                  {value === role.id && (
                    <span className="material-symbols-outlined text-primary text-lg">
                      check
                    </span>
                  )}
                </div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const StaffModal = ({
  showAddModal,
  setShowAddModal,
  editingStaff,
  setEditingStaff,
  newStaff,
  setNewStaff,
  handleImageUpload,
  handleCreateStaff,
  isSubmitting,
  uploadError,
  submitError,
}: StaffModalProps) => {
  return (
    <AnimatePresence>
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-background border border-foreground/10 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-foreground/10 flex justify-between items-center bg-foreground/5">
              <h2 className="text-xl font-black text-foreground">
                {editingStaff ? "Edit Staff Details" : "Onboard New Staff"}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingStaff(null);
                }}
                className="size-8 flex items-center justify-center rounded-full hover:bg-foreground/10 text-foreground/50 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form
              onSubmit={handleCreateStaff}
              className="p-6 space-y-4 max-h-[70vh] overflow-y-auto"
            >
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="size-24 rounded-2xl bg-foreground/5 border-2 border-dashed border-foreground/20 flex items-center justify-center overflow-hidden relative group">
                  {newStaff.image ? (
                    <img
                      src={newStaff.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-3xl text-foreground/20">
                      add_a_photo
                    </span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                {uploadError && (
                  <p className="text-rose-500 text-[10px] font-bold">
                    {uploadError}
                  </p>
                )}
                <p className="text-[10px] font-medium text-foreground/40 text-center">
                  Image must be &lt; 200KB.
                  <br />
                  For best results, use a square aspect ratio.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-foreground/40 ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newStaff.name}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, name: e.target.value })
                    }
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40 transition-colors"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-foreground/40 ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    disabled={!!editingStaff}
                    value={newStaff.email}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, email: e.target.value })
                    }
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40 transition-colors disabled:opacity-50"
                    placeholder="john@kasaulicoder.com"
                  />
                </div>
              </div>

              {!editingStaff && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-foreground/40 ml-1">
                    Temporary Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newStaff.password}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, password: e.target.value })
                    }
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 relative">
                  <label className="text-[10px] font-black uppercase text-foreground/40 ml-1">
                    Role
                  </label>
                  <CustomRoleDropdown
                    value={newStaff.role}
                    onChange={(val) => setNewStaff({ ...newStaff, role: val })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-foreground/40 ml-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={newStaff.designation}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, designation: e.target.value })
                    }
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40 transition-colors"
                    placeholder="e.g. Lead Instructor"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-foreground/40 ml-1">
                  Bio / Role Description
                </label>
                <textarea
                  value={newStaff.roleDescription}
                  onChange={(e) =>
                    setNewStaff({
                      ...newStaff,
                      roleDescription: e.target.value,
                    })
                  }
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40 transition-colors min-h-24 resize-none"
                  placeholder="Tell us about their role…"
                />
              </div>

              {submitError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs font-bold text-center">
                  {submitError}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingStaff(null);
                  }}
                  className="flex-1 py-3 text-foreground font-black text-xs uppercase bg-foreground/5 hover:bg-foreground/10 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-2 py-3 bg-primary text-primary-content font-black text-xs uppercase rounded-xl hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting && (
                    <div className="size-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  )}
                  {editingStaff ? "Update Access" : "Grant Access"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default StaffModal;
