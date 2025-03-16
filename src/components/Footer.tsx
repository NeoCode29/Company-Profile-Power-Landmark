import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-white text-gray-900 py-16">
      <div className="container mx-auto px-4">
        <div className="border-t border-gray-200 pt-8 text-center text-gray-600">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <Link href="/" className="text-gray-900 hover:text-green-400 transition-colors">
              Power Landmark
            </Link>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
