"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src="/innoutvoice-lco.svg"
                alt="In-N-OutVoice Logo"
                width={24}
                height={24}
                className="h-6 w-6"
              />
            </motion.div>
            <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              In-N-OutVoice
            </span>
          </Link>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href={ROUTES.LOGIN}>
              <Button variant="ghost" size="sm">
                Log In
              </Button>
            </Link>
            <Link href={ROUTES.REGISTER}>
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-neutral-200 dark:border-neutral-800"
          >
            <div className="flex flex-col space-y-2">
              <Link href={ROUTES.LOGIN} onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full">
                  Log In
                </Button>
              </Link>
              <Link href={ROUTES.REGISTER} onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="primary" size="sm" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
}

