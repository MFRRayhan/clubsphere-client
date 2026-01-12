import React from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaCalendarCheck,
  FaBullseye,
  FaLightbulb,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { FaGlobe } from "react-icons/fa6";

const services = [
  {
    id: 1,
    title: "Discover Clubs",
    description:
      "Find clubs that match your interests, location, and passion. Never miss out on the communities you love.",
    icon: <FaUsers className="text-4xl text-primary mb-4" />,
  },
  {
    id: 2,
    title: "Join Events Easily",
    description:
      "Attend events and workshops effortlessly. RSVP, get reminders, and engage with members seamlessly.",
    icon: <FaCalendarCheck className="text-4xl text-primary mb-4" />,
  },
  {
    id: 3,
    title: "Achieve Your Goals",
    description:
      "Participate, network, and grow within your community to reach your personal and professional goals.",
    icon: <FaBullseye className="text-4xl text-primary mb-4" />,
  },
  {
    id: 4,
    title: "Get Inspired",
    description:
      "Learn from experts, attend inspiring sessions, and connect with motivated individuals in every club.",
    icon: <FaLightbulb className="text-4xl text-primary mb-4" />,
  },
  {
    id: 5,
    title: "Connect Globally",
    description:
      "Network with members across different cities and countries to broaden your horizon and exchange ideas.",
    icon: <FaGlobe className="text-4xl text-primary mb-4" />,
  },
  {
    id: 6,
    title: "Exclusive Workshops",
    description:
      "Gain access to members-only workshops, masterclasses, and sessions curated to boost your skills.",
    icon: <FaChalkboardTeacher className="text-4xl text-primary mb-4" />,
  },
];

const Services = () => {
  return (
    <section className="py-20 bg-base-200">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">
          Our <span className="text-primary">Services</span>
        </h2>
        <p className="text-base-content/70 mb-12">
          ClubSphere helps you explore, connect, and grow with the right
          communities.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              whileHover={{ scale: 1.05 }}
              className="bg-base-100 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all text-center flex flex-col items-center justify-center"
            >
              {service.icon}
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-base-content/70">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
