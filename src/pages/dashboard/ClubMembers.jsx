import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import Loader from "../../components/Loader";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const ClubMembers = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState("");
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Fetch clubs
  useEffect(() => {
    axiosSecure.get("/my-clubs").then((res) => {
      setClubs(res.data);
    });
  }, [axiosSecure]);

  // Fetch members for a selected club
  const handleLoadMembers = async (clubId) => {
    setSelectedClub(clubId);
    setLoading(true);
    const res = await axiosSecure.get(`/manager/club-members/${clubId}`);
    setMembers(res.data);
    setFilteredMembers(res.data);
    setLoading(false);
  };

  // Filter members dynamically based on search input
  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredMembers(members);
    } else {
      const filtered = members.filter((m) => {
        const nameMatch = m.userInfo.displayName
          ?.toLowerCase()
          .includes(searchText.toLowerCase());
        const emailMatch = m.userEmail
          ?.toLowerCase()
          .includes(searchText.toLowerCase());
        return nameMatch || emailMatch;
      });
      setFilteredMembers(filtered);
    }
  }, [searchText, members]);

  return (
    <div className="py-5">
      <div className="container mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl text-primary font-bold mb-4">Club Members</h2>

          {/* Club Selector */}
          <div className="flex justify-center gap-4 mb-4">
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

            {/* Search Input */}
            {selectedClub && members.length > 0 && (
              <div className="input input-bordered flex items-center gap-2">
                <FaSearch className="text-gray-300" />
                <input
                  type="search"
                  placeholder="Search club..."
                  className="grow"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Members Table */}
        {loading && <Loader />}

        {!loading && filteredMembers.length > 0 && (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
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
                {filteredMembers.map((m, index) => (
                  <tr key={m._id}>
                    <td>{index + 1}</td>
                    <td>{m.userInfo.displayName}</td>
                    <td>{m.userEmail}</td>
                    <td>{new Date(m.purchaseDate).toLocaleDateString()}</td>
                    <td className="flex items-center gap-1">
                      <FaBangladeshiTakaSign /> {m.membershipFee}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && selectedClub && filteredMembers.length === 0 && (
          <p className="text-2xl text-center font-semibold text-error">
            No members found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ClubMembers;
