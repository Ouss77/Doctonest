"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Image, Video, FileText, Smile, Send } from "lucide-react";
import { useAuth } from "@/lib/auth";

interface Post {
  id: string;
  author: {
    name: string;
    avatar?: string;
    role: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  imageUrl?: string;
}

export default function FeedSection() {
  const { user, profile } = useAuth();
  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = async () => {
    if (!postContent.trim() || !user) return;
    
    setIsPosting(true);
    try {
      // Simuler la création d'un post (à remplacer par un vrai appel API)
      const newPost: Post = {
        id: Date.now().toString(),
        author: {
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Utilisateur",
          avatar: profile?.photo_url,
          role: profile?.profession || "Médecin remplaçant",
        },
        content: postContent,
        timestamp: "À l'instant",
        likes: 0,
        comments: 0,
      };
      
      setPosts([newPost, ...posts]);
      setPostContent("");
    } catch (error) {
      console.error("Erreur lors de la publication:", error);
    } finally {
      setIsPosting(false);
    }
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  return (
    <div className="space-y-4">
      {/* Create Post Card - LinkedIn Style */}
      <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="w-10 h-10 flex-shrink-0">
              {profile?.photo_url ? (
                <img
                  src={profile.photo_url}
                  alt={`${user?.firstName || ""} ${user?.lastName || ""}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                  {user?.firstName?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </Avatar>
            <div className="flex-1">
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Partagez une mise à jour..."
                className="w-full min-h-[80px] p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                rows={3}
              />
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-md transition-colors" title="Photo">
                    <Image className="w-5 h-5 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-md transition-colors" title="Vidéo">
                    <Video className="w-5 h-5 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-md transition-colors" title="Document">
                    <FileText className="w-5 h-5 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-md transition-colors" title="Émoji">
                    <Smile className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <Button
                  onClick={handlePost}
                  disabled={!postContent.trim() || isPosting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 font-medium"
                  size="sm"
                >
                  <Send className="w-4 h-4 mr-1" />
                  Publier
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      {posts.length === 0 ? (
        <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-2">
              <FileText className="w-12 h-12 mx-auto mb-3" />
            </div>
            <p className="text-gray-500 text-sm">
              Aucune publication pour le moment. Commencez à partager !
            </p>
          </CardContent>
        </Card>
      ) : (
        posts.map((post) => (
          <Card key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              {/* Post Header */}
              <div className="flex items-start gap-3 mb-3">
                <Avatar className="w-10 h-10 flex-shrink-0">
                  {post.author.avatar ? (
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                      {post.author.name[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-gray-900 truncate">
                      {post.author.name}
                    </h3>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{post.timestamp}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{post.author.role}</p>
                </div>
              </div>

              {/* Post Content */}
              <div className="mb-3">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{post.content}</p>
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt="Post image"
                    className="w-full rounded-lg mt-3 object-cover max-h-96"
                  />
                )}
              </div>

              {/* Post Actions */}
              <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  <span className="text-sm font-medium">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="text-sm font-medium">{post.comments}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span className="text-sm font-medium">Partager</span>
                </button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
