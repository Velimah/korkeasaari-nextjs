import me from "@/assets/untitled.jpg";
import { H1 } from "@/components/ui/H1";
import { H2 } from "@/components/ui/H2";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Korkeasaari data dashboard",
};


import WeatherData from "@/components/WeatherData";
import VisitorData from "@/components/visitorData";
import WeatherHistoricalData from "@/components/WeatherHistoricalData";

export default function Home() {
  return (
    <>
    <section className="space-y-16 px-1 py-8">
      <section className="grid grid-cols-1 items-center gap-8 sm:grid-cols-2">
        <div className="space-y-3">
          <H1 className="text-center sm:text-start">Welcome to Korkeasaari Weather and visitor data dashboard 👋</H1>
          <p className="text-center sm:text-start">
            You can find all the information about the weather and visitor data
          </p>
        </div>
        <div className="flex justify-center">
          <Image
            src={me}
            alt="A cat"
            height={300}
            width={300}
            className="aspect-square rounded border-2 object-cover shadow-md dark:border-foreground"
          />
        </div>
      </section>
    </section>
          <section className="space-y-3 text-center">
          <H2>Data</H2>
         <WeatherData />
         <VisitorData />
         <WeatherHistoricalData />
         
        </section>
        </>
  );
}