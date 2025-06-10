"use client";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#1E1E1E] text-white py-10 px-6 md:px-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Column 1: Category */}
        <div>
          <h3 className="text-lg mb-4 font-medium">Category</h3>
          <ul className="space-y-2 text-gray-400">
            <li><Link href="/blockchain" className="hover:text-red-500">Blockchain</Link></li>
            <li><Link href="/crypto-currency" className="hover:text-red-500">Crypto Currency</Link></li>
            <li><Link href="/cyber-security" className="hover:text-red-500">Cyber Security</Link></li>
            <li><Link href="/programming" className="hover:text-red-500">Programming & Tech</Link></li>
            <li><Link href="/financial-education" className="hover:text-red-500">Financial Education</Link></li>
          </ul>
        </div>

        {/* Column 2: About */}
        <div>
          <h3 className="text-lg mb-4 font-medium">About</h3>
          <ul className="space-y-2 text-gray-400">
            <li><Link href="/careers" className="hover:text-red-500">Careers</Link></li>
            <li><Link href="/press" className="hover:text-red-500">Press & News</Link></li>
            <li><Link href="/privacy" className="hover:text-red-500">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-red-500">Terms of Service</Link></li>
            <li><Link href="/intellectual-property" className="hover:text-red-500">Intellectual Property Claims</Link></li>
          </ul>
        </div>

        {/* Column 3: Support */}
        <div>
          <h3 className="text-lg mb-4 font-medium">Support</h3>
          <ul className="space-y-2 text-gray-400">
            <li><Link href="/help" className="hover:text-red-500">Help & Support</Link></li>
            <li><Link href="/trust" className="hover:text-red-500">Trust & Safety</Link></li>
          </ul>
        </div>

        {/* Column 4: Community */}
        <div>
          <h3 className="text-lg mb-4 font-medium">Community</h3>
          <ul className="space-y-2 text-gray-400">
            <li><Link href="/events" className="hover:text-red-500">Events</Link></li>
            <li><Link href="/blog" className="hover:text-red-500">Blog</Link></li>
            <li><Link href="/forum" className="hover:text-red-500">Forum</Link></li>
            <li><Link href="/standards" className="hover:text-red-500">Community Standards</Link></li>
            <li><Link href="/podcast" className="hover:text-red-500">Podcast</Link></li>
          </ul>
        </div>

        {/* Column 5: Contact Info */}
        <div className="flex flex-col items-start">
          <div className="mb-4 flex items-center">
            <Image
              src="/logo.png"
              alt="Africa Tech"
              width={200}
              height={200}
              priority
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
          <div className="text-gray-400">
            <p>Location: Offices or box number</p>
            <p>Call: 0756543431 / 0234323658</p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-8 pt-6 text-center">
      <p className="text-sm text-red-500">
  All rights reserved to Africahackon Academy {new Date().getFullYear()}
</p>
      </div>
    </footer>
  );
};

export default Footer;