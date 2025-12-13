import React from "react";
import { motion } from "framer-motion";

const categories = [
  {
    title: "Photography",
    subtitle: "Capture moments & stories",
  },
  {
    title: "Technology",
    subtitle: "Learn, build, and innovate",
  },
  {
    title: "Hiking",
    subtitle: "Explore nature together",
  },
  {
    title: "Book Club",
    subtitle: "Read, discuss & grow",
  },
  {
    title: "Gaming",
    subtitle: "Play & compete socially",
  },
  {
    title: "Music",
    subtitle: "Jam, learn & perform",
  },
  {
    title: "Social Hangout",
    subtitle: "Meet new people & connect",
  },
  {
    title: "Skill Sharing",
    subtitle: "Teach & learn together",
  },
];

const WhyJoin = () => {
  return (
    <section className="bg-base-100 py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-4xl font-bold mb-4">
            Why Join <span className="text-primary">ClubSphere</span>?
          </h2>
          <p className="text-base-content/70">
            Discover communities that match your passion and connect with
            like-minded people through meaningful activities.
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              whileHover={{ y: -6 }}
              className="bg-base-200 rounded-2xl p-6 text-center cursor-pointer shadow-sm hover:shadow-lg transition-all"
            >
              <h3 className="text-lg font-semibold mb-2">{cat.title}</h3>
              <p className="text-sm text-base-content/70">{cat.subtitle}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyJoin;
