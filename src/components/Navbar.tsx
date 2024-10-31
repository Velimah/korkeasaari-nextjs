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
              <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>
                Koti
              </NavigationMenuLink>
              <NavigationMenuLink href="/charts" className={navigationMenuTriggerStyle()}>
                Charts
              </NavigationMenuLink>

              <NavigationMenuLink href="/analytics" className={navigationMenuTriggerStyle()}>
                Analyysit
              </NavigationMenuLink>
              <NavigationMenuLink href="/forecasts" className={navigationMenuTriggerStyle()}>
                Ennusteet
              </NavigationMenuLink>
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