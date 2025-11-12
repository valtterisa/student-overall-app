import { Mail, Github } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white text-white py-8 w-full">
      <div className="container mx-auto px-4">
        <div className="flex md:flex-row flex-col items-center justify-center gap-4 mb-4">
          <div className="flex items-center space-x-4">
            <Link
              href="/blog"
              className="text-black hover:text-green transition font-medium"
            >
              Blogi
            </Link>
            <Link
              href="mailto:savonen.emppu@gmail.com"
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
        </div>
        <p className="mt-4 text-center text-sm text-black">
          Made by{" "}
          <Link
            href="https://valtterisavonen.fi"
            className="font-semibold hover:underline"
            target="_blank"
          >
            @valtterisa
          </Link>
        </p>
      </div>
    </footer>
  );
}
