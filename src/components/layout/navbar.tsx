import Link from "next/link";
import Button from "@/components/ui/button";

const Navbar = () => {
  const navigation = [
    { name: "Home", href: "/" },
    { name: "Destinations", href: "/destinations" },
    { name: "Tours", href: "/tours" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-neutral-900">
              TravelAgency
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-neutral-700 hover:text-neutral-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              <Button variant="default" size="default">
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
