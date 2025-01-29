export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "واچار",
  description: "خرید و فروش کالای دست دوم، بدون دردسر",
  navItems: {
    authenticated: [
      {
        label: "افزودن آگهی",
        href: "/new",
      },
      {
        label: "پروفایل",
        href: "/profile",
      },
    ],
    unauthenticated: [
      {
        label: "ورود",
        href: "/login",
      },
      {
        label: "ثبت‌نام",
        href: "/register",
      },
    ],
    common: [],
  },
};
