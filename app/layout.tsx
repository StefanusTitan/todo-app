import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import Profile from "./components/ProfileLink";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "To-Do App",
  description: "A simple application to create a personalized to-do list.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <header>
            <nav>
              <ul className="flex items-center justify-between">
                <li className="flex gap-4">
                  <a href="/">Home</a>
                  <a href="/about">About</a>
                </li>
                <li className="profile-item">
                  <Profile />
                </li>
              </ul>
            </nav>
          </header>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}