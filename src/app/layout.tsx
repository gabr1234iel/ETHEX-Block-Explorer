import { Inter } from "next/font/google";
import SearchBar from "@/components/SearchBar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "EthEX Blockchain Explorer",
  description: "by gabriel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        
        <main className="dark flex min-h-screen flex-col items-center p-24">
        <SearchBar />
          {children}
        </main>
      </body>
    </html>
  );
}
