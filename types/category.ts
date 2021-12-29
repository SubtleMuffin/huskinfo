import { IconId } from "@/types/icon";

export interface Category {
  slug: string;
  title: string;
  links: Link[];
  pages?: Link[];
}

export interface Link {
  name: string;
  href: string;
  description: string;
  icon?: IconId;
}
