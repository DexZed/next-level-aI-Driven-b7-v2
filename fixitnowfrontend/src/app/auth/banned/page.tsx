import { authClient } from "@/lib/auth-client";
import Link from "next/link";

async function BannedPage() {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold text-red-500">Banned</h1>
          <p className="py-6">
            You are banned from using our service. Please contact the
            administrator for assistance.
          </p>
          <Link href={"/"} className="btn btn-neutral mt-4">
            <button
              onClick={() => {
                authClient.signOut();
              }}
            >
              Go to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BannedPage;
