import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const ClubMembers = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1️⃣ Manager এর ক্লাবগুলো লোড
  useEffect(() => {
    axiosSecure.get("/my-clubs").then((res) => {
      setClubs(res.data);
    });
  }, [axiosSecure]);

  // 2️⃣ ক্লাব অনুযায়ী মেম্বার লোড
  const handleLoadMembers = async (clubId) => {
    setSelectedClub(clubId);
    setLoading(true);
    const res = await axiosSecure.get(`/manager/club-members/${clubId}`);
    setMembers(res.data);
    setLoading(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Club Members</h2>

      {/* Club Selector */}
      <div className="mb-6">
        <select
          className="select select-bordered w-full max-w-md"
          onChange={(e) => handleLoadMembers(e.target.value)}
        >
          <option value="">Select a club</option>
          {clubs.map((club) => (
            <option key={club._id} value={club._id}>
              {club.clubName}
            </option>
          ))}
        </select>
      </div>

      {/* Members Table */}
      {loading && <p>Loading members...</p>}

      {!loading && members.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>#</th>
                <th>Member</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Fee</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m, index) => (
                <tr key={m._id}>
                  <td>{index + 1}</td>
                  <td>{m.userInfo.displayName}</td>
                  <td>{m.userEmail}</td>
                  <td>{new Date(m.purchaseDate).toLocaleDateString()}</td>
                  <td>৳ {m.membershipFee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && selectedClub && members.length === 0 && (
        <p>No members found for this club.</p>
      )}
    </div>
  );
};

export default ClubMembers;
