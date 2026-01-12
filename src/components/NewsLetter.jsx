import React, { useState } from "react";
import { FaEnvelope } from "react-icons/fa6";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="bg-primary text-white py-20">
      <div className="container mx-auto text-center px-6">
        <h2 className="text-4xl font-bold mb-4">
          Subscribe to ClubSphere Newsletter
        </h2>
        <p className="mb-8 text-white/80 max-w-xl mx-auto">
          Stay updated with the latest events, clubs, and community updates.
          Join our newsletter to never miss out!
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-xl mx-auto"
        >
          <div className="relative w-full sm:flex-1">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 z-30 text-primary" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-3 pl-10 pr-4 rounded-lg text-black focus:outline-none input"
              required
            />
          </div>
          <button
            type="submit"
            className="btn bg-white text-primary hover:bg-white/90 px-6 py-3 rounded-lg font-semibold w-full sm:w-auto"
          >
            Subscribe
          </button>
        </form>

        {submitted && (
          <p className="mt-6 text-white/80">
            Thank you for subscribing! You will receive updates soon.
          </p>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
