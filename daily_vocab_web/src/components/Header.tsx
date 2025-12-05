import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-primary text-white p-4 shadow-lg">
            <nav className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold tracking-wide">
                    Daily Vocab
                </Link>
                <ul className="flex space-x-6">
                    <li>
                        <Link href="/" className="hover:text-secondary transition duration-200 ease-in-out text-lg">
                            Challenge
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard" className="hover:text-secondary transition duration-200 ease-in-out text-lg">
                            Dashboard
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
