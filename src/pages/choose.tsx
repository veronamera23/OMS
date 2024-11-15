import React from 'react';
import Link from 'next/link';

const Choose: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Choose Your Registration Type</h1>

      <div className="space-y-4">
        {/* Button to Register Organization */}
        <Link href="/registerorg" className="w-64 py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition"
          > 
            Register an Organization   
        </Link>

        {/* Button to Register as Member */}
        <Link href="/registermember" className="w-64 py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transition"
        >
            Register as a Member
        </Link>
      </div>
    </div>
  );
};

export default Choose;
