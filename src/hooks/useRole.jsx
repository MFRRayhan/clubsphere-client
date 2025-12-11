// import React from "react";
// import useAuth from "./useAuth";
// import useAxiosSecure from "./useAxiosSecure";
// import { useQuery } from "@tanstack/react-query";

// const useRole = () => {
//   const { user } = useAuth();
//   const axiosSecure = useAxiosSecure();
//   const { isLoading: roleLoading, data: role = "user" } = useQuery({
//     queryKey: ["user-role", user],
//     queryFn: async () => {
//       const res = await axiosSecure(`/users/${user.email}/role`);
//       return res.data?.role;
//     },
//   });
//   return { roleLoading, role };
// };

// export default useRole;
