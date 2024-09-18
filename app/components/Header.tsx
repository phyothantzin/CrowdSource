import React from "react";
import Link from "next/link";
import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">CrowdSource</h1>
        <nav className="flex items-center gap-4">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
            <Link
              href="/create-recommendation"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Create Recommendation
            </Link>
          </SignedIn>
        </nav>
      </div>
    </header>
  );
};

export default Header;
