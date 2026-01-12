import React, { useState } from "react";

const faqData = [
  {
    id: 1,
    question: "What is the purpose of this club?",
    answer:
      "This club aims to bring together like-minded individuals to learn, grow, and network through various activities and events.",
  },
  {
    id: 2,
    question: "How can I join the club?",
    answer:
      "You can join the club by filling out the membership form available on our website and paying the annual membership fee.",
  },
  {
    id: 3,
    question: "Are there any fees for attending events?",
    answer:
      "Most events are free for members, but certain special workshops or seminars may require a small participation fee.",
  },
  {
    id: 4,
    question: "Can I suggest new activities?",
    answer:
      "Absolutely! Members are encouraged to suggest new activities or workshops that they believe would benefit the club.",
  },
];

const FAQ = () => {
  const [activeId, setActiveId] = useState(null);

  const toggleFAQ = (id) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqData.map((faq) => (
            <div
              key={faq.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full flex justify-between items-center p-4 text-left focus:outline-none bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium">{faq.question}</span>
                <span className="text-primary text-xl">
                  {activeId === faq.id ? "−" : "+"}
                </span>
              </button>

              {activeId === faq.id && (
                <div className="p-4 bg-gray-50 text-gray-700">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
