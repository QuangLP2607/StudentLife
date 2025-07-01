import { useState, useEffect } from "react";
import { PostsContext } from "./PostsContext";
import postService from "@/services/postService";

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await postService.getAllPosts();
        const postsData = response.data.data.posts;

        if (Array.isArray(postsData)) {
          setPosts(postsData);
        } else {
          setPosts([]);
          console.warn("postsData không phải mảng");
        }
      } catch (error) {
        setPosts([]);
        console.error("Lỗi fetchPosts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <PostsContext.Provider value={{ posts }}>{children}</PostsContext.Provider>
  );
}
