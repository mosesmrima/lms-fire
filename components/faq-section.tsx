"use client";
import { useState } from "react";

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-800 py-3 sm:py-4">
      <button
        className="flex items-start sm:items-center w-full space-x-3 sm:space-x-4 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        {!isOpen && (
          <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-red-600 rounded-sm text-white font-bold text-sm mt-0.5 sm:mt-0">+</span>
        )}
        {isOpen && (
          <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-red-600 rounded-sm text-white font-bold text-sm mt-0.5 sm:mt-0">-</span>
        )}
        <h3 className="text-base sm:text-lg font-medium">
          {question}
        </h3>
      </button>
      {isOpen && (
        <div className="mt-2 sm:mt-3 text-gray-400 pr-0 sm:pr-4 pl-8 sm:pl-10">
          <p className="text-sm sm:text-base">{answer}</p>
        </div>
      )}
    </div>
  );
};

const FAQSection = () => {
  const faqs = [
    {
      id: 1,
      question: "What type of businesses does Africahackon Academy help?",
      answer: "We work with a wide range of small to medium sized businesses. Whether you run a shop or stall, drive a car with a ride hailing company, sell physical products wholesale or retail, or even if you operate a side-hustle for extra cash, we're confident we can find the right financing for your needs."
    },
    {
      id: 2,
      question: "What loans do you provide and what are the prices?",
      answer: "We offer a variety of loan products tailored to different business needs, with competitive interest rates starting from as low as 5% monthly. Our loan amounts range from $100 to $5,000 depending on your business size, history, and requirements."
    },
    {
      id: 3,
      question: "How long does it take to apply and be approved?",
      answer: "Our streamlined application process typically takes less than 10 minutes to complete. Most applications receive an initial decision within 24 hours, and once approved, funds can be disbursed to your account within 1-2 business days."
    },
    {
      id: 4,
      question: "Is my data safe with Africahackon Academy?",
      answer: "Absolutely. We employ bank-level encryption and security protocols to protect all your personal and financial information. We never share your data with unauthorized third parties, and our systems are regularly audited for compliance with international data protection standards."
    },
    {
      id: 5,
      question: "What is the Africahackon Academy TrustScore?",
      answer: "The TrustScore is our proprietary credit scoring system that evaluates your business potential beyond traditional credit checks. It considers factors like business performance, payment history, and growth potential to offer you the best possible loan terms, even if you have limited credit history."
    },
    {
      id: 6,
      question: "How do I know the lenders on the Africahackon Academy app are trustworthy?",
      answer: "All lending partners on our platform undergo a rigorous vetting process. We verify their licenses, review their lending practices, and continuously monitor customer feedback. We only partner with lenders who meet our strict standards for transparency, fair rates, and ethical collection practices."
    }
  ];

  return (
    <section className="py-10 sm:py-12 md:py-16 px-4 sm:px-6 md:px-12 bg-black text-white">
      <div className="container mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-light mb-6 sm:mb-8 md:mb-12">Frequently Asked <span className="font-bold">Questions</span></h2>
        <div className="w-full max-w-4xl mx-auto">
          {faqs.map((faq) => (
            <FAQItem key={faq.id} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;