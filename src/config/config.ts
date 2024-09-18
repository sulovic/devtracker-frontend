import type { NavbarLinks } from "../types/types";

export const allowedFileTypes = [
  "image/jpeg", // JPEG images
  "image/jpg", // JPEG images
  "image/png", // PNG images
  "image/gif", // GIF images
];
export const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];

export const maxNoOfFiles = 5;

export const maxFileSize = 10 * 1024 * 1024;

export const Priviledges = {
  "/dashboard": [1001, 2001, 3101, 3201, 3301, 3401, 5001],
  "/my-issues": [1001, 2001, 3101, 3201, 3301, 3401, 5001],
  "/issue": [1001, 2001, 3101, 3201, 3301, 3401, 5001],
  "/triage": [2001, 5001],
  "/resolve": [3101, 3201, 3301, 3401, 5001],
  "/admin": [5001],
  "/admin/all-issues": [5001],
  "/admin/products": [5001],
  "/admin/users": [5001],
};

export const DashboardLinks: NavbarLinks[] = [
  {
    label: "Dashboard",
    image: "",
    desc: "Dashboard",
    href: "/dashboard",
    authRoles: Priviledges["/dashboard"],
    sublinks: [],
  },
  {
    label: "My Issues",
    image: "",
    desc: "My Issues",
    href: "/my-issues",
    authRoles: Priviledges["/my-issues"],
    sublinks: [],
  },
  {
    label: "Triage",
    image: "",
    desc: "Triage",
    href: "/triage",
    authRoles: Priviledges["/triage"],
    sublinks: [],
  },
  {
    label: "Resolve",
    image: "",
    desc: "Resolve",
    href: "/resolve",
    authRoles: Priviledges["/resolve"],
    sublinks: [],
  },
  {
    label: "Admin",
    image: "",
    desc: "Admin",
    href: "#",
    authRoles: Priviledges["/admin"],
    sublinks: [
      {
        label: "All Issues",
        image: "",
        desc: "All Issues",
        href: "/admin/all-issues",
        authRoles: Priviledges["/admin/all-issues"],
      },
      {
        label: "Products",
        image: "",
        desc: "Products",
        href: "/admin/products",
        authRoles: Priviledges["/admin/products"],
      },
      {
        label: "Users",
        image: "",
        desc: "Users",
        href: "/admin/users",
        authRoles: Priviledges["/admin/users"],
      },
    ],
  },
];
