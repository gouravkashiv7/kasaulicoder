"use client";

import React, { useEffect, useState } from "react";
import GlobalHeader from "@/components/layout/GlobalHeader";
import GlobalFooter from "@/components/layout/GlobalFooter";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<"users" | "staff">("users");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
    designation: "",
    roleDescription: "",
    image: "",
  });
  const [uploadError, setUploadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint =
        activeTab === "users" ? "/api/admin/users" : "/api/admin/staff";
      const res = await fetch(endpoint);
      const result = await res.json();
      if (res.ok) {
        setData(result);
      } else {
        console.error(result.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 200 * 1024) {
      setUploadError("Image size must be less than 200KB");
      return;
    }

    setUploadError("");
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewStaff((prev) => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStaff),
      });
      const result = await res.json();

      if (res.ok) {
        setShowAddModal(false);
        setNewStaff({
          name: "",
          email: "",
          password: "",
          role: "admin",
          designation: "",
          roleDescription: "",
          image: "",
        });
        fetchData();
      } else {
        setSubmitError(result.error || "Failed to create staff");
      }
    } catch (err) {
      setSubmitError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-display">
      <GlobalHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full pt-32 px-6 pb-20">
        <div className="mb-10">
          <h1 className="text-4xl font-black mb-4 text-foreground">
            Admin Command Center
          </h1>
          <p className="text-foreground/60">
            Monitor users and manage your elite team
          </p>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${
              activeTab === "users"
                ? "bg-primary text-primary-content"
                : "bg-foreground/5 text-foreground/60 hover:text-foreground"
            }`}
          >
            Registered Users
          </button>
          <button
            onClick={() => setActiveTab("staff")}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${
              activeTab === "staff"
                ? "bg-secondary text-white"
                : "bg-foreground/5 text-foreground/60 hover:text-foreground"
            }`}
          >
            Team Members
          </button>

          {activeTab === "staff" && (
            <button
              onClick={() => setShowAddModal(true)}
              className="ml-auto px-6 py-2 bg-primary text-primary-content font-bold rounded-lg hover:brightness-110 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Add Staff
            </button>
          )}
        </div>

        <div className="bg-background/40 backdrop-blur-xl border border-foreground/10 rounded-2xl overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-20 text-center animate-pulse text-primary font-bold">
              Fetching records from the mainframe...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-foreground/5 border-b border-foreground/10">
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-foreground/50">
                      Name
                    </th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-foreground/50">
                      Email
                    </th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-foreground/50">
                      Role
                    </th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-foreground/50">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-foreground/50">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-foreground/10">
                  {data.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-foreground/5 transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-foreground">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 text-foreground/60">
                        {item.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                            item.role === "superadmin"
                              ? "bg-rose-500/20 text-rose-400"
                              : item.role === "admin"
                                ? "bg-amber-500/20 text-amber-400"
                                : "bg-primary/20 text-primary"
                          }`}
                        >
                          {item.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-foreground/60 text-sm">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`size-2 rounded-full ${
                              item.isActive !== false
                                ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                                : "bg-rose-500"
                            }`}
                          ></div>
                          <span className="text-xs text-foreground/80">
                            {item.isActive !== false ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {data.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-20 text-center text-foreground/50"
                      >
                        No records found in this sector.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <GlobalFooter />

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background border border-foreground/10 p-8 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-black text-foreground mb-6">
              Add New Staff Member
            </h2>

            {submitError && (
              <div className="bg-rose-500/10 text-rose-500 border border-rose-500/20 p-3 rounded-lg mb-6 text-sm font-bold">
                {submitError}
              </div>
            )}

            <form onSubmit={handleCreateStaff} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-2">
                    Name
                  </label>
                  <input
                    required
                    value={newStaff.name}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, name: e.target.value })
                    }
                    type="text"
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-2 focus:border-primary outline-none text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-2">
                    Email
                  </label>
                  <input
                    required
                    value={newStaff.email}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, email: e.target.value })
                    }
                    type="email"
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-2 focus:border-primary outline-none text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-2">
                    Temporary Password
                  </label>
                  <input
                    required
                    value={newStaff.password}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, password: e.target.value })
                    }
                    type="password"
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-2 focus:border-primary outline-none text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-2">
                    Role
                  </label>
                  <select
                    value={newStaff.role}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, role: e.target.value })
                    }
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-2 focus:border-primary outline-none text-foreground appearance-none"
                  >
                    <option
                      value="admin"
                      className="bg-background text-foreground"
                    >
                      Admin
                    </option>
                    <option
                      value="superadmin"
                      className="bg-background text-foreground"
                    >
                      Superadmin
                    </option>
                    <option
                      value="editor"
                      className="bg-background text-foreground"
                    >
                      Editor
                    </option>
                    <option
                      value="support"
                      className="bg-background text-foreground"
                    >
                      Support
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-2">
                  Designation
                </label>
                <input
                  value={newStaff.designation}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, designation: e.target.value })
                  }
                  type="text"
                  placeholder="e.g. Founder & CEO"
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-2 focus:border-primary outline-none text-foreground placeholder:text-foreground/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-2">
                  Role Description
                </label>
                <textarea
                  rows={2}
                  value={newStaff.roleDescription}
                  onChange={(e) =>
                    setNewStaff({
                      ...newStaff,
                      roleDescription: e.target.value,
                    })
                  }
                  placeholder="Short bio..."
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-2 focus:border-primary outline-none text-foreground placeholder:text-foreground/30"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-2">
                  Profile Image (Max 200KB)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-sm text-foreground/60 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary/20 file:text-primary hover:file:bg-primary/30"
                />
                {uploadError && (
                  <p className="text-rose-500 text-xs mt-2 font-bold">
                    {uploadError}
                  </p>
                )}
                {newStaff.image && (
                  <div className="mt-4 size-20 rounded-full border-2 border-primary overflow-hidden relative">
                    <img
                      src={newStaff.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-foreground/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2 rounded-lg font-bold text-foreground/60 hover:bg-foreground/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !!uploadError}
                  className="px-6 py-2 rounded-lg font-bold bg-primary text-primary-content hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating..." : "Create Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
