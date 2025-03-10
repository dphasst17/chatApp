import type { Metadata } from "next";
import { Providers } from "./provider";
import "./globals.css";
import { ApiProvider } from "@/context/api";
import { StateProvider } from "@/context/state";
import PrivateRoute from "./privateRoute";
import { GoogleOAuthProvider } from "@react-oauth/google";
export const metadata: Metadata = {
  title: "Fastssenger",
  description: "Fastssenger",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StateProvider>
          <ApiProvider>
            <Providers>
              <PrivateRoute>
                <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GID as string}>
                  {children}
                </GoogleOAuthProvider>
              </PrivateRoute>
            </Providers>
          </ApiProvider>
        </StateProvider>
      </body>
    </html>
  );
}
