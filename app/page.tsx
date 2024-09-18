import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">CrowdSource</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
              <h2 className="text-2xl font-semibold mb-4">
                Discover the Best Recommendations
              </h2>
              <p className="mb-4">
                Find top recommendations for restaurants, books, travel spots,
                and more!
              </p>
              <Link
                href="/recommendations"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Browse Recommendations
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
