import type { Metadata } from "next";
import { Providers } from "./provider";
import "./globals.css";
import { ApiProvider } from "@/context/api";
import { StateProvider } from "@/context/state";
export const metadata: Metadata = {
  title: "Chat App",
  description: "Chat App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <StateProvider>
          <ApiProvider>
            <Providers>{children}</Providers>
          </ApiProvider>
        </StateProvider>
      </body>
    </html>
  );
}
