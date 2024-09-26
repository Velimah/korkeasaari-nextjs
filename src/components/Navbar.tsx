import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
import zoolytics from "@/assets/zoolytics.png";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-3 px-3 py-4">
        <Image className="pt-2" alt="logo of the website" src={zoolytics} height={50} />
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem className="flex gap-6">
              <Link href="/">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Home
                </NavigationMenuLink>
              </Link>
              <Link href="/analytics">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Analytics
                </NavigationMenuLink>
              </Link>
              <Link href="/forecasts">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Forecasts
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}