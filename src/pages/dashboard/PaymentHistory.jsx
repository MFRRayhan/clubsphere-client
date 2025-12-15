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

  if (loading) return <Loader />;

  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  if (payments.length === 0)
    return <div className="text-center py-10">No payment history found</div>;

  // Filtered payments based on searchText
  const filteredPayments = payments.filter((p) =>
    `${p.userEmail} ${p.transactionId} ${p.clubName || ""}`
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Title + Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-primary">All Payments</h2>

        <div className="w-full md:w-80">
          <div className="input input-bordered flex items-center gap-2">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by user, transaction ID or club..."
              className="grow"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* DaisyUI Table */}
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
            {filteredPayments.length > 0 ? (
              filteredPayments.map((p, index) => (
                <tr key={p._id}>
                  <td>{index + 1}</td>
                  <td>{p.userEmail}</td>
                  <td className="font-mono text-xs">{p.transactionId}</td>
                  <td>{p.paymentType}</td>
                  <td>{p.clubName || "N/A"}</td>
                  <td>{p.amount} BDT</td>
                  <td>{new Date(p.paidAt).toLocaleDateString("en-GB")}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
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
