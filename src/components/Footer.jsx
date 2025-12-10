// Footer.jsx
import React from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { FaX } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
        {/* About */}
        <div>
          <h3 className="text-xl font-bold mb-2">ClubSphere</h3>
          <p className="text-gray-300">
            ClubSphere helps you discover, join, and manage local clubs
            effortlessly. Connect, share, and grow with your community!
          </p>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-bold mb-2">Contact</h3>
          <ul className="text-gray-300 space-y-1">
            <li>Email: info@clubsphere.com</li>
            <li>Phone: +880 123 456 789</li>
            <li>Address: Dhaka, Bangladesh</li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-xl font-bold mb-2">Follow Us</h3>
          <div className="flex space-x-4 text-gray-300 text-2xl">
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/yourusername/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://twitter.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              <FaX />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} ClubSphere. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
