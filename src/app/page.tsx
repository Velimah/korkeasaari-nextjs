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
                className="absolute inset-0 flex justify-around items-center"
                style={{ backgroundColor: "#AAC929", zIndex: 10 }}
            >
                <div className="flex flex-col gap-10 items-center justify-center">
                    <H2 className="text-white text-center pb-6 max-w-[75%] border-b-4 border-white">
                        Tervetuloa Zoolytics! Datan analysointi sivu juuri sopiva sinulle!
                    </H2>
                    <Link href="/analytics">
                        <button className="flex items-center bg-green-700 hover:bg-green-600 transition text-white font-bold py-2 px-4 rounded">
                            Aloita tästä!
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="ml-2 w-4 h-4 text-white"
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
                        alt=""
                        className="max-w-[100%] h-auto"
                    />
                </div>
            </section>
        </>
    );
}
