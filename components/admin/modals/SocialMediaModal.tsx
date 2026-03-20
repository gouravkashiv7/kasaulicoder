"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SocialMediaModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  editingAccount: any;
  setEditingAccount: (account: any) => void;
  staffList: any[];
  onSave: (data: any) => void;
  isSubmitting: boolean;
  error?: string;
}

const SocialMediaModal = ({
  showModal,
  setShowModal,
  editingAccount,
  setEditingAccount,
  staffList,
  onSave,
  isSubmitting,
  error,
}: SocialMediaModalProps) => {
  const PREDEFINED_PLATFORMS = ["Twitter", "Facebook", "Instagram", "LinkedIn", "YouTube"];
  
  const [formData, setFormData] = useState({
    platform: editingAccount?.platform && PREDEFINED_PLATFORMS.includes(editingAccount.platform) 
      ? editingAccount.platform 
      : (editingAccount?.platform ? "Other" : "Twitter"),
    customPlatform: editingAccount?.platform && !PREDEFINED_PLATFORMS.includes(editingAccount.platform)
      ? editingAccount.platform
      : "",
    username: editingAccount?.username || "",
    password: editingAccount?.password || "",
    managedBy: editingAccount?.managedBy?._id || editingAccount?.managedBy || "",
    platformUrl: editingAccount?.platformUrl || "",
    isActive: editingAccount?.isActive !== false,
  });

  React.useEffect(() => {
    if (editingAccount) {
      const isPredefined = PREDEFINED_PLATFORMS.includes(editingAccount.platform);
      setFormData({
        platform: isPredefined ? editingAccount.platform : "Other",
        customPlatform: isPredefined ? "" : editingAccount.platform,
        username: editingAccount.username,
        password: editingAccount.password || "",
        managedBy: editingAccount.managedBy?._id || editingAccount.managedBy || "",
        platformUrl: editingAccount.platformUrl || "",
        isActive: editingAccount.isActive !== false,
      });
    } else {
      setFormData({
        platform: "Twitter",
        customPlatform: "",
        username: "",
        password: "",
        managedBy: "",
        platformUrl: "",
        isActive: true,
      });
    }
  }, [editingAccount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      platform: formData.platform === "Other" ? formData.customPlatform : formData.platform,
    };
    onSave(submissionData);
  };

  return (
    <AnimatePresence>
      {showModal && (
        <div key="social-media-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-background border border-foreground/10 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-foreground/10 flex justify-between items-center bg-foreground/5">
              <h2 className="text-xl font-black text-foreground">
                {editingAccount ? "Edit Social Account" : "Add Social Account"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingAccount(null);
                }}
                className="size-8 flex items-center justify-center rounded-full hover:bg-foreground/10 text-foreground/50 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className={`grid ${formData.platform === "Other" ? "grid-cols-1" : "grid-cols-2"} gap-4 transition-all`}>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-foreground/40 ml-1">Platform</label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40 appearance-none"
                  >
                    <option value="Twitter">Twitter (X)</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {formData.platform === "Other" && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-1.5"
                  >
                    <label className="text-[10px] font-black uppercase text-foreground/40 ml-1">Platform Name</label>
                    <input
                      type="text"
                      required
                      value={formData.customPlatform}
                      onChange={(e) => setFormData({ ...formData, customPlatform: e.target.value })}
                      className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40"
                      placeholder="Enter platform name"
                    />
                  </motion.div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-foreground/40 ml-1">Username</label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40"
                    placeholder="@username"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-foreground/40 ml-1">Password</label>
                <input
                  type="text"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-foreground/40 ml-1">Managed By</label>
                <select
                  required
                  value={formData.managedBy}
                  onChange={(e) => setFormData({ ...formData, managedBy: e.target.value })}
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40 appearance-none"
                >
                  <option value="">Select Staff Member</option>
                  {staffList.map((staff) => (
                    <option key={staff._id} value={staff._id}>
                      {staff.name} ({staff.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-foreground/40 ml-1">Platform URL (Optional)</label>
                <input
                  type="url"
                  value={formData.platformUrl}
                  onChange={(e) => setFormData({ ...formData, platformUrl: e.target.value })}
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40"
                  placeholder="https://platform.com/profile"
                />
              </div>

              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs font-bold text-center">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingAccount(null);
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
                  {editingAccount ? "Update Account" : "Save Account"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SocialMediaModal;
