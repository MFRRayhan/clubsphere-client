import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import React, { useState } from "react";
import { useParams } from "react-router";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const ClubDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();

  const [isOpen, setIsOpen] = useState(false);

  const modalOpen = () => setIsOpen(true);
  const modalClose = () => setIsOpen(false);

  // Get single club data
  const { data: club, isLoading } = useQuery({
    queryKey: ["club", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/clubs/${id}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="py-20 text-center text-lg font-medium">
        Loading club details...
      </div>
    );
  }

  return (
    <div className="my-10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left Image */}
          <figure>
            <img
              src={club.bannerImage}
              alt={club.clubName}
              className="w-full rounded-lg shadow"
            />
          </figure>

          {/* Right Content */}
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold">{club.clubName}</h2>

            <p className="text-gray-700">{club.description}</p>

            <p>
              <span className="font-semibold">Category:</span> {club.category}
            </p>

            <p>
              <span className="font-semibold">Location:</span> {club.location}
            </p>

            <p>
              <span className="font-semibold">Membership Fee:</span> $
              {club.membershipFee}
            </p>

            <p
              className={`font-semibold ${
                club.status === "approved"
                  ? "text-green-600"
                  : club.status === "pending"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              Status: {club.status}
            </p>

            <button onClick={modalOpen} className="btn btn-primary">
              Buy Membership
            </button>

            {/* Modal */}
            <Dialog
              open={isOpen}
              as="div"
              className="relative z-10 focus:outline-none"
              onClose={modalClose}
            >
              <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/50">
                <div className="flex min-h-full items-center justify-center p-4">
                  <DialogPanel
                    transition
                    className="w-full max-w-md rounded-xl p-6 backdrop-blur-2xl duration-300 ease-out
                    data-closed:transform-[scale(95%)] data-closed:opacity-0 bg-gray-900"
                  >
                    <DialogTitle
                      as="h3"
                      className="text-lg font-semibold text-white"
                    >
                      Payment Successful
                    </DialogTitle>
                    <p className="mt-2 text-sm text-white/60">
                      Your membership purchase is completed. A confirmation
                      email has been sent.
                    </p>
                    <div className="mt-4">
                      <Button
                        className="btn btn-primary w-full"
                        onClick={modalClose}
                      >
                        Close
                      </Button>
                    </div>
                  </DialogPanel>
                </div>
              </div>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetails;
