import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image"; 

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header>
          <nav>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
              <li className="profile-item">
              <a href="/profile">
                <div className="circular-image">
                  <Image // Use the next/image component for optimization
                    src="/images/user-profile.jpg" // Path from the public directory
                    alt="Profile Picture"
                    width={64} // Explicitly set width and height
                    height={64}
                    className="profile-pic"
                  />
                </div>
              </a>
            </li>
            </ul>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
