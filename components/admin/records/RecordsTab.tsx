"use client";

import { type ReactNode, useState } from "react";
import RecordsManager, { type RecordsTabId } from "./RecordsManager";

interface RecordsTabProps {
  tab: RecordsTabId;
  isDirector: boolean;
  isSuperAdmin: boolean;
  // The director view of this tab
  children: ReactNode;
}

// A non-director superadmin only gets the delete view. A superadmin who is also
// a director keeps the director view and can switch to the delete view. A
// plain director only ever sees the director view.
const RecordsTab = ({
  tab,
  isDirector,
  isSuperAdmin,
  children,
}: RecordsTabProps) => {
  const [manage, setManage] = useState(false);

  if (!isDirector) return isSuperAdmin ? <RecordsManager tab={tab} /> : null;
  if (!isSuperAdmin) return <>{children}</>;

  return (
    <>
      <div className="flex gap-2 mb-6" role="tablist">
        {[
          { id: false, label: "Director view" },
          { id: true, label: "Manage records" },
        ].map((o) => (
          <button
            key={o.label}
            type="button"
            role="tab"
            aria-selected={manage === o.id}
            onClick={() => setManage(o.id)}
            className={`px-4 py-2 rounded-xl text-sm font-bold ${
              manage === o.id
                ? "bg-primary text-primary-content"
                : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
      {manage ? <RecordsManager tab={tab} /> : children}
    </>
  );
};

export default RecordsTab;
