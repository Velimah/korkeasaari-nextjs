import { H2 } from "@/components/ui/H2";
import AnalyticsCharts from "@/components/AnalyticsCharts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analyysit",
  description: "Sää ja Kävijämäärien analyysit.",
};


export default function Analytics() {

  return (
    <>
      <section className="px-1 py-8">
        <section className="items-center flex justify-center px-8">
          <div className="space-y-3">
            <H2 className="text-center sm:text-start">Sää ja Kävijämäärien analyysit</H2>
          </div>
        </section>
      </section>
      <section className="space-y-3 text-center">
        <AnalyticsCharts />
      </section>
    </>
  );
}