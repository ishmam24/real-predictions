import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { AppShell } from "@/components/AppShell";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Real Predictions — Premier League Predictor",
  description: "Predict Premier League scorelines and Player of the Match, earn points, top the table.",
};

// Responsive web app: mobile-first, but let it scale up and stay zoomable.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef1f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1017" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Applies the saved light/dark choice to <html> before first paint, so there's
// no flash of the wrong theme on load.
const themeInit = `try{var t=localStorage.getItem('rp_theme');if(t==='dark'||t==='light'){document.documentElement.dataset.theme=t;}}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <StoreProvider>
          <AppShell>{children}</AppShell>
        </StoreProvider>
      </body>
    </html>
  );
}
