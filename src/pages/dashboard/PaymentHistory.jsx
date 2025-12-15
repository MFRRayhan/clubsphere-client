import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";
import { FaSearch } from "react-icons/fa";

const PaymentHistory = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (!user?.email) return;

    axiosSecure
      .get("/payments/history")
      .then((res) => {
        setPayments(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Payment fetch error:", err);
        setError("Failed to load your payment history");
        setLoading(false);
      });
  }, [axiosSecure, user]);

  if (loading) return <Loader />;

  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  if (payments.length === 0)
    return <div className="text-center py-10">No payment history found</div>;

  // Filter payments based on search text
  const filteredPayments = payments.filter((p) =>
    `${p.transactionId} ${p.clubName || ""} ${p.eventName || ""}`
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-primary">My Payments</h2>
        <div className="w-full md:w-80">
          <div className="input input-bordered flex items-center gap-2">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by transaction ID, club or event..."
              className="grow"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Transaction ID</th>
              <th>Payment Type</th>
              <th>Club / Event</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((p, index) => (
                <tr key={p._id}>
                  <td>{index + 1}</td>
                  <td className="font-mono text-xs">{p.transactionId}</td>
                  <td>
                    {p.paymentType || (p.eventName ? "Event" : "Membership")}
                  </td>
                  <td>{p.clubName || p.eventName || "N/A"}</td>
                  <td>{p.amount} BDT</td>
                  <td>{new Date(p.paidAt).toLocaleDateString("en-GB")}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No matching payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
