// components/HowItWorks.jsx
import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    title: "Discover Clubs",
    description: "Find clubs that match your interests.",
  },
  {
    title: "Join Easily",
    description: "Sign up and become a member in minutes.",
  },
  {
    title: "Engage & Share",
    description: "Participate in events and meet like-minded people.",
  },
];

const HowItWorks = () => {
  return (
    <section className="container mx-auto px-4 text-center py-16">
      <h2 className="text-3xl font-bold mb-10">How ClubSphere Works</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.2 }}
            className="p-6 bg-base-100 rounded-lg shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
