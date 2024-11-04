import { H2 } from "@/components/ui/H2";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Koti",
  description: "Tervetuloa.",
};

export default function Home() {
    return (
        <>
            <section className="justify-between px-1 py-8">
                <section className="items-center flex justify-center px-8">
                    <div className="space-y-3">
                        <H2 className="text-center sm:text-start">LANDING PAGE! Tervetuloa</H2>
                    </div>
                </section>
                <div className="bg-black h-60 text-white text-center flex items-center justify-center">
                    heLLO
                </div>
            </section>
        </>
    );
}
