import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800 p-6">
      <div className="flex flex-col items-center space-y-4 text-center">
        <AlertCircle className="w-16 h-16 text-red-500" />
        <h1 className="text-5xl font-bold">404</h1>
        <p className="text-xl text-gray-600">Oops! The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
