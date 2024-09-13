import type { NavbarLinks } from "../types/types";

export const allowedFileTypes = [
  "image/jpeg", // JPEG images
  "image/jpg", // JPEG images
  "image/png", // PNG images
  "image/gif", // GIF images
];
export const allowedExtensions = ".jpg, .jpeg, .png, .gif";

export const Priviledges = {
  //SalesAppAdmin
  "/dashboard": 1000,
  "/my-issues": 1000,
  "/issue": 1000,
  "/triage": 2000,
  "/resolve": 3000,
  "/admin": 5000,
  "/admin/all-issues": 5000,
  "/admin/products": 5000,
  "/admin/users": 5000,
};

export const DashboardLinks : NavbarLinks[] = [
  {
    label: "Dashboard",
    image: "",
    desc: "Dashboard",
    href: "/dashboard",
    minRole: Priviledges["/dashboard"],
    sublinks: [],
  },
  {
    label: "My Issues",
    image: "",
    desc: "My Issues",
    href: "/my-issues",
    minRole: Priviledges["/my-issues"],
    sublinks: [],
  },
  {
    label: "Triage",
    image: "",
    desc: "Triage",
    href: "/triage",
    minRole: Priviledges["/triage"],
    sublinks: [],
  },
  {
    label: "Resolve",
    image: "",
    desc: "Resolve",
    href: "/resolve",
    minRole: Priviledges["/resolve"],
    sublinks: [],
  },
  {
    label: "Admin",
    image: "",
    desc: "Admin",
    href: "#",
    minRole: Priviledges["/admin"],
    sublinks: [
      {
        label: "All Issues",
        image: "",
        desc: "All Issues",
        href: "/admin/all-issues",
        minRole: Priviledges["/admin/all-issues"],
      },
      {
        label: "Products",
        image: "",
        desc: "Products",
        href: "/admin/products",
        minRole: Priviledges["/admin/products"],
      },
      {
        label: "Users",
        image: "",
        desc: "Users",
        href: "/admin/users",
        minRole: Priviledges["/admin/users"],
      },
    ],

  },

];
