import { H2 } from "@/components/ui/H2";
import { Metadata } from "next";
import kuva from './kuva.png';
import Link from "next/link";

export const metadata: Metadata = {
  title: "Koti",
  description: "Tervetuloa.",
};

export default function Home() {
    return (
        <>
            <section
                className="flex flex justify-around flex-grow"
                style={{ backgroundColor: "#AAC929" }}
            >
                <div className="flex flex-col gap-10 items-center pt-92 justify-center pl-8">
                    <H2 className="text-white text-center max-w-[75%]">
                        Tervetuloa Zoolytics! Datan analysointi sivu juuri sopiva yrityksellesi!
                    </H2>
                    <Link href="/analytics"> {/* Wrap button with Link */}
                        <button className="flex items-center bg-green-700 hover:bg-green-600 transition text-white font-bold py-2 px-4 rounded">
                            Analyysit
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="ml-2 w-4 h-4 text-white" // Adjust size and color
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4l8 8-8 8" />
                            </svg>
                        </button>
                    </Link>
                </div>
                <div className="text-white text-center flex items-center justify-center">
                    <img
                        src={kuva.src}
                        alt="Descriptive text for the image"
                        className="max-w-[100%] h-auto"
                    />
                </div>
            </section>
        </>
    );
}
