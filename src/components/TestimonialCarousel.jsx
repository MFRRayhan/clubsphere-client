import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa6";

const testimonials = [
  {
    id: 1,
    name: "Ayesha Rahman",
    role: "Student",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    feedback:
      "ClubSphere helped me discover amazing clubs near me! Joining was simple and the events are truly engaging.",
  },
  {
    id: 2,
    name: "Imran Hossain",
    role: "Professional",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    feedback:
      "I love the networking opportunities ClubSphere provides. It's a perfect platform to grow my social and professional circle.",
  },
  {
    id: 3,
    name: "Sara Khan",
    role: "Entrepreneur",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    feedback:
      "The events and workshops are very well-organized. ClubSphere makes it easy to join clubs and stay updated.",
  },
  {
    id: 4,
    name: "Rafiq Ahmed",
    role: "Designer",
    avatar: "https://randomuser.me/api/portraits/men/50.jpg",
    feedback:
      "Joining clubs through ClubSphere helped me meet amazing creatives and grow my portfolio.",
  },
  {
    id: 5,
    name: "Nabila Chowdhury",
    role: "Student",
    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    feedback:
      "I love the user-friendly interface and the way events are listed. Finding clubs has never been easier!",
  },
  {
    id: 6,
    name: "Tanvir Hossain",
    role: "Entrepreneur",
    avatar: "https://randomuser.me/api/portraits/men/60.jpg",
    feedback:
      "ClubSphere is a game-changer. It helped me network, attend workshops, and stay updated with all club activities.",
  },
];

const TestimonialCarousel = () => {
  const perSlide = 3;
  const [startIndex, setStartIndex] = useState(0);

  // Next: shift by 1
  const nextSlide = () => {
    setStartIndex((prev) => (prev + 1) % testimonials.length);
  };

  // Prev: shift by 1
  const prevSlide = () => {
    setStartIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  // Get current 3 testimonials
  const currentTestimonials = [];
  for (let i = 0; i < perSlide; i++) {
    currentTestimonials.push(
      testimonials[(startIndex + i) % testimonials.length]
    );
  }

  return (
    <section className="bg-base-200 py-20">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">
          What <span className="text-primary">Our Members</span> Say
        </h2>
        <p className="text-base-content/70 mb-12">
          Real experiences from our ClubSphere community.
        </p>

        <div className="relative">
          {/* Slider Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={startIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {currentTestimonials.map((t) => (
                <motion.div
                  key={t.id}
                  whileHover={{ y: -6, scale: 1.03 }}
                  className="bg-base-100 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all relative flex flex-col h-full"
                >
                  <FaQuoteLeft className="text-primary text-3xl absolute top-5 left-5" />

                  {/* Feedback */}
                  <p className="text-gray-700 mb-6 flex-1">{t.feedback}</p>

                  {/* Client Info */}
                  <div className="flex items-center gap-4 mt-auto">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="text-left">
                      <h4 className="font-semibold">{t.name}</h4>
                      <p className="text-sm text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-10">
            <button onClick={prevSlide} className="btn btn-sm btn-primary">
              Prev
            </button>
            <button onClick={nextSlide} className="btn btn-sm btn-primary">
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;
