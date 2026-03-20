"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <AdminLayout activeTab="projects">
      <ProjectForm />
    </AdminLayout>
  );
}
