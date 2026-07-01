"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle, MessageSquare, Send } from "lucide-react"

export default function Support() {
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Message sent",
        description: "We'll get back to you as soon as possible",
      })

      setName("")
      setEmail("")
      setMessage("")
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="mb-6 font-poppins text-3xl font-bold text-rich-navy">Support</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
            <CardDescription>We're here to help with any questions or issues</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="rounded-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="rounded-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you?"
                  rows={4}
                  required
                  className="rounded-xl"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Send Message
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Quick answers to common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I track my pain levels?</AccordionTrigger>
                  <AccordionContent>
                    You can track your pain levels using the Pain Tracker feature. Simply select your pain level on a
                    scale of 1-10, choose the location of your pain, and save the entry.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Can I export my data?</AccordionTrigger>
                  <AccordionContent>
                    Yes, you can export your data from the Settings page. This allows you to back up your information or
                    share it with healthcare providers.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>How do I set up exercise reminders?</AccordionTrigger>
                  <AccordionContent>
                    Go to the Exercise Reminders page, select the time you want to be reminded, add a label for your
                    reminder, and click "Add Reminder".
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Is my data private?</AccordionTrigger>
                  <AccordionContent>
                    Yes, your data is stored locally on your device and is not shared with anyone unless you explicitly
                    choose to share it with healthcare providers through the app.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle>Live Chat</CardTitle>
              <CardDescription>Chat with our support team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center space-y-4 py-6">
                <MessageSquare className="h-12 w-12 text-soft-blue" />
                <p className="text-center">Our support team is available Monday to Friday, 9am to 5pm.</p>
                <Button variant="outline" className="rounded-full">
                  Start Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="md:col-span-2 rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>Help Center</CardTitle>
            <CardDescription>Resources to help you get the most out of VitalTrack</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border p-4 text-center">
                <HelpCircle className="mx-auto mb-2 h-8 w-8 text-soft-blue" />
                <h3 className="mb-1 font-medium">User Guide</h3>
                <p className="mb-3 text-sm text-muted-foreground">Learn how to use all the features of VitalTrack</p>
                <Button variant="link" className="text-soft-blue">
                  View Guide
                </Button>
              </div>
              <div className="rounded-xl border p-4 text-center">
                <HelpCircle className="mx-auto mb-2 h-8 w-8 text-vibrant-green" />
                <h3 className="mb-1 font-medium">Video Tutorials</h3>
                <p className="mb-3 text-sm text-muted-foreground">Watch step-by-step tutorials for each feature</p>
                <Button variant="link" className="text-vibrant-green">
                  Watch Videos
                </Button>
              </div>
              <div className="rounded-xl border p-4 text-center">
                <HelpCircle className="mx-auto mb-2 h-8 w-8 text-warm-orange" />
                <h3 className="mb-1 font-medium">Community Forum</h3>
                <p className="mb-3 text-sm text-muted-foreground">Connect with other users to share tips and advice</p>
                <Button variant="link" className="text-warm-orange">
                  Join Forum
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
