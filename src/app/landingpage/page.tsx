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
                className="absolute inset-0 flex flex-col md:flex-row justify-around items-center"
                style={{
                    background: "linear-gradient(135deg, #AAC929, #618985)",
                    zIndex: 10,
                }}
            >
                <div className="flex flex-col w-11/12 md:w-1/2 gap-10 items-center text-center">
                    <H1 className="text-white font-bold text-4xl md:text-5xl pb-4 border-b-4 border-white">
                        Tervetuloa Zoolyticsiin
                    </H1>
                    <p className="text-white text-lg md:text-xl max-w-[80%] leading-relaxed">
                        Analysoi sää- ja kävijätietoja vaivattomasti.
                    </p>
                    <Link href="/homepage">
                        <button
                            className="flex items-center justify-center text-xl bg-[#FA9F42] hover:bg-[#f08524] transition-all text-white font-semibold py-3 px-6 rounded shadow-md hover:shadow-lg"
                        >
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
                <div className="mt-14 w-1/2 flex items-center justify-center">
                    <Image
                        src={kuva.src}
                        width={500}
                        height={500}
                        alt="Kuva analyysikaavioista"
                        className="max-w-[100%] w-[30em] h-auto p-2 rounded-lg shadow-lg"
                    />
                </div>
            </section>
        </>
    );
}
