import React, { useState, useEffect } from "react";
import { getAllPost } from "@/Api/postApi";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ItemList = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [tab, setTab] = useState("found");
  const [items, setItems] = useState([]);

  const fetchPosts = async () => {
    try {
      const query = {
        status: tab,
        itemName: search,
        category: category || undefined,
        date: date || undefined,
      };

      const response = await getAllPost(query);
      setItems(response.data.data || []);
      console.log(response.data.data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [tab]);

  const handleSearch = () => {
    fetchPosts();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-800 px-4 py-10 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab} className="mb-8">
          <TabsList className="bg-zinc-800/50 backdrop-blur   p-1 w-full max-w-xs mx-auto flex justify-center">
            <TabsTrigger
              value="found"
              className={`px-6 py-2 text-sm font-medium rounded-lg transition ${
                tab === "found"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-zinc-300 hover:text-white"
              }`}
            >
              Found
            </TabsTrigger>
            <TabsTrigger
              value="lost"
              className={`px-6 py-2 text-sm font-medium rounded-lg transition ${
                tab === "lost"
                  ? "bg-red-600 text-white shadow"
                  : "text-zinc-300 hover:text-white"
              }`}
            >
              Lost
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Input
            placeholder="🔍 Search by item name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-zinc-800/60 border border-zinc-700 text-white placeholder:text-zinc-400"
          />
          <Input
            placeholder="📂 Filter by category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-zinc-800/60 border border-zinc-700 text-white placeholder:text-zinc-400"
          />
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-zinc-800/60 border border-zinc-700 text-white"
          />
        </div>

        <div className="text-center mb-12">
          <Button
            onClick={handleSearch}
            className="bg-indigo-600 hover:bg-indigo-700 px-6 text-white"
          >
            🔎 Filter
          </Button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8">
          {items.length > 0 ? (
            items.map((item) => (
              <Link
                to={`/text/${item.user}`}
                key={item._id}
                className="relative group w-40 h-64 overflow-hidden rounded-lg shadow-md border border-zinc-700 hover:shadow-lg transition"
              >
                <img
                  src={`http://localhost:8000/${item.imageUrl}`}
                  alt={item.itemName}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs font-semibold px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                  {item.itemName}
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-zinc-500 text-lg col-span-full mt-20">
              No items found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemList;
