import { H2 } from "@/components/ui/H2";
import { Metadata } from "next";
import FMIObservationsCombinedChart from "@/app/charts/FMIObservationsCombinedChart";
import EnkoraVisitorBarChart from "@/app/charts/EnkoraVisitorBarChart";

export const metadata: Metadata = {
  title: "Tilastot",
  description: "Sää ja Kävijämäärien tilastot.",
};

export default function Charts() {
  return (
    <>
      <section className="space-y-3 text-center">
        <EnkoraVisitorBarChart />
        <FMIObservationsCombinedChart />
      </section>
    </>
  );
}