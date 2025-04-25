import { Mail, Github } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white text-white py-8 w-full">
      <div className="container mx-auto px-4">
        <div className="flex md:flex-row items-center justify-center space-x-4">
          <Link
            href="mailto:haalarikone@bittive.com"
            className="text-black hover:text-green"
            aria-label="Contact us"
          >
            <Mail className="" />
          </Link>
          <Link
            href={"https://github.com/valtterisa/student-overall-app"}
            target="_blank"
            className="text-black hover:text-green"
            aria-label="GitHub repository"
          >
            <Github className="" />
          </Link>
        </div>
        <p className="mt-4 text-center text-sm text-black">
          Made with 💖 by{" "}
          <Link
            href="https://bittive.com"
            className="font-semibold hover:underline"
            target="_blank"
          >
            Bittive
          </Link>
        </p>
      </div>
    </footer>
  );
}
