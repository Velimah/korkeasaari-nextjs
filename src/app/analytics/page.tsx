import { H2 } from "@/components/ui/H2";
import AnalyticsCharts from "@/components/AnalyticsCharts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Analytics for Weather and Visitor Data.",
};


export default function Analytics() {

  return (
    <>
      <section className="px-1 py-8">
        <section className="items-center flex justify-center px-8">
          <div className="space-y-3">
            <H2 className="text-center sm:text-start">Weather and Visitor Analytics</H2>
          </div>
        </section>
      </section>
      <section className="space-y-3 text-center">
        <AnalyticsCharts />
      </section>
    </>
  );
}