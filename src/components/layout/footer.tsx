import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-neutral-200">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">TravelAgency</h3>
            <p className="text-sm text-neutral-400">
              Making your travel dreams come true with unforgettable experiences
              and personalized service.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/destinations"
                  className="text-sm hover:text-white transition-colors"
                >
                  Destinations
                </Link>
              </li>
              <li>
                <Link
                  href="/tours"
                  className="text-sm hover:text-white transition-colors"
                >
                  Tours
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>123 Travel Street</li>
              <li>City, Country 12345</li>
              <li>Phone: +1 234 567 890</li>
              <li>Email: info@travelagency.com</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-neutral-400 mb-4">
              Subscribe to our newsletter for travel tips and exclusive offers.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-neutral-800 px-4 py-2 rounded-md text-sm flex-1"
              />
              <button
                type="submit"
                className="bg-neutral-700 px-4 py-2 rounded-md text-sm hover:bg-neutral-600 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-neutral-800 text-center text-sm text-neutral-400">
          <p>
            &copy; {new Date().getFullYear()} TravelAgency. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
