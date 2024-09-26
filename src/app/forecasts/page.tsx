import { H2 } from "@/components/ui/H2";
import FMIForecastCombinedChart from "@/components/FMIForecastCombinedChart";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forecasts",
  description: "Weather Forecast and Ticket Pricing.",
};


export default function Forecasts() {
  return (
    <>
      <section className="px-1 py-8">
        <section className="items-center flex justify-center px-8">
          <div className="space-y-3">
            <H2 className="text-center sm:text-start"> Weather Forecast and Pricing</H2>
          </div>
        </section>
      </section>
      <section className="space-y-3 text-center">
        <FMIForecastCombinedChart />
      </section>
    </>
  );
}