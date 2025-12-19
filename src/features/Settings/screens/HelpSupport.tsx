import {
  HelpCircle,
  Mail,
  MessageSquare,
  BookOpen,
  ChevronDown
} from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "How do I add a new product?",
    answer:
      "Go to Products → Add Product, fill in the required details, and click Save."
  },
  {
    question: "How does barcode generation work?",
    answer:
      "Each product can generate a unique barcode from the Barcode Generator section."
  },
  {
    question: "Can I export reports?",
    answer:
      "Yes, reports can be exported in CSV format from the Reports section."
  },
];

const HelpSupport: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Help & Support</h1>
        <p className="text-gray-500 text-sm mt-1">
          Find answers or get in touch with our support team.
        </p>
      </div>

      {/* SEARCH */}
      <div className="relative max-w-md">
        <HelpCircle
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          placeholder="Search help articles..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      {/* QUICK HELP CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-4 border rounded-xl hover:shadow transition">
          <BookOpen className="text-blue-600 mb-2" />
          <h3 className="font-medium">Getting Started</h3>
          <p className="text-sm text-gray-500">
            Learn how to use FitInventory step by step.
          </p>
        </div>

        <div className="p-4 border rounded-xl hover:shadow transition">
          <MessageSquare className="text-blue-600 mb-2" />
          <h3 className="font-medium">Live Chat</h3>
          <p className="text-sm text-gray-500">
            Chat with our support team in real time.
          </p>
        </div>

        <div className="p-4 border rounded-xl hover:shadow transition">
          <Mail className="text-blue-600 mb-2" />
          <h3 className="font-medium">Email Support</h3>
          <p className="text-sm text-gray-500">
            Reach us at support@fitinventory.com
          </p>
        </div>
      </div>

      {/* FAQ SECTION */}
      <div className="max-w-2xl">
        <h2 className="text-lg font-semibold mb-4">
          Frequently Asked Questions
        </h2>

        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border rounded-lg"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full flex justify-between items-center p-4 text-sm font-medium"
              >
                {faq.question}
                <ChevronDown
                  size={18}
                  className={`transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-4 pb-4 text-sm text-gray-600">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default HelpSupport;
