import { H2 } from "@/components/ui/H2";
import AnalyticsCharts from "@/app/analytics/AnalyticsCharts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analyysit",
  description: "Sää ja Kävijämäärien analyysit.",
};


export default function Analytics() {

  return (
    <>

      <div className="flex justify-center items-center py-8">
        <H2 className="text-center sm:text-start">Sään ja Kävijämäärien analyysit</H2>
      </div>

      <section className="space-y-3 text-center">
        <AnalyticsCharts />
      </section>
    </>
  );
}