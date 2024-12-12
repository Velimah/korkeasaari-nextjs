import AnalyticsCharts from "@/app/analytics/AnalyticsCharts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analyysit",
  description: "Sää ja Kävijämäärien analyysit.",
};


export default function Analytics() {

  return (
    <>
      <section className="space-y-3 text-center">
        <AnalyticsCharts />
      </section>
    </>
  );
}