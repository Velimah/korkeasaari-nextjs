import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
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
    <header className="sticky top-0 z-10 bg-white dark:bg-black">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-3 px-3 py-4">
        <Image className="pt-2" alt="logo of the website" src={zoolytics} height={50} />
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem className="flex gap-6">
              <Link href="/">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Koti
                </NavigationMenuLink>
              </Link>
              <Link href="/analytics">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Analyysit
                </NavigationMenuLink>
              </Link>
              <Link href="/forecasts">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Ennusteet
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