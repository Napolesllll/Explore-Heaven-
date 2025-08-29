"use client";

import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { getI18n } from "../i18n/getI18";

type NavbarTranslations = {
  services: string;
  tours: string;
  safetyTips: string;
  contact: string;
  blog: string;
  signIn: string;
  logout: string;
};

interface NavbarProps {
  lang?: "es" | "en";
}

export default function Navbar({ lang = "es" }: NavbarProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const t = getI18n(lang);
  const navbarT: NavbarTranslations = {
    services: t.services,
    tours: t.tours,
    safetyTips: t.safetyTips,
    contact: t.contact,
    blog: t.blog,
    signIn: t.signIn,
    logout: t.logout,
  };

  const navItems = [
    { id: "services", label: navbarT.services },
    { id: "toursSection", label: navbarT.tours },
    { id: "safety", label: navbarT.safetyTips },
    { id: "contact", label: navbarT.contact },
    { id: "blog", label: navbarT.blog, href: "/blog" },
  ];

  return (
    <nav className="sticky top-0 bg-gray-900/90 backdrop-blur-md shadow-xl z-50 border-b border-yellow-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <motion.div
            className="flex-shrink-0 flex items-center space-x-3"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Image
              src="/images/SVG-01.svg"
              alt="Explore Heaven Logo"
              width={60}
              height={60}
              className="h-15 w-auto transition-all duration-300 hover:drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]"
            />
            <Link href="/">
              <span className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent hover:bg-gradient-to-r hover:from-yellow-200 hover:to-yellow-400 transition-all duration-500">
                Explore Heaven
              </span>
            </Link>
          </motion.div>

          <div className="hidden md:flex space-x-2 items-center">
            {navItems.map((item) => (
              <motion.div
                key={item.id}
                className="relative"
                onHoverStart={() => setHoveredItem(item.id)}
                onHoverEnd={() => setHoveredItem(null)}
              >
                <Link
                  href={item.href || `#${item.id}`}
                  className="relative z-10 px-4 py-2 text-lg font-medium transition-all duration-300"
                >
                  <span className="relative inline-block text-yellow-400 hover:text-yellow-300 transition-colors duration-300">
                    {item.label}
                  </span>
                  {hoveredItem === item.id && (
                    <motion.span
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400"
                      layoutId="navUnderline"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        type: "spring",
                        bounce: 0.25,
                        duration: 0.5,
                      }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/auth">
                <button className="ml-4 bg-gradient-to-br from-yellow-400 to-yellow-500 text-gray-900 px-6 py-2.5 rounded-full font-semibold shadow-lg hover:shadow-yellow-400/40 transition-all duration-300">
                  {navbarT.signIn}
                </button>
              </Link>
            </motion.div>
          </div>

          <motion.button
            className="md:hidden p-2 text-yellow-400 hover:text-yellow-300 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? (
              <XMarkIcon className="h-8 w-8" />
            ) : (
              <Bars3Icon className="h-8 w-8" />
            )}
          </motion.button>
        </div>

        {isOpen && (
          <motion.div
            className="md:hidden bg-gray-800/95 backdrop-blur-sm mt-2 rounded-lg mx-4 overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navItems.map((item) => (
              <motion.a
                key={`mobile-${item.id}`}
                href={item.href || `#${item.id}`}
                className="block px-6 py-4 text-yellow-400 hover:bg-gray-700/50 hover:text-yellow-300 transition-all duration-300 border-b border-gray-700 last:border-b-0"
                whileHover={{ x: 5 }}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </motion.a>
            ))}
            <motion.div
              className="px-4 py-4"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {session?.user ? (
                <div className="flex items-center space-x-3">
                  <Link href="/auth">
                    <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-6 py-3.5 rounded-full font-bold shadow-lg hover:shadow-yellow-400/30 transition-all duration-300">
                      {navbarT.logout}
                    </button>
                  </Link>
                  <p className="text-sm text-yellow-200">
                    {session.user.name} - {session.user.email}
                  </p>
                  {session.user.image && (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "user-img"}
                      width={40}
                      height={40}
                      className="rounded-full cursor-pointer"
                    />
                  )}
                </div>
              ) : (
                <Link href="/auth">
                  <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-6 py-3.5 rounded-full font-bold shadow-lg hover:shadow-yellow-400/30 transition-all duration-300">
                    {navbarT.signIn}
                  </button>
                </Link>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
