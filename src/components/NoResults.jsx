import React from "react";
import { FaSearch } from "react-icons/fa";

const NoResults = ({ type = "items", searchTerm }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <FaSearch className="text-6xl text-gray-300 mb-4" />
      <h3 className="text-2xl font-semibold mb-2 text-primary">
        No {type} found
      </h3>
      {searchTerm && (
        <p className="text-gray-500">
          We couldn't find any {type} matching "
          <span className="font-medium text-gray-700">{searchTerm}</span>"
        </p>
      )}
      <p className="text-gray-400 mt-2">
        Try adjusting your search or explore other {type}.
      </p>
    </div>
  );
};

export default NoResults;
