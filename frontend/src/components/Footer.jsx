import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white py-4">
      <div className="container mx-auto px-4 text-center">
        <p>Trendify &copy; {currentYear} - All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;