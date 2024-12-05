export default function AspectRatioSelector() {
    return (
      <div className="bg-white shadow-md rounded-md mt-3 mx-0 sm:mx-6 p-4">
        <label className="flex text-sm font-medium text-gray-700">
          Aspect Ratio
        </label>
        <p className="text-sm text-gray-600">Define the aspect ratio of the video</p>
        <select className="mt-1 block w-full text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>16:9</option>
          <option>9:16</option>
          <option>1:1</option>
        </select>
      </div>
    );
  }