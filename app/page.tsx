"use client"
import { Button } from "@heroui/react"
import NextLink from "next/link"
import HeroSection from "@/components/herosection"
import DealsSection from "@/components/deals-section"
import WhyChooseUsSection from "@/components/why-choose-us"
import FAQSection from "@/components/faq-section"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      {/* Deals Section */}
      <DealsSection />
      <WhyChooseUsSection />
      //TODO display sample courses
      {/* CTA Section */}
      <section className="py-12 md:py-16 lg:py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">Ready to Start Your Cybersecurity Journey?</h2>
            <p className="text-gray-300 max-w-[600px] text-sm sm:text-base">
              Join thousands of students who have advanced their careers with AfricaHackon Academy
            </p>
            <Button as={NextLink} href="/signup" color="primary" className="mt-4 bg-primary hover:bg-[#d10021]">
              Get Started Today
            </Button>
          </div>
        </div>
      </section>
      <FAQSection />
    </div>
  )
}
