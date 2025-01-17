export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "واچار",
  description: "خرید و فروش کالای دست دوم، بدون دردسر",
  navItems: [
    {
      label: "ورود",
      href: "/login",
    },
    {
      label: "ثبت‌نام",
      href: "/register",
    },
    {
      label: "افزودن آگهی",
      href: "/new",
    },
  ],
};
