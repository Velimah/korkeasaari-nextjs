import { H2 } from "@/components/ui/H2";
import { Metadata } from "next";
import FMIObservationsCombinedChart from "@/components/FMIObservationsCombinedChart";
import EnkoraVisitorBarChart from "@/components/EnkoraVisitorBarChart";

export const metadata: Metadata = {
  title: "Koti",
  description: "Tervetuloa.",
};

export default function Dashboard() {
  return (
    <>
      <section className="px-1 py-8">
        <section className="items-center flex justify-center px-8">
          <div className="space-y-3">
            <H2 className="text-center sm:text-start">Tervetuloa</H2>
          </div>
        </section>
      </section>
      <section className="space-y-3 text-center">
        <FMIObservationsCombinedChart />
        <EnkoraVisitorBarChart />
      </section>
    </>
  );
}