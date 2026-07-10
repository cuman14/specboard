import type { Artifact } from "@/types";
import { Code, FileText, ListChecks, Palette } from "lucide-react";
import type { ElementType } from "react";

export const artifactIcons: Record<Artifact["name"], ElementType> = {
  proposal: FileText,
  specs: Code,
  design: Palette,
  tasks: ListChecks,
};
