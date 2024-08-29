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
  "/issue": 1000,
  "/admin": 5000,
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
    label: "Admin",
    image: "",
    desc: "Admin",
    href: "#",
    minRole: Priviledges["/admin"],
    sublinks: [
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
