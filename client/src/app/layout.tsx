import type { Metadata } from "next";
import { Providers } from "./provider";
import "./globals.css";
import { ApiProvider } from "@/context/api";
import { StateProvider } from "@/context/state";
import PrivateRoute from "./privateRoute";
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
            <Providers>
              <PrivateRoute>{children}</PrivateRoute>
            </Providers>
          </ApiProvider>
        </StateProvider>
      </body>
    </html>
  );
}
