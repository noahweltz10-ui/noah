export type NavItem = {
  href: string;
  label: string;
  ownerOnly?: boolean;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    title: "overview",
    items: [{ href: "/dashboard", label: "home" }],
  },
  {
    title: "run the shop",
    items: [
      { href: "/dashboard/orders", label: "orders" },
      { href: "/dashboard/inventory", label: "inventory & pricing" },
      { href: "/dashboard/support", label: "support inbox" },
      { href: "/dashboard/reviews", label: "reviews" },
    ],
  },
  {
    title: "grow the drop",
    items: [
      { href: "/dashboard/customers", label: "customers" },
      { href: "/dashboard/discounts", label: "discount codes" },
      { href: "/dashboard/drops", label: "drops & waitlist" },
      { href: "/dashboard/marketing", label: "marketing" },
    ],
  },
  {
    title: "admin",
    items: [
      { href: "/dashboard/staff", label: "staff & access", ownerOnly: true },
      { href: "/dashboard/changelog", label: "changelog" },
      { href: "/dashboard/settings", label: "settings" },
      { href: "/dashboard/shopify", label: "shopify admin" },
    ],
  },
];
