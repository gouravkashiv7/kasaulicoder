"use client";

import { useState } from "react";
import FinanceFormModal, {
  fieldClass,
  labelClass,
} from "@/components/admin/director/modals/FinanceFormModal";
import { squareAvatar } from "@/lib/imageResize";

export interface ProfileValues {
  name: string;
  email: string;
  designation: string;
  roleDescription: string;
  image: string;
}

interface ProfileEditModalProps {
  title: string;
  initial: ProfileValues;
  // Photo, designation and role description; not every role may edit these
  showProfileText: boolean;
  onClose: () => void;
  // Resolves to an error message, or null when saved
  onSave: (
    values: ProfileValues,
    imageChanged: boolean,
  ) => Promise<string | null>;
}

// Edit form for one team member's details, used for your own profile and for
// the members an admin looks after.
const ProfileEditModal = ({
  title,
  initial,
  showProfileText,
  onClose,
  onSave,
}: ProfileEditModalProps) => {
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (patch: Partial<ProfileValues>) =>
    setValues((v) => ({ ...v, ...patch }));

  const pickPhoto = async (file: File | undefined) => {
    if (!file) return;
    setError("");
    try {
      set({ image: await squareAvatar(file) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not use that photo");
    }
  };

  const submit = async () => {
    setSaving(true);
    setError("");
    const message = await onSave(values, values.image !== initial.image);
    setSaving(false);
    if (message) setError(message);
    else onClose();
  };

  return (
    <FinanceFormModal
      open
      title={title}
      submitLabel="Save changes"
      saving={saving}
      error={error}
      disabled={!values.name.trim() || !values.email.trim()}
      onClose={onClose}
      onSubmit={submit}
    >
      {showProfileText && (
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-2xl border border-foreground/10 bg-foreground/5 overflow-hidden flex items-center justify-center shrink-0">
            {values.image ? (
              // biome-ignore lint/performance/noImgElement: data URL preview
              <img
                src={values.image}
                alt="Profile"
                className="size-full object-cover"
              />
            ) : (
              <span className="material-symbols-outlined text-2xl text-foreground/30">
                person
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <label
              htmlFor="profile-edit-photo"
              className="cursor-pointer px-4 py-2 rounded-xl bg-primary/10 text-primary text-xs font-black hover:bg-primary/20"
            >
              {values.image ? "Change photo" : "Upload photo"}
            </label>
            <input
              id="profile-edit-photo"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                pickPhoto(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            {values.image && (
              <button
                type="button"
                onClick={() => set({ image: "" })}
                className="px-4 py-2 rounded-xl text-xs font-black text-rose-500 hover:bg-rose-500/10"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="profile-edit-name" className={labelClass}>
          Full name
        </label>
        <input
          id="profile-edit-name"
          value={values.name}
          onChange={(e) => set({ name: e.target.value })}
          className={fieldClass}
          required
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="profile-edit-email" className={labelClass}>
          Email address
        </label>
        <input
          id="profile-edit-email"
          type="email"
          value={values.email}
          onChange={(e) => set({ email: e.target.value })}
          className={fieldClass}
          required
        />
      </div>
      {showProfileText && (
        <>
          <div className="space-y-1.5">
            <label htmlFor="profile-edit-designation" className={labelClass}>
              Designation
            </label>
            <input
              id="profile-edit-designation"
              maxLength={100}
              value={values.designation}
              onChange={(e) => set({ designation: e.target.value })}
              placeholder="e.g. Co-Founder & CTO"
              className={fieldClass}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="profile-edit-bio" className={labelClass}>
              Role description
            </label>
            <textarea
              id="profile-edit-bio"
              rows={4}
              maxLength={500}
              value={values.roleDescription}
              onChange={(e) => set({ roleDescription: e.target.value })}
              className={`${fieldClass} resize-y`}
            />
          </div>
        </>
      )}
    </FinanceFormModal>
  );
};

export default ProfileEditModal;
