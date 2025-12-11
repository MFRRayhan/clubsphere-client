import React from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { data: payments = [] } = useQuery({
    queryKey: ["payments", user.email],
    queryFn: async () => {
      const res = await axiosSecure(`/payments?email=${user.email}`);
      return res.data;
    },
  });
  return (
    <div className="p-4">
      <h2 className="text-4xl text-secondary font-black mb-4">
        Payment History
      </h2>
      <div className="overflow-x-auto">
        <table className="table w-full bg-white rounded-xl border border-gray-200 text-center">
          {/* head */}
          <thead>
            <tr>
              <th>Index</th>
              <th>Parcel Name</th>
              <th>Transaction ID</th>
              <th>Tracking No.</th>
              <th>Parcel Cost</th>
              <th>Payment Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr
                key={payment._id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-all duration-200"
              >
                <th>{index + 1}</th>
                <td>{payment.parcelName}</td>
                <td>{payment.transactionId}</td>
                <td>
                  <Link to={`/parcel-track/${payment.trackingId}`}>
                    {payment.trackingId}
                  </Link>
                </td>
                <td>
                  <b>$ </b>
                  {payment.amount}
                </td>
                <td>{payment.paidAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
