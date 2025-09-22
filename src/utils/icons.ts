import { Trash, Edit, Eye } from "lucide-vue-next";
import type { Component } from "vue";

export type ActionIcon = "trash" | "edit" | "eye";

export const iconMap: Record<ActionIcon, Component> = {
  trash: Trash,
  edit: Edit,
  eye: Eye,
};
