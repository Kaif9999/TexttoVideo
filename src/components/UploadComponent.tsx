export default function UploadComponent() {
    return (
      <div className="p-4 border rounded-md shadow-sm">
        <label className="block text-sm font-medium text-gray-700">
          Upload Text File
        </label>
        <input
          type="file"
          accept=".txt"
          className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
        />
      </div>
    );
  }