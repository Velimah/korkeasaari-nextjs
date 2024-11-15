import { H1 } from "@/components/ui/H1";
import { Metadata } from "next";
import kuva from '@/assets/kuva.png';
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Landing Page",
    description: "Welcome to the landing page.",
};

export default function Page() {
    return (
        <>
            <section
                className="absolute inset-0 flex justify-around items-center"
                style={{ backgroundColor: "#AAC929", zIndex: 10 }}
            >
                <div className="flex flex-col w-1/2 gap-10 items-center justify-center">
                    <H1 className="text-white text-center pb-6 max-w-[75%] border-b-4 border-white">
                        Tervetuloa Zoolyticsiin. Analysoi tietoja juuri sinulle sopivalla sivustolla!
                    </H1>
                    <Link href="/homepage">
                        <button className="flex items-center text-xl bg-green-700 hover:bg-green-600 transition text-white font-bold py-2 px-4 rounded">
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
                <div className="text-white text-center w-1/2 flex items-center justify-center">
                    <Image
                        src={kuva.src}
                        width={500}
                        height={500}
                        alt=""
                        className="max-w-[100%] w-[30em] h-auto"
                    />


                </div>
            </section>
        </>
    );
}
