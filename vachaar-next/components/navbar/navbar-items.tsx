"use client";

import { siteConfig } from "@/config/site";
import { NavbarItem, NavbarMenuItem } from "@nextui-org/react";
import React from "react";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import { link as linkStyles } from "@nextui-org/theme";
import { useReadLocalStorage } from "usehooks-ts";

interface Props {
  isMobile?: boolean;
}

const NavbarItems: React.FC<Props> = (props) => {
  const isLoggedIn = useReadLocalStorage("logged_in");
  const items = isLoggedIn
    ? siteConfig.navItems.authenticated
    : siteConfig.navItems.unauthenticated;
  if (props.isMobile) {
    return (
      <div className="mx-4 mt-2 flex flex-col gap-2">
        {items.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link color={"foreground"} href={item.href} size="lg">
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </div>
    );
  }
  return (
    <ul className="hidden lg:flex gap-4 justify-start ml-2">
      {items.map((item) => (
        <NavbarItem key={item.href}>
          <Link
            className={clsx(
              linkStyles({ color: "foreground" }),
              "data-[active=true]:text-primary data-[active=true]:font-medium"
            )}
            color="foreground"
            href={item.href}
          >
            {item.label}
          </Link>
        </NavbarItem>
      ))}
    </ul>
  );
};

export default NavbarItems;
