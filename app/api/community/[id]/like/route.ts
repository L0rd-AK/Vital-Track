import { route, json } from "@/lib/api"
import { CommunityPost } from "@/models"

// Toggle the current user's like on a post.
export const POST = route(async ({ uid, params }) => {
  const post = await CommunityPost.findById(params.id)
  if (!post) return json({ error: "Post not found" }, 404)

  const liked = post.likedBy.includes(uid)
  if (liked) {
    post.likedBy.pull(uid)
    post.likes = Math.max(0, post.likes - 1)
  } else {
    post.likedBy.push(uid)
    post.likes += 1
  }
  await post.save()
  return json({ liked: !liked, likes: post.likes })
})
