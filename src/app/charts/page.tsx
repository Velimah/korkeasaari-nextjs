import { H2 } from "@/components/ui/H2";
import { Metadata } from "next";
import FMIObservationsCombinedChart from "@/app/charts/FMIObservationsCombinedChart";
import EnkoraVisitorBarChart from "@/app/charts/EnkoraVisitorBarChart";

export const metadata: Metadata = {
  title: "Charts",
  description: "Tervetuloa.",
};

export default function Charts() {
  return (
    <>
      <div className="flex justify-center items-center py-8">
        <H2 className="text-center sm:text-start">Keksikää joku nimi :D</H2>
      </div>
      <section className="space-y-3 text-center">
        <EnkoraVisitorBarChart />
        <FMIObservationsCombinedChart />
      </section>
    </>
  );
}