import React from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { FaEye } from "react-icons/fa";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payments", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments/history`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-2xl font-bold text-gray-700 mb-2">
          No Payment History Found
        </h3>
        <p className="text-gray-500">
          You haven't made any club membership or event payments yet.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-4xl text-secondary font-black mb-6">
        Payment History ({payments.length})
      </h2>
      <div className="overflow-x-auto rounded-xl shadow-lg border">
        <table className="table w-full bg-white text-center">
          <thead>
            <tr className="bg-gray-100 text-sm uppercase">
              <th>Index</th>
              <th>Item Type</th>
              <th>Item Name</th>
              <th>Amount</th>
              <th>Payment Date</th>
              <th>Transaction ID</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr
                key={payment._id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-all duration-200"
              >
                <th>{index + 1}</th>
                <td className="font-medium text-purple-600">
                  {payment.clubId
                    ? "Membership"
                    : payment.eventId
                    ? "Event Fee"
                    : "N/A"}
                </td>
                <td>
                  {payment.clubName || payment.eventName || "Unknown Item"}
                </td>
                <td>
                  <b>BDT. </b>
                  {payment.amount}
                </td>
                <td>{new Date(payment.paidAt).toLocaleDateString()}</td>
                <td className="text-xs font-mono">{payment.transactionId}</td>
                <td>
                  {payment.clubId ? (
                    <Link
                      to={`/clubs/${payment.clubId}`}
                      className="btn btn-square hover:bg-primary hover:text-white"
                    >
                      <FaEye />
                    </Link>
                  ) : payment.eventId ? (
                    <Link
                      to={`/events/${payment.eventId}`}
                      className="btn btn-square hover:bg-primary hover:text-white"
                    >
                      <FaEye />
                    </Link>
                  ) : (
                    "N/A"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
