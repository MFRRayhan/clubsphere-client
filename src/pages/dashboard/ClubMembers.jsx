import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";

const ClubMembers = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axiosSecure.get("/my-clubs").then((res) => {
      setClubs(res.data);
    });
  }, [axiosSecure]);

  const handleLoadMembers = async (clubId) => {
    setSelectedClub(clubId);
    setLoading(true);
    const res = await axiosSecure.get(`/manager/club-members/${clubId}`);
    setMembers(res.data);
    setLoading(false);
  };

  return (
    <div>
      <div className="text-center">
        <h2 className="text-2xl text-primary font-bold mb-4">Club Members</h2>

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
      </div>

      {/* Members Table */}
      {loading && <Loader></Loader>}

      {!loading && members.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Index</th>
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
                  <td>
                    <b>BDT.</b> {m.membershipFee}
                  </td>
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
