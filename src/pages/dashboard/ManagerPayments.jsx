import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";

const ManagerPayments = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        // ১️⃣ প্রথমে ম্যানেজারের ইভেন্টগুলি নিয়ে আসা
        const { data: myEvents } = await axiosSecure.get(
          "/manager/my-active-events-with-registrations"
        );

        // ২️⃣ প্রতিটি ইভেন্ট থেকে পার্টিসিপেন্টদের ফিল্টার করা
        const allPayments = [];
        myEvents.forEach((event) => {
          event.participants.forEach((p) => {
            if (p.fee > 0) {
              allPayments.push({
                eventName: event.eventName,
                participantEmail: p.userEmail,
                participantName: p.userName,
                amount: p.fee,
                status: p.status,
                paidAt: p.joinDate,
              });
            }
          });
        });

        setPayments(allPayments);
      } catch (error) {
        console.error("Failed to fetch payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [axiosSecure]);

  if (loading) return <Loader />;

  if (!payments.length)
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-semibold text-gray-700">
          No payments found for your events.
        </h3>
      </div>
    );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-primary">
        My Event Payments
      </h2>

      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Index</th>
              <th>Event Name</th>
              <th>Participant</th>
              <th>Email</th>
              <th>Amount (BDT)</th>
              <th>Status</th>
              <th>Paid At</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{p.eventName}</td>
                <td>{p.participantName}</td>
                <td>{p.participantEmail}</td>
                <td>{p.amount}</td>
                <td>
                  <span
                    className={`badge capitalize text-white font-semibold ${
                      p.status === "paid" ? "badge-success" : "badge-warning"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
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
