import React from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom"; // Link ইমপোর্ট করা হয়েছে
import Loader from "../../components/Loader"; // Loader ইমপোর্ট করা হয়েছে

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payments", user?.email],
    queryFn: async () => {
      // 🎯 API Endpoint আপডেট করা হয়েছে
      const res = await axiosSecure.get(`/payments/history`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) {
    return <Loader />;
  }

  // 🎯 যদি কোনো পেমেন্ট না থাকে তার জন্য বার্তা
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
          {/* head */}
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
                  {/* clubId বা eventId এর উপর ভিত্তি করে Item Type নির্ধারণ */}
                  {payment.clubId
                    ? "Membership"
                    : payment.eventId
                    ? "Event Fee"
                    : "N/A"}
                </td>
                <td>
                  {/* item.clubName বা item.eventName দেখাবে */}
                  {payment.clubName || payment.eventName || "Unknown Item"}
                </td>
                <td>
                  <b>$ </b>
                  {payment.amount}
                </td>
                <td>{new Date(payment.paidAt).toLocaleDateString()}</td>
                <td className="text-xs font-mono">{payment.transactionId}</td>
                <td>
                  {/* ক্লাব বা ইভেন্টের ডিটেইলস-এ যাওয়ার লিঙ্ক */}
                  {payment.clubId ? (
                    <Link
                      to={`/clubs/${payment.clubId}`}
                      className="btn btn-sm btn-ghost text-primary hover:bg-primary/10"
                    >
                      View Club
                    </Link>
                  ) : payment.eventId ? (
                    <Link
                      to={`/events/${payment.eventId}`}
                      className="btn btn-sm btn-ghost text-primary hover:bg-primary/10"
                    >
                      View Event
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
