"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { apiFetch, ApiError } from "@/lib/api-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon, Filter, MapPin, Search, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

interface Doctor {
  id: string
  name: string
  specialty: string
  location: string
  rating: number
  availableDates: string[]
  image?: string
}

interface Appointment {
  id: string
  doctorId: string
  doctorName: string
  specialty: string
  date: string
}

export default function DoctorSchedule() {
  const { toast } = useToast()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [specialtyFilter, setSpecialtyFilter] = useState("")
  const [date, setDate] = useState<Date>()
  const [appointments, setAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    let active = true

    const loadAppointments = async () => {
      try {
        const data = await apiFetch<Appointment[]>("/api/appointments")
        if (active) setAppointments(data)
      } catch (error) {
        if (!active) return
        if (error instanceof ApiError && error.status === 401) {
          router.push("/login")
          return
        }
        toast({
          title: "Unable to load appointments",
          description: "Please try again later.",
          variant: "destructive",
        })
      }
    }

    loadAppointments()

    return () => {
      active = false
    }
  }, [router, toast])

  // Sample doctors data
  const doctors: Doctor[] = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      specialty: "Orthopedic Surgeon",
      location: "Downtown Medical Center",
      rating: 4.8,
      availableDates: ["2023-04-20", "2023-04-21", "2023-04-25"],
    },
    {
      id: "2",
      name: "Dr. Michael Chen",
      specialty: "Physical Therapist",
      location: "Wellness Rehabilitation Clinic",
      rating: 4.9,
      availableDates: ["2023-04-19", "2023-04-22", "2023-04-23"],
    },
    {
      id: "3",
      name: "Dr. Emily Rodriguez",
      specialty: "Chiropractor",
      location: "Spine & Posture Center",
      rating: 4.7,
      availableDates: ["2023-04-18", "2023-04-19", "2023-04-24"],
    },
    {
      id: "4",
      name: "Dr. James Wilson",
      specialty: "Pain Management",
      location: "Advanced Pain Relief Clinic",
      rating: 4.6,
      availableDates: ["2023-04-20", "2023-04-21", "2023-04-26"],
    },
    {
      id: "5",
      name: "Dr. Lisa Patel",
      specialty: "Neurologist",
      location: "Neuroscience Medical Group",
      rating: 4.9,
      availableDates: ["2023-04-19", "2023-04-22", "2023-04-25"],
    },
    {
      id: "6",
      name: "Dr. Robert Kim",
      specialty: "Physical Therapist",
      location: "Active Recovery Center",
      rating: 4.5,
      availableDates: ["2023-04-18", "2023-04-23", "2023-04-24"],
    },
  ]

  // Filter doctors based on search query and specialty
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSpecialty =
      specialtyFilter === "" || specialtyFilter === "all" || doctor.specialty === specialtyFilter

    return matchesSearch && matchesSpecialty
  })

  const handleBookAppointment = async (doctorId: string) => {
    const doctor = doctors.find((d) => d.id === doctorId)

    if (!doctor) return

    if (!date) {
      toast({
        title: "Date required",
        description: "Please select a date for your appointment",
        variant: "destructive",
      })
      return
    }

    const formattedDate = format(date, "yyyy-MM-dd")
    const isAvailable = doctor.availableDates.includes(formattedDate)

    if (!isAvailable) {
      toast({
        title: "Date unavailable",
        description: `Dr. ${doctor.name} is not available on ${format(date, "MMMM d, yyyy")}`,
        variant: "destructive",
      })
      return
    }

    try {
      const created = await apiFetch<Appointment>("/api/appointments", {
        method: "POST",
        body: JSON.stringify({
          doctorId: doctor.id,
          doctorName: doctor.name,
          specialty: doctor.specialty,
          date: formattedDate,
        }),
      })

      setAppointments((prev) => [...prev, created])

      toast({
        title: "Appointment booked",
        description: `Your appointment with Dr. ${doctor.name} on ${format(date, "MMMM d, yyyy")} has been scheduled`,
      })
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        router.push("/login")
        return
      }
      toast({
        title: "Booking failed",
        description: "We couldn't book your appointment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const renderRatingStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${index < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="mb-6 text-3xl font-bold text-rich-navy">Doctor Schedule</h1>

      <Card className="mb-6 border-soft-blue/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-rich-navy">Your Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No appointments booked yet.</p>
          ) : (
            <ul className="divide-y">
              {appointments.map((appointment) => (
                <li
                  key={appointment.id}
                  className="flex items-center justify-between gap-4 py-2 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-medium text-rich-navy">{appointment.doctorName}</p>
                    <p className="text-xs text-muted-foreground">{appointment.specialty}</p>
                  </div>
                  <span className="shrink-0 text-sm font-medium text-soft-blue">
                    {format(new Date(appointment.date), "MMMM d, yyyy")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search doctors by name, specialty, or location"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by specialty" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialties</SelectItem>
              <SelectItem value="Orthopedic Surgeon">Orthopedic Surgeon</SelectItem>
              <SelectItem value="Physical Therapist">Physical Therapist</SelectItem>
              <SelectItem value="Chiropractor">Chiropractor</SelectItem>
              <SelectItem value="Pain Management">Pain Management</SelectItem>
              <SelectItem value="Neurologist">Neurologist</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={doctor.image || "/placeholder.svg"} alt={doctor.name} />
                    <AvatarFallback>
                      {doctor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{doctor.name}</CardTitle>
                    <CardDescription>{doctor.specialty}</CardDescription>
                    <div className="mt-1 flex">
                      {renderRatingStars(doctor.rating)}
                      <span className="ml-1 text-xs text-muted-foreground">({doctor.rating})</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline">{doctor.specialty.split(" ")[0]}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{doctor.location}</span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="space-y-1">
                  <Label>Select Appointment Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <Button
                  onClick={() => handleBookAppointment(doctor.id)}
                  className="w-full bg-soft-blue hover:bg-soft-blue/90"
                >
                  Book Appointment
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="mt-8 flex h-40 flex-col items-center justify-center rounded-lg border border-dashed">
          <p className="text-center text-muted-foreground">No doctors found matching your criteria</p>
          <Button
            variant="link"
            onClick={() => {
              setSearchQuery("")
              setSpecialtyFilter("")
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  )
}
