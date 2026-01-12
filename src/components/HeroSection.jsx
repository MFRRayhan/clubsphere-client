import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";

const HeroSection = ({ items = [] }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!items.length) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [items]);

  if (!items.length) return null;

  const item = items[index];

  return (
    <section className="relative min-h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={item._id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${item.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-6"
          >
            {item.title}{" "}
            <span className="text-primary">
              {item.type === "club" ? "Club" : "Event"}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-gray-200 max-w-2xl mb-8"
          >
            {item.subtitle?.slice(0, 140)}...
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex gap-4"
          >
            {item.type === "club" ? (
              <Link to={`/clubs/${item._id}`}>
                <button className="btn btn-primary px-8">Explore Club</button>
              </Link>
            ) : (
              <Link to={`/events/${item._id}`}>
                <button className="btn btn-primary px-8">Join Event</button>
              </Link>
            )}

            <Link to={item.type === "club" ? "/clubs" : "/events"}>
              <button className="btn">View All</button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
