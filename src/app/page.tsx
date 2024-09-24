import { H1 } from "@/components/ui/H1";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Korkeasaari dashboard",
};


import WeatherData from "@/components/WeatherData";
import VisitorData from "@/components/visitorData";
import WeatherHistoricalData from "@/components/WeatherHistoricalData";

export default function Home() {
  return (
    <>
    <section className="px-1 py-8">
      <section className="items-center flex justify-center px-8">
        <div className="space-y-3">
          <H1 className="text-center sm:text-start">Welcome to Korkeasaari weather and visitor dashboard</H1>
        </div>
      </section>
      </section>
      <section className="space-y-3 text-center">
        <WeatherData />
        <WeatherHistoricalData />
        <VisitorData />
      </section>
    </>
  );
}