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
  "/products": 1000,
  "/users": 5000,
};

export const DashboardLinks : NavbarLinks[] = [
  {
    label: "Dashboard",
    image: "",
    desc: "Dashboard",
    href: "/dashboard",
    minRole: Priviledges["/dashboard"],
  },
  {
    label: "Products",
    image: "",
    desc: "Products",
    href: "/products",
    minRole: Priviledges["/products"],
  },
  {
    label: "Users",
    image: "",
    desc: "Users",
    href: "/users",
    minRole: Priviledges["/users"],
  },
];
