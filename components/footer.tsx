import Link from 'next/link'
import { ThemeSwitcher } from './theme-switcher'

export default function Footer() {
    return (
        <footer className="w-full flex items-center justify-between bg-gray-800 text-white p-4 ">
            <div className="max-w-screen-xl space-x-4 flex items-center mx-auto">
                <Link href="https://www.buymeacoffee.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                    Help us pay rent
                </Link>
                <span>Created by Bittive</span>
                <ThemeSwitcher />
            </div>
        </footer>
    )
}

