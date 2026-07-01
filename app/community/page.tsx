"use client"

import { useState, useEffect } from "react"
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
  const [posts, setPosts] = useState<Post[]>([])
  const [newPostContent, setNewPostContent] = useState("")
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setUserName(user.name || "User")
    }

    const storedPosts = localStorage.getItem("communityPosts")
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts))
    } else {
      const samplePosts: Post[] = [
        {
          id: "1",
          author: { name: "Sarah J." },
          content: "Just completed my morning stretches! My back feels so much better already. 💪",
          timestamp: "2 hours ago",
          likes: 12,
          comments: 3,
          tags: ["MorningRoutine", "StretchGoals"],
        },
        {
          id: "2",
          author: { name: "Michael T." },
          content:
            "Has anyone tried using a standing desk? I'm considering getting one to help with my lower back pain during work hours.",
          timestamp: "Yesterday",
          likes: 8,
          comments: 7,
          tags: ["WorkSetup", "StandingDesk"],
        },
        {
          id: "3",
          author: { name: "Dr. Lisa Chen" },
          content:
            "Quick tip: When sitting for long periods, make sure your feet are flat on the floor and your knees are at a 90-degree angle. This helps maintain proper posture and reduces strain on your back.",
          timestamp: "2 days ago",
          likes: 24,
          comments: 5,
          tags: ["ExpertTip", "Posture"],
        },
        {
          id: "4",
          author: { name: "Alex W." },
          content:
            "I've been using the VitalTrack app for a month now, and my back pain has decreased significantly! The exercise plans and posture reminders have been game-changers for me.",
          timestamp: "3 days ago",
          likes: 18,
          comments: 2,
          tags: ["Success", "Progress"],
        },
        {
          id: "5",
          author: { name: "Jamie L." },
          content:
            "Just had my first appointment with a physical therapist recommended through the app. So grateful for this community and all the resources!",
          timestamp: "4 days ago",
          likes: 15,
          comments: 4,
          tags: ["PhysicalTherapy", "Grateful"],
        },
      ]

      setPosts(samplePosts)
      localStorage.setItem("communityPosts", JSON.stringify(samplePosts))
    }
  }, [])

  const handlePostSubmit = () => {
    if (!newPostContent.trim()) {
      toast({
        title: "Empty post",
        description: "Please write something before posting",
        variant: "destructive",
      })
      return
    }

    const newPost: Post = {
      id: Date.now().toString(),
      author: { name: userName },
      content: newPostContent,
      timestamp: "Just now",
      likes: 0,
      comments: 0,
      tags: ["NewPost"],
    }

    const updatedPosts = [newPost, ...posts]
    setPosts(updatedPosts)
    localStorage.setItem("communityPosts", JSON.stringify(updatedPosts))

    setNewPostContent("")

    toast({
      title: "Post shared",
      description: "Your post has been shared with the community",
    })
  }

  const handleLikePost = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const isLiked = post.liked || false
          return {
            ...post,
            likes: isLiked ? post.likes - 1 : post.likes + 1,
            liked: !isLiked,
          }
        }
        return post
      }),
    )
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
              <CardDescription>{post.timestamp}</CardDescription>
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
