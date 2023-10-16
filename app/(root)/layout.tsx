import { ClerkProvider } from "@clerk/nextjs";
import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import LeftBar from "@/components/shared/LeftSidebar";
import RightBar from "@/components/shared/RightSidebar";
import TopBar from "@/components/shared/TopBar";
import BottomBar from "@/components/shared/BottomBar";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vichaar",
  description:
    "A Next.js 13 Social media Application which is called vichaar (thoughts)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <TopBar/>
          <main className="flex flex-row">
            <LeftBar/>
            <section className="main-container">
              <div className="w-full max-w-4xl">
                {children}
              </div>
            </section>
            <RightBar/>
          </main>
          <BottomBar/>
        </body>
      </html>
    </ClerkProvider>
  );
}
