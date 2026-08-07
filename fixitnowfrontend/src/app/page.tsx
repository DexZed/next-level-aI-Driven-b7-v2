import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Hello there</h1>
            <p className="py-6">
              Welcome to Fix It Now
            </p>
            <div className="flex gap-2 justify-center">
              <button className="btn btn-outline btn-primary rounded-md">Explore</button>
              <button className="btn btn-outline btn-info rounded-md">Login</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
