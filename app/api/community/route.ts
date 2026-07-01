import { route, json } from "@/lib/api"
import { CommunityPost } from "@/models"

type PostDoc = {
  _id: { toString(): string }
  author?: { name?: string; avatar?: string }
  content: string
  createdAt: Date
  likes: number
  comments: number
  likedBy?: string[]
  tags?: string[]
}

function shape(post: PostDoc, uid: string) {
  return {
    id: post._id.toString(),
    author: { name: post.author?.name || "User", avatar: post.author?.avatar || "" },
    content: post.content,
    timestamp: post.createdAt,
    likes: post.likes,
    comments: post.comments,
    liked: post.likedBy?.includes(uid) ?? false,
    tags: post.tags ?? [],
  }
}

export const GET = route(async ({ uid }) => {
  const posts = await CommunityPost.find().sort({ createdAt: -1 }).limit(100).lean<PostDoc[]>()
  return json(posts.map((p) => shape(p, uid)))
})

export const POST = route(async ({ uid, req }) => {
  const { content, authorName = "User", tags = [] } = await req.json()
  if (!content?.trim()) return json({ error: "content is required" }, 400)
  const post = await CommunityPost.create({
    uid,
    author: { name: authorName },
    content: content.trim(),
    tags,
  })
  return json(shape(post.toObject() as PostDoc, uid), 201)
})
