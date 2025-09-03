export default function GradientShimmer() {
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