import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import Loader from "../../components/Loader";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const ManagerPayments = () => {
  const axiosSecure = useAxiosSecure();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

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

  // 🔍 Search Filter Logic
  const filteredPayments = payments.filter(
    (p) =>
      p.transactionId.toLowerCase().includes(searchText.toLowerCase()) ||
      p.userEmail.toLowerCase().includes(searchText.toLowerCase()) ||
      p.paymentType.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) return <Loader />;

  if (!payments.length)
    return (
      <div className="text-center py-20 text-error text-2xl">
        No payments found
      </div>
    );

  return (
    <div className="py-5">
      <div className="container mx-auto">
        {/* Title + Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-primary">Payments</h2>

          <div className="w-full md:w-80">
            <div className="input input-bordered flex items-center gap-2">
              <FaSearch className="text-gray-300" />
              <input
                type="search"
                placeholder="Search Transaction / Email / Type"
                className="grow"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl shadow">
          <table className="table w-full">
            <thead className="bg-base-300">
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
              {filteredPayments.length > 0 ? (
                filteredPayments.map((p, i) => (
                  <tr key={p._id} className="hover:bg-base-200">
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
                        <div className="flex gap-1 items-center">
                          <FaBangladeshiTakaSign className="text-primary" />
                          {p.amount}
                        </div>
                      )}
                    </td>

                    <td className="text-xs">{p.transactionId}</td>

                    <td>{new Date(p.paidAt).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-10 text-error font-semibold"
                  >
                    No Results Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerPayments;
