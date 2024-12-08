import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-white text-white py-8 w-full">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center space-y-4">
                    <Link
                        href="https://buymeacoffee.com/bittive"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green hover:bg-lime-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center"

                    >
                        ☕ Help us pay rent
                    </Link>
                    <p className="text-sm text-black">
                        Made with 💖 by <a href='https://bittive.com' className="font-semibold hover:underline">Bittive</a>
                    </p>
                </div>
            </div>
        </footer>
    )
}

