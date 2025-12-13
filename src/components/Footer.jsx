import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-neutral text-neutral-content">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand Info */}
          <div>
            <h3 className="text-4xl font-bold mb-4 text-primary">ClubSphere</h3>
            <p className="text-neutral-content/70 leading-relaxed">
              ClubSphere empowers communities by helping people discover, join,
              and manage clubs effortlessly. Connect, engage, and grow together.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contact</h4>
            <ul className="space-y-2 text-neutral-content/70">
              <li>Email: support@clubsphere.com</li>
              <li>Phone: +880 1234 567 890</li>
              <li>Location: Dhaka, Bangladesh</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-primary hover:text-white transition-all"
              >
                <FaGithub size={20} />
              </a>

              <a
                href="https://www.linkedin.com/in/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-primary hover:text-white transition-all"
              >
                <FaLinkedin size={20} />
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-primary hover:text-white transition-all"
              >
                <FaXTwitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-14 border-t border-white/10 pt-6 text-center text-sm text-neutral-content/60">
          &copy; {new Date().getFullYear()} ClubSphere. All rights reserved by{" "}
          <a
            href="https://github.com/MFRRayhan"
            className="text-primary font-semibold"
          >
            MFR Rayhan
          </a>
          .
        </div>
      </div>
    </footer>
  );
};

export default Footer;
