"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { SocialMediaAccount } from "./types";

interface SocialMediaManagementProps {
  accounts: SocialMediaAccount[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (account: SocialMediaAccount) => void;
  onDelete: (id: string) => void;
}

const SocialMediaManagement = ({
  accounts,
  loading,
  onAdd,
  onEdit,
  onDelete,
}: SocialMediaManagementProps) => {
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});

  const togglePassword = (id: string) => {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Optional: Add a toast notification here
  };

  return (
    <motion.div
      key="social-media"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black mb-2 text-foreground">
            Social Media Management
          </h1>
          <p className="text-foreground/50">
            Securely manage platform credentials and team assignments.
          </p>
        </div>
        <button
          onClick={onAdd}
          className="px-6 py-2 bg-primary text-primary-content font-bold rounded-lg hover:brightness-110 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add Account
        </button>
      </div>

      <div className="bg-background/40 backdrop-blur-xl border border-foreground/10 rounded-2xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-20 text-center animate-pulse text-primary font-bold">
            Syncing platform data…
          </div>
        ) : accounts.length === 0 ? (
          <div className="p-20 text-center text-foreground/50">
            No social media accounts configured. Add your first one to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-foreground/5 border-b border-foreground/10">
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-foreground/50">Platform</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-foreground/50">Credentials</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-foreground/50">Managed By</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-foreground/50">Status</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-foreground/50">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/10">
                {accounts.map((account) => (
                  <tr key={account._id} className="hover:bg-foreground/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined">
                            {account.platform.toLowerCase() === "youtube" ? "play_circle" : 
                             account.platform.toLowerCase() === "twitter" ? "close" : 
                             account.platform.toLowerCase() === "facebook" ? "facebook" : "public"}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{account.platform}</p>
                          {account.platformUrl && (
                            <a href={account.platformUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline">
                              View Profile
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-foreground/40 font-medium">U:</span>
                          <span className="text-foreground font-bold">{account.username}</span>
                          <button onClick={() => copyToClipboard(account.username)} className="text-foreground/20 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-sm">content_copy</span>
                          </button>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-foreground/40 font-medium">P:</span>
                          <span className="text-foreground font-mono">
                            {showPasswords[account._id] ? account.password : "••••••••"}
                          </span>
                          <button onClick={() => togglePassword(account._id)} className="text-foreground/20 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-sm">
                              {showPasswords[account._id] ? "visibility_off" : "visibility"}
                            </span>
                          </button>
                          {showPasswords[account._id] && (
                            <button onClick={() => copyToClipboard(account.password || "")} className="text-foreground/20 hover:text-primary transition-colors">
                              <span className="material-symbols-outlined text-sm">content_copy</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {account.managedBy?.image ? (
                          <img src={account.managedBy.image} alt="" className="size-6 rounded-full object-cover" />
                        ) : (
                          <div className="size-6 rounded-full bg-foreground/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[12px] opacity-40">person</span>
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-bold text-foreground">{account.managedBy?.name || "Unassigned"}</p>
                          <p className="text-[10px] text-foreground/40">{account.managedBy?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${account.isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}>
                        {account.isActive ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEdit(account)}
                          className="p-2 hover:bg-foreground/10 rounded-lg text-foreground/50 hover:text-foreground transition-all"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button
                          onClick={() => onDelete(account._id)}
                          className="p-2 hover:bg-rose-500/10 rounded-lg text-rose-500/50 hover:text-rose-500 transition-all"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SocialMediaManagement;
