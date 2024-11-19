export default function MediaSourceSelector() {
    return (
      <div className="p-4 border rounded-md shadow-sm">
        <label className="block text-sm font-medium text-gray-700">
          Select Media Source
        </label>
        <div className="flex space-x-4 mt-2">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Stock Videos
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
            AI-Generated Images
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Custom Background
          </button>
        </div>
      </div>
    );
  }