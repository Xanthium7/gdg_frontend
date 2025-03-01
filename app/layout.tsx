import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Anek_Malayalam } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// Load Malayalam font locally
const malayalamFont = Anek_Malayalam({
  subsets: ["malayalam"],
  variable: "--font-malayalam",
});

export const metadata: Metadata = {
  title: "Kerala Government Services Assistant",
  description:
    "A friendly assistant to help elderly citizens with government procedures in Kerala",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ml">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body
        className={`${inter.variable} ${malayalamFont.variable}  antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
