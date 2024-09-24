"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/recommendations/search?q=${encodeURIComponent(searchQuery.trim())}`
      );
    }
    setSearchQuery("");
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          <Link href="/">CrowdSource</Link>
        </h1>
        <div className="flex items-center gap-4">
          <form
            onSubmit={handleSearch}
            className="flex items-center w-full sm:w-auto bg-white border border-gray-300 rounded-full shadow-sm"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recommendations..."
              className="flex-grow px-4 py-2 rounded-full focus:outline-none"
            />
            <button
              type="submit"
              className="bg-transparent text-gray-500 px-4 py-2 rounded-full flex items-center justify-center"
            >
              <FaSearch className="h-6 w-5" />
            </button>
          </form>
          <nav className="flex items-center gap-4">
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
              <Link href="/profile">Profile</Link>
              <Link
                href="/recommendations/create"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Create Recommendation
              </Link>
            </SignedIn>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
