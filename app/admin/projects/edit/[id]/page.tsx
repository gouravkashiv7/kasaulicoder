"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import ProjectForm from "@/components/admin/ProjectForm";
import { Project } from "@/components/admin/types";

export default function EditProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        const found = data.find((p: Project) => p._id === id);
        setProject(found || null);
      } catch (err) {
        console.error("Failed to fetch project:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProject();
  }, [id]);

  return (
    <AdminLayout activeTab="projects">
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary/20">refresh</span>
        </div>
      ) : project ? (
        <ProjectForm project={project} isEditing />
      ) : (
        <div className="text-center py-20">
          <h2 className="text-xl font-bold">Project not found</h2>
        </div>
      )}
    </AdminLayout>
  );
}
