"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
  let subscription: any;

  supabase.auth.getUser().then(({ data }) => {
    const currentUser = data.user;
    setUser(currentUser);

    if (currentUser) {
      fetchBookmarks(currentUser.id);

      subscription = supabase
        .channel("realtime-bookmarks")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "bookmarks" },
          () => {
            fetchBookmarks(currentUser.id);
          }
        )
        .subscribe();
    }
  });

  return () => {
    if (subscription) supabase.removeChannel(subscription);
  };
}, []);

  const fetchBookmarks = async (userId: string) => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("id", { ascending: false });

    setBookmarks(data || []);
  };

  const login = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const addBookmark = async () => {
    if (!url || !title) return;

    await supabase.from("bookmarks").insert([
      {
        user_id: user.id,
        url,
        title,
      },
    ]);

    setUrl("");
    setTitle("");
    fetchBookmarks(user.id);
  };

  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    fetchBookmarks(user.id);
  };

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <button
          onClick={login}
          className="px-6 py-3 bg-black text-white rounded-lg"
        >
          Sign in with Google
        </button>
      </main>
    );
  }

  return (
    <main className="p-10 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Your Bookmarks</h1>

      <div className="space-y-2">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2"
        />
        <input
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full border p-2"
        />
        <button
          onClick={addBookmark}
          className="px-4 py-2 bg-black text-white"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {bookmarks.map((b) => (
          <li key={b.id} className="flex justify-between border p-2">
            <a href={b.url} target="_blank" className="underline">
              {b.title}
            </a>
            <button
              onClick={() => deleteBookmark(b.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
