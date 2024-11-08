'use client'
import { useRouter } from 'next/navigation';
import Container from '../components/Container';
import Button from '../components/Button';
import { FaTimesCircle } from 'react-icons/fa';

const CancelPage = () => {
  const router = useRouter();

  const handleGoToHome = () => {
    router.push('/');
  };

  return (
    <Container>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <FaTimesCircle className="text-red-600 text-6xl mb-4" />
        <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Canceled</h1>
        <p className="text-lg text-gray-700 mb-8">
          It looks like your payment was not completed. You can retry the payment or return to the homepage.
        </p>
        <div className="flex space-x-4">
          <Button label="Go to Homepage" onClick={handleGoToHome} outline/>
        </div>
      </div>
    </Container>
  );
};

export default CancelPage;
