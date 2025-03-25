import { Coffee, Inbox } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white text-white py-8 w-full">
      <div className="container mx-auto px-4">
        <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row items-center justify-center space-x-4">
          <Link
            href="mailto:haalarikone@bittive.com"
            className="flex items-center justify-center bg-green hover:bg-lime-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
          >
            <Inbox className="mr-2" />
            Ota meihin yhteyttä
          </Link>
        </div>
        <p className="mt-4 text-center text-sm text-black">
          Made with 💖 by{" "}
          <a
            href="https://bittive.com"
            className="font-semibold hover:underline"
          >
            Bittive
          </a>
        </p>
      </div>
    </footer>
  );
}
