import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Safe App",
  description: "Basic implementation of Safe {Core} SDK",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-violet-100">{children}</body>
    </html>
  );
}
