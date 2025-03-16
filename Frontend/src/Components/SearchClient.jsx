import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";

const SearchClient = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState("");

    // Call onSearch whenever searchQuery changes
    useEffect(() => {
        onSearch(searchQuery);
    }, [searchQuery, onSearch]);

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent form submission
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 flex items-center">
            <input
                type="text"
                id="search"
                placeholder="Search by name..."
                className="w-full p-2 border rounded-l"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded-r flex items-center"
            >
                <Search className="mr-2" /> Search
            </button>
        </form>
    );
};

export default SearchClient;