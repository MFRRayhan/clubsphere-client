import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";

const PaymentHistory = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.email) return;

    axiosSecure
      .get("/admin/payments")
      .then((res) => {
        setPayments(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Payment fetch error:", err);
        setError("You are not authorized to view payments");
        setLoading(false);
      });
  }, [axiosSecure, user]);

  if (loading) {
    return <Loader></Loader>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (payments.length === 0) {
    return <div className="text-center py-10">No payment history found</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-4xl text-primary font-bold mb-6">All Payments</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Index</th>
              <th>User</th>
              <th>Transaction ID</th>
              <th>Payment Type</th>
              <th>Club</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p, index) => (
              <tr key={p._id}>
                <td>{index + 1}</td>
                <td>{p.userEmail}</td>
                <td className="font-mono text-xs">{p.transactionId}</td>
                <td>{p.paymentType}</td>
                <td>{p.clubName || "N/A"}</td>
                <td>{p.amount} BDT</td>
                <td>{new Date(p.paidAt).toLocaleDateString("en-GB")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
