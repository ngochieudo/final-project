'use client'
import { useRouter } from 'next/navigation';
import React from 'react';
import Button from './Button';
import { BiHome } from 'react-icons/bi';


const Unauthorized: React.FC = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.push('/')
  };

  return (
    <div className='flex items-center justify-center h-screen bg-gray-100'>
      <div className="text-center bg-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-4">Unauthorized Access</h1>
        <p className="text-2xl text-gray-700 mb-6">You do not have permission to view this page.</p>
        <Button
          label='Back to Home'
          icon={BiHome}
          onClick={handleGoBack}
          outline
        />
      </div>

    </div>
  );
};

export default Unauthorized;
