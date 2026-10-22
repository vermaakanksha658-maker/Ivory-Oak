import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ProjectForm } from "@/components/admin/forms/project-form";

export default function NewProjectPage() {
  return (
    <div>
      <AdminPageHeader
        title="New project"
        description="Add a completed project to the portfolio."
        backHref="/admin/projects"
      />
      <ProjectForm project={null} />
    </div>
  );
}
