// pages/showSchools.jsx
import { useEffect, useState } from "react";
import BotChatWidget from "../components/BotChatWidget";

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/schools")
      .then((res) => res.json())
      .then((data) => {
        setSchools(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching schools:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Discover Schools
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Find the perfect educational institution for your child's future
          </p>
          <div className="mt-8 flex justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 text-lg font-semibold">
              {loading ? "Loading..." : `${schools.length} Schools Available`}
            </div>
          </div>
        </div>
      </div>

      {/* Schools Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-6 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Loading Schools...
            </h3>
            <p className="text-gray-500">
              Please wait while we fetch the data.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {schools.map((school, index) => (
                <div
                  key={school.id}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: "fadeInUp 0.6s ease-out forwards",
                  }}
                >
                  {/* Image Container with Gradient Overlay */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10"></div>
                    <img
                      src={
                        school.image.includes("file/d/")
                          ? `https://drive.google.com/thumbnail?id=${
                              school.image.split("/d/")[1].split("/")[0]
                            }`
                          : school.image
                      }
                      alt={school.name}
                      className="w-full h-full object-center object-cover transition-transform duration-500 group-hover:scale-110"
                      style={{
                        border: "4px solid transparent",
                        borderImage:
                          "linear-gradient(45deg, #667eea, #764ba2, #f093fb) 1",
                        borderRadius: "12px 12px 0 0",
                      }}
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />

                    {/* Floating Badge */}
                    <div className="absolute top-4 right-4 z-20">
                      <div className="bg-gradient-to-r from-emerald-400 to-cyan-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        TOP RATED
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2">
                      {school.name}
                    </h2>

                    <div className="flex items-start space-x-2 text-gray-600 mb-4">
                      <svg
                        className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <p className="text-sm font-medium">{school.address}</p>
                        <p className="text-sm text-indigo-600 font-semibold">
                          {school.city}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95">
                      View Details
                    </button>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                  <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-gradient-to-br from-pink-400 to-red-500 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {schools.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2M7 21h2m0 0h2m-2 0v-7m2 7v-7M7 21V9m0 12h2m12 0h2m-2 0h-2"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No Schools Found
                </h3>
                <p className="text-gray-500">
                  Check back later for more schools in your area.
                </p>
              </div>
            )}
          </>
        )}
      </div>
      <BotChatWidget />
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
