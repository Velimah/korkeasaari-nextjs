"use client";
import ThemeToggle from "@/components/ThemeToggle";
import Image from "next/image";
import { usePathname } from "next/navigation";
import zoolytics from "@/assets/zoolytics.png";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

export default function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/landingpage";

  return (
    <header
      className="sticky top-0 z-20 bg-white dark:bg-black border-b-4"
      style={{ borderBottomColor: "rgba(170, 201, 41, 0.5)" }}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between items-center gap-3 px-3 py-4">

        <Link href="/homepage">
          <Image
            className="pt-2"
            alt="logo of the website"
            src={zoolytics}
            height={40}
          />
        </Link>

        {!isHomePage && (
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem className="flex gap-6">
                <NavigationMenuLink
                  href="/homepage"
                  className={navigationMenuTriggerStyle()}
                >
                  Koti
                </NavigationMenuLink>
                <NavigationMenuLink
                  href="/charts"
                  className={navigationMenuTriggerStyle()}
                >
                  Tilastot
                </NavigationMenuLink>
                <NavigationMenuLink
                  href="/analytics"
                  className={navigationMenuTriggerStyle()}
                >
                  Analyysit
                </NavigationMenuLink>
                <NavigationMenuLink
                  href="/forecasts"
                  className={navigationMenuTriggerStyle()}
                >
                  Ennusteet
                </NavigationMenuLink>
              </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>
        )}

        <div className="flex items-center gap-4">
          {!isHomePage && (
            <ThemeToggle />
          )}
        </div>
      </div>
    </header>
  );
}
