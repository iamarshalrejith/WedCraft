"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import TemplateForm from "@/components/admin/TemplateForm";
import { Template } from "@/data/templates";
import { Loader2 } from "lucide-react";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default function EditTemplatePage({ params }: EditPageProps) {
  const { id } = use(params);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.replace("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role !== "admin") return;
    fetch(`/api/admin/templates/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setTemplate(data);
      })
      .catch(() => setError("Failed to load template"))
      .finally(() => setLoading(false));
  }, [id, user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-red-500">{error || "Template not found"}</p>
      </div>
    );
  }

  return <TemplateForm mode="edit" templateId={id} initialData={template} />;
}