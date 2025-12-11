// components/WhyJoin.jsx
import React from "react";
import { motion } from "framer-motion";

const categories = [
  "Photography",
  "Tech",
  "Hiking",
  "Book Club",
  "Gaming",
  "Music",
];

const WhyJoin = () => {
  return (
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-10">Popular Categories</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="badge badge-lg badge-primary px-6 py-4 text-white cursor-pointer"
            >
              {cat}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyJoin;
