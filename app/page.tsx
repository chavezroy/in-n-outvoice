"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, FileText, Zap, Shield, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { ROUTES } from "@/lib/constants";

export default function HomePage() {
  const features = [
    {
      icon: FileText,
      title: "Professional Templates",
      description:
        "Choose from a library of professionally designed proposal templates tailored for your industry.",
    },
    {
      icon: Zap,
      title: "Quick & Easy",
      description:
        "Create stunning proposals in minutes, not hours. Our intuitive builder makes it simple.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Your proposals are stored securely. We take your privacy and data protection seriously.",
    },
    {
      icon: Sparkles,
      title: "Custom Branding",
      description:
        "Add your logo, colors, and branding to make every proposal uniquely yours.",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                Create Professional Proposals
                <span className="block text-primary-600 dark:text-primary-400">
                  In-N-Out
                </span>
              </h1>
              <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
                The fastest way to create stunning, professional proposals for
                your clients. Perfect for self-employed professionals and small
                businesses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={ROUTES.REGISTER}>
                  <Button variant="primary" size="lg">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href={ROUTES.TEMPLATES}>
                  <Button variant="outline" size="lg">
                    Browse Templates
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-neutral-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              All the tools you need to create, customize, and send professional
              proposals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card hover className="h-full text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900/20">
                        <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Create Your First Proposal?
              </h2>
              <p className="text-xl text-primary-100 mb-8">
                Join thousands of professionals who trust In-N-OutVoice for
                their proposal needs.
              </p>
              <Link href={ROUTES.REGISTER}>
                <Button variant="secondary" size="lg" className="bg-white text-primary-600 hover:bg-neutral-100">
                  Start Creating Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
