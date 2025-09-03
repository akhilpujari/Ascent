import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { verifyUser } from "../services/verify";
import { toast } from "react-toastify";

// Beautiful shimmer skeleton with modern design
// function Shimmer() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         {/* Animated logo/skeleton */}
//         <div className="flex justify-center mb-8">
//           <div className="w-16 h-16 bg-gradient-to-r from-blue-200 to-purple-200 rounded-xl animate-pulse"></div>
//         </div>
        
//         {/* Main card skeleton */}
//         <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
//           {/* Header skeleton */}
//           <div className="text-center mb-8">
//             <div className="h-7 bg-gray-200 rounded-lg w-3/4 mx-auto mb-4 animate-pulse"></div>
//             <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
//           </div>
          
//           {/* Progress bar */}
//           <div className="mb-8">
//             <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
//               <div className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full animate-[pulse_1.5s_ease-in-out_infinite] w-3/4"></div>
//             </div>
//             <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse"></div>
//           </div>
          
//           {/* Content skeleton */}
//           <div className="space-y-4">
//             <div className="flex items-center space-x-3">
//               <div className="w-6 h-6 bg-blue-100 rounded-full animate-pulse"></div>
//               <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse"></div>
//             </div>
//             <div className="flex items-center space-x-3">
//               <div className="w-6 h-6 bg-purple-100 rounded-full animate-pulse"></div>
//               <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse"></div>
//             </div>
//             <div className="flex items-center space-x-3">
//               <div className="w-6 h-6 bg-indigo-100 rounded-full animate-pulse"></div>
//               <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse"></div>
//             </div>
//           </div>
          
//           {/* Footer skeleton */}
//           <div className="mt-8 flex justify-center space-x-4">
//             <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
//             <div className="w-24 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg animate-pulse"></div>
//           </div>
//         </div>
        
//         {/* Bottom text skeleton */}
//         <div className="text-center mt-6">
//           <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto animate-pulse"></div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Alternative minimalist version
// function MinimalShimmer() {
//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//       <div className="w-full max-w-sm">
//         <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
//           {/* Animated logo */}
//           <div className="flex justify-center mb-8">
//             <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg animate-pulse"></div>
//           </div>
          
//           {/* Animated text */}
//           <div className="text-center mb-8">
//             <div className="h-6 bg-gray-200 rounded-lg w-3/4 mx-auto mb-4 animate-pulse"></div>
//             <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
//           </div>
          
//           {/* Animated progress indicator */}
//           <div className="flex justify-center">
//             <div className="relative">
//               <div className="w-12 h-12 border-4 border-blue-100 rounded-full"></div>
//               <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
//             </div>
//           </div>
          
//           {/* Status text */}
//           <div className="text-center mt-6">
//             <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto animate-pulse"></div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// Modern gradient version
function GradientShimmer() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
          {/* Animated icon */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl animate-pulse shadow-lg"></div>
          </div>
          
          {/* Animated title */}
          <div className="text-center mb-8">
            <div className="h-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-bold text-2xl mb-4">
              <div className="h-8 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto animate-pulse"></div>
          </div>
          
          {/* Animated dots */}
          <div className="flex justify-center space-x-2 mb-8">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce"></div>
          </div>
          
          {/* Status message */}
          <div className="text-center">
            <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Choose which shimmer style you prefer by changing the function name in the export
export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await verifyUser();
        if (user) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          toast.error("Session expired. Please login again.", {
            position: "top-center",
          });
        }
      } catch (err) {
        setIsAuthenticated(false);
        toast.error("Authentication failed. Redirecting to login...", {
          position: "top-center",
        });
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Use Shimmer, MinimalShimmer, or GradientShimmer based on your preference
  if (loading) return <GradientShimmer />;

  return isAuthenticated ? children : <Navigate to="/" replace />;
}