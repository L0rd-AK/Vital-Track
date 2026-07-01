"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { apiFetch, ApiError } from "@/lib/api-client"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Heart, MessageSquare, Send } from "lucide-react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface Post {
  id: string
  author: {
    name: string
    avatar?: string
  }
  content: string
  timestamp: string
  likes: number
  comments: number
  liked?: boolean
  tags?: string[]
}

export default function Community() {
  const { toast } = useToast()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [newPostContent, setNewPostContent] = useState("")
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setUserName(user.name || "User")
    }
  }, [])

  useEffect(() => {
    let active = true
    apiFetch<Post[]>("/api/community")
      .then((d) => {
        if (active) setPosts(d)
      })
      .catch((err) => {
        if (!active) return
        if (err instanceof ApiError && err.status === 401) {
          router.push("/login")
          return
        }
        toast({
          title: "Couldn't load posts",
          description: err instanceof Error ? err.message : "Something went wrong",
          variant: "destructive",
        })
      })
    return () => {
      active = false
    }
  }, [router, toast])

  const handlePostSubmit = async () => {
    if (!newPostContent.trim()) {
      toast({
        title: "Empty post",
        description: "Please write something before posting",
        variant: "destructive",
      })
      return
    }

    try {
      const createdPost = await apiFetch<Post>("/api/community", {
        method: "POST",
        body: JSON.stringify({
          content: newPostContent,
          authorName: userName,
          tags: ["NewPost"],
        }),
      })

      setPosts((prevPosts) => [createdPost, ...prevPosts])
      setNewPostContent("")

      toast({
        title: "Post shared",
        description: "Your post has been shared with the community",
      })
    } catch (err) {
      toast({
        title: "Couldn't share post",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      })
    }
  }

  const handleLikePost = async (postId: string) => {
    try {
      const result = await apiFetch<{ liked: boolean; likes: number }>(
        `/api/community/${postId}/like`,
        { method: "POST" },
      )

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, liked: result.liked, likes: result.likes }
            : post,
        ),
      )
    } catch (err) {
      toast({
        title: "Couldn't update like",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      })
    }
  }

  const renderPostCard = (post: Post) => (
    <Card key={post.id}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{post.author.name}</CardTitle>
              <CardDescription>{new Date(post.timestamp).toLocaleString()}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p>{post.content}</p>
        {post.tags && post.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <div className="flex gap-4">
          <Button
            variant="ghost"
            size="sm"
            className={post.liked ? "text-red-500" : ""}
            onClick={() => handleLikePost(post.id)}
          >
            <Heart className="mr-1 h-4 w-4" /> {post.likes}
          </Button>
          <Button variant="ghost" size="sm">
            <MessageSquare className="mr-1 h-4 w-4" /> {post.comments}
          </Button>
        </div>
        <Button variant="ghost" size="sm">
          Reply
        </Button>
      </CardFooter>
    </Card>
  )

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="mb-6 text-3xl font-bold text-rich-navy">Community Support</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Share with the Community</CardTitle>
              <CardDescription>Post updates, ask questions, or share your progress</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="What's on your mind?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={3}
                className="mb-4"
              />
              <div className="flex justify-end">
                <Button onClick={handlePostSubmit} className="bg-soft-blue hover:bg-soft-blue/90">
                  <Send className="mr-2 h-4 w-4" /> Share Post
                </Button>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="all">
            <TabsList className="mb-4 grid w-full grid-cols-3">
              <TabsTrigger value="all">All Posts</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="success">Success Stories</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {posts.map(renderPostCard)}
            </TabsContent>

            <TabsContent value="questions" className="space-y-4">
              {posts
                .filter(
                  (post) =>
                    post.content.includes("?") ||
                    (post.tags && post.tags.includes("Question")),
                )
                .map(renderPostCard)}
            </TabsContent>

            <TabsContent value="success" className="space-y-4">
              {posts
                .filter(
                  (post) =>
                    post.tags &&
                    post.tags.some((tag) =>
                      ["Success", "Progress", "Grateful"].includes(tag),
                    ),
                )
                .map(renderPostCard)}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
