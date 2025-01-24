// File: app/layout.tsx (or your RootLayout component)

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Profile from "./profile"; // Importing the client-side component for the profile

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header>
          <nav>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
              <li className="profile-item">
                <Profile /> {/* Client-side component that handles profile logic */}
              </li>
            </ul>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}