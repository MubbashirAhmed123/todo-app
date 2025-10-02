import { Sparkles, X } from "lucide-react";

export const AIAnalysis = ({ analysis, onClose, loading }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="text-purple-600" size={28} />
            AI Task Analysis
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mb-4"></div>
            <p className="text-gray-600">Analyzing your tasks...</p>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 whitespace-pre-line text-sm text-gray-700 border-2 border-purple-200">
            {analysis}
          </div>
        )}
      </div>
    </div>
  );
};
