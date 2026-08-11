import Link from "next/link";

export default function Home() {
  return (
    <>

      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Hello there</h1>
            <p className="py-6">
              Welcome to Fix It Now
            </p>
            <div className="flex gap-2 justify-center">
              <Link className="btn btn-outline btn-primary rounded-md" href={'/auth/login'}>Login</Link>
              <Link className="btn btn-outline btn-info rounded-md" href={"/auth/register"}>Sign Up</Link>

            </div>
          </div>
        </div>
      </div>

    </>
  );
}
