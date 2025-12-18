import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loader from "../../components/Loader";

const ManagerPayments = () => {
  const axiosSecure = useAxiosSecure();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axiosSecure.get("/manager/payments");
        setPayments(res.data);
      } catch (error) {
        console.error("Error fetching manager payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [axiosSecure]);

  if (loading) return <Loader />;

  if (!payments.length)
    return (
      <div className="text-center py-20 text-error text-2xl">
        No payments found
      </div>
    );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-primary mb-6">Payment History</h2>

      <div className="overflow-x-auto bg-base-100 rounded-xl shadow">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Index</th>
              <th>Type</th>
              <th>User</th>
              <th>Amount</th>
              <th>Transaction</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p, i) => (
              <tr key={p._id}>
                <td>{i + 1}</td>
                <td>
                  <span className="badge badge-info capitalize text-white font-semibold">
                    {p.paymentType}
                  </span>
                </td>
                <td>{p.userEmail}</td>
                <td>
                  {p.amount === 0 ? (
                    "Free"
                  ) : (
                    <>
                      <b>BDT.</b>
                      {p.amount}
                    </>
                  )}
                </td>

                <td className="text-xs">{p.transactionId}</td>
                <td>{new Date(p.paidAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerPayments;
