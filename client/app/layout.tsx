import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "PixelCart — Premium Electronics",
  description: "Buy premium mobiles and laptops at best prices",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Providers>
          <Suspense fallback={null}>
            {children}
          </Suspense>
        </Providers>
        <script src="https://checkout.razorpay.com/v1/checkout.js" />
      </body>
    </html>
  );
}