import type { Metadata } from "next";
import { Libre_Baskerville } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Bounce, ToastContainer } from "react-toastify";

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  weight: "400",
});


export const metadata: Metadata = {
  title: "Fix It Now",
  description: "Repair with Ease: Find Certified Professionals Instantly. Download the App and Fix It Now!",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${libreBaskerville.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col"><div>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
        />
        <Navbar />
        {children}
        <Footer />
      </div></body>
    </html>
  );
}
