import { H2 } from "@/components/ui/H2";
import { Metadata } from "next";
import VisitorData from "@/components/visitorData";
import WeatherHistoricalData from "@/components/WeatherHistoricalData";
import EnkoraData from "@/components/EnkoraData";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard for Weather and Visitor Data.",
};

export default function Dashboard() {
  return (
    <>
      <section className="px-1 py-8">
        <section className="items-center flex justify-center px-8">
          <div className="space-y-3">
            <H2 className="text-center sm:text-start">Welcome to Korkeasaari weather and visitor dashboard</H2>
          </div>
        </section>
      </section>
      <section className="space-y-3 text-center">
        <EnkoraData />
      </section>
    </>
  );
}