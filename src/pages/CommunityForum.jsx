import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FaHeart, FaComment, FaUserCircle } from "react-icons/fa";
import { toast } from "@/hooks/use-toast";
import supabase from "../db/supabaseClient";
import Header from "../components/header";

const CommunityForum = () => {
  const { user, isAuthenticated } = useAuth0();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "support",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    {
      id: "support",
      name: "Support & Stories",
      description: "Share your journey and support others",
    },
    {
      id: "achievements",
      name: "Achievements",
      description: "Celebrate your milestones",
    },
  ];

  useEffect(() => {
    fetchPosts();
    subscribeToChanges();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("forum_posts")
        .select(
          `
          *,
          likes:post_likes(count),
          comments:post_comments(count),
          user_liked:post_likes(user_id)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        title: "Error",
        description: "Failed to load posts. Please try again.",
        variant: "destructive",
      });
    }
  };

  const subscribeToChanges = () => {
    const postsSubscription = supabase
      .channel("public:forum_posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "forum_posts" },
        fetchPosts
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postsSubscription);
    };
  };

  const handleCreatePost = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a post.",
        variant: "destructive",
      });
      return;
    }

    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("forum_posts").insert([
        {
          title: newPost.title,
          content: newPost.content,
          category: newPost.category,
          user_id: user.sub,
          author_name: user.name,
        },
      ]);

      if (error) throw error;

      setNewPost({ title: "", content: "", category: "support" });
      toast({
        title: "Success",
        description: "Your post has been created.",
      });
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (postId) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to like posts.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: existingLike } = await supabase
        .from("post_likes")
        .select()
        .eq("post_id", postId)
        .eq("user_id", user.sub)
        .single();

      if (existingLike) {
        await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.sub);
      } else {
        await supabase
          .from("post_likes")
          .insert([{ post_id: postId, user_id: user.sub }]);
      }
    } catch (error) {
      console.error("Error handling like:", error);
      toast({
        title: "Error",
        description: "Failed to process like. Please try again.",
        variant: "destructive",
      });
    }
  };

  const PostCard = ({ post }) => (
    <Card className="mb-4 hover:bg-pastel-blue/10 transition-all duration-300 border-l-4 border-l-pastel-blue">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg text-gray-800">
              {post.title}
            </h3>
            <Badge
              variant="secondary"
              className="bg-pastel-purple/20 text-pastel-purple"
            >
              {post.category}
            </Badge>
          </div>

          <p className="text-gray-600">{post.content}</p>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <FaUserCircle className="w-4 h-4 text-pastel-blue" />
              <span>{post.author_name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-pastel-pink hover:text-pastel-pink/80"
              onClick={() => handleLike(post.id)}
            >
              <FaHeart className="w-4 h-4" />
              <span>{post.likes?.[0]?.count || 0}</span>
            </Button>
            <div className="flex items-center gap-1">
              <FaComment className="w-4 h-4 text-pastel-purple" />
              <span>{post.comments?.[0]?.count || 0} comments</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-blue/20 via-pastel-purple/10 to-pastel-pink/20">
      <Header />
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Support Community
          </h1>
          <p className="text-gray-600">
            A safe space to share your journey and support others
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-pastel-blue hover:bg-pastel-blue/90 text-white mb-8">
              Share Your Story
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Title"
                value={newPost.title}
                onChange={(e) =>
                  setNewPost({ ...newPost, title: e.target.value })
                }
              />
              <Textarea
                placeholder="Share your thoughts..."
                value={newPost.content}
                onChange={(e) =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
                className="min-h-[100px]"
              />
              <select
                value={newPost.category}
                onChange={(e) =>
                  setNewPost({ ...newPost, category: e.target.value })
                }
                className="w-full p-2 rounded-md border border-gray-300"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <Button
                onClick={handleCreatePost}
                disabled={isSubmitting}
                className="w-full bg-pastel-blue hover:bg-pastel-blue/90"
              >
                {isSubmitting ? "Posting..." : "Post"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-white/50 p-1 rounded-xl">
            <TabsTrigger value="all">All Posts</TabsTrigger>
            {categories.map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id}>
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </TabsContent>

          {categories.map((cat) => (
            <TabsContent key={cat.id} value={cat.id}>
              <div className="space-y-4">
                {posts
                  .filter((post) => post.category === cat.id)
                  .map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default CommunityForum;
