'use client';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">✅ React is Working!</h1>
        <p className="text-gray-700 text-lg mb-4">If you can see this colorful page, then:</p>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>Next.js is running correctly</li>
          <li>React is rendering</li>
          <li>Tailwind CSS is working</li>
          <li>Client components are functional</li>
        </ul>
        <div className="mt-6 p-4 bg-green-100 rounded-lg">
          <p className="text-green-800 font-semibold">Server Status: Active</p>
          <p className="text-green-700 text-sm">Time: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
