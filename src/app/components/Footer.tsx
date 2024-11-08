import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 border-t-[1px]">
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h5 className="font-bold mb-4">ABOUT</h5>
            <ul>
              <li className="mb-2">How we works</li>
              <li className="mb-2">Newsroom</li>
              <li className="mb-2">Investors</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4">COMMUNITY</h5>
            <ul>
              <li className="mb-2">Diversity & Belonging</li>
              <li className="mb-2">Accessibility</li>
              <li className="mb-2">Airbnb Associates</li>
              <li className="mb-2">Frontline Stays</li>
              <li className="mb-2">Guest Referrals</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4">HOST</h5>
            <ul>
              <li className="mb-2">Host your home</li>
              <li className="mb-2">Host an Online Experience</li>
              <li className="mb-2">Host an Experience</li>
              <li className="mb-2">Responsible hosting</li>
              <li className="mb-2">Resource Center</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4">SUPPORT</h5>
            <ul>
              <li className="mb-2">Help Center</li>
              <li className="mb-2">Trust & Safety</li>
              <li className="mb-2">Cancellation options</li>
              <li className="mb-2">Neighborhood Support</li>
            </ul>
          </div>
        </div>
        <div className="flex justify-between items-center mt-10 border-t pt-6">
          <p className="text-sm">&copy; 2024 Pep Booking Website, Inc. All rights reserved.</p>
          <div className="space-x-4">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Sitemap</span>
            <span>Company Details</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
