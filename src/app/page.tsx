"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import {
  ArrowRight,
  CalendarDays,
  Camera,
  Check,
  Clock3,
  Gift,
  Heart,
  MapPin,
  Moon,
  Music4,
  Sparkles,
  Sun,
  Users,
} from "lucide-react";

import WhatsAppDrawer from "@/components/whatsappDrawer";
import WeddingCalendar from "@/components/weddingCalendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=80",
    alt: "Couple walking together",
  },
  {
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
    alt: "Couple embracing",
  },
  {
    src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80",
    alt: "Couple smiling outdoors",
  },
  {
    src: "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=900&q=80",
    alt: "Couple holding hands",
  },
  {
    src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=80",
    alt: "Celebration moment",
  },
  {
    src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80",
    alt: "Wedding day portrait",
  },
];

const timeline = [
  { time: "03:30 PM", title: "Guest Arrival", detail: "Welcome drinks and soft live music." },
  { time: "04:15 PM", title: "Ceremony", detail: "The vows begin beneath the floral arch." },
  { time: "05:30 PM", title: "Reception", detail: "Dinner, laughter, and a toast to forever." },
  { time: "07:00 PM", title: "Dance Night", detail: "Cake cutting, dancing, and unforgettable memories." },
];

const highlights = [
  { icon: MapPin, label: "Venue", value: "The Willow Garden" },
  { icon: CalendarDays, label: "Date", value: "05 Dec 2025" },
  { icon: Music4, label: "Dress Code", value: "Formal Elegance" },
];

export default function Home() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <header className="sticky top-0 z-40 mb-6 rounded-full border border-border/80 bg-background/80 px-3 py-2 shadow-sm backdrop-blur-md sm:px-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">Save the date</p>
              <h1 className="text-lg font-semibold tracking-[0.18em] text-foreground sm:text-xl">
                Gloria & Peter
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                aria-label="Toggle theme"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button className="hidden rounded-full sm:inline-flex">RSVP</Button>
            </div>
          </div>
        </header>

        <main className="space-y-8 pb-16">
          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <Badge className="rounded-full border-rose-200 bg-rose-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
                <Sparkles className="h-3.5 w-3.5" />
                Wedding celebration
              </Badge>

              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.45em] text-muted-foreground">Dear family & friends</p>
                <h2 className="max-w-xl text-4xl font-medium tracking-[-0.06em] text-foreground sm:text-5xl lg:text-6xl">
                  We&apos;re saying yes
                  <span className="mt-2 block text-primary">to forever.</span>
                </h2>
              </div>

              <p className="max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
                Join us as we celebrate our love, laughter, and a new chapter together on this beautiful day filled with heartfelt moments and warm memories.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <WhatsAppDrawer />
                <Button variant="outline" className="rounded-full px-6">
                  View details
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {highlights.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm">
                    <Icon className="mb-2 h-5 w-5 text-primary" />
                    <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
                    <p className="mt-2 text-sm font-medium text-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-[2rem] border border-border bg-card p-3 shadow-[0_30px_80px_rgba(120,77,63,0.18)]">
                <Image
                  src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1000&q=80"
                  alt="Couple embracing outdoors"
                  width={900}
                  height={1100}
                  className="h-[420px] w-full rounded-[1.5rem] object-cover sm:h-[500px]"
                  priority
                />
              </div>

              <div className="absolute -bottom-4 left-4 rounded-2xl border border-border bg-background/90 p-3 shadow-lg backdrop-blur-md">
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Our day</p>
                <p className="mt-1 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  05 Dec 2025
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <Card className="border-0 bg-[linear-gradient(135deg,#fffaf7,#fdf2ee)] shadow-sm dark:bg-[linear-gradient(135deg,#2c1d1b,#2f2623)]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Heart className="h-5 w-5 text-primary" />
                  Our story
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">
                  From a chance meeting to a forever promise, every step has led us here.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-[linear-gradient(135deg,#f9f5ef,#f0ece6)] shadow-sm dark:bg-[linear-gradient(135deg,#2a2622,#231f1d)]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Camera className="h-5 w-5 text-primary" />
                  Memories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">
                  A collection of moments that made our journey feel like home.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-[linear-gradient(135deg,#f8f3ff,#f0ebff)] shadow-sm dark:bg-[linear-gradient(135deg,#241d2d,#221f2d)]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Gift className="h-5 w-5 text-primary" />
                  Celebrations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">
                  An evening of music, stories, and heartfelt celebrations with those we love.
                </p>
              </CardContent>
            </Card>
          </section>

          <section id="story" className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">Our journey</p>
              <h3 className="text-3xl font-medium tracking-[-0.05em] sm:text-4xl">A love story worth celebrating</h3>
              <p className="text-base leading-7 text-muted-foreground">
                What started as a simple hello turned into a beautiful friendship, a deep connection, and a love we never want to live without. We are delighted to share our happiest day with the people who have shaped our story.
              </p>
              <ul className="space-y-3 text-sm text-foreground">
                {[
                  "Intimate ceremony with our closest family and friends",
                  "Dinner and heartfelt speeches from the people we love most",
                  "A lively evening of dancing, laughter, and celebration",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="overflow-hidden border-0 bg-card shadow-sm">
                <div className="relative h-56">
                  <Image
                    src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80"
                    alt="Couple portrait"
                    fill
                    className="object-cover"
                  />
                </div>
              </Card>

              <Card className="overflow-hidden border-0 bg-card shadow-sm">
                <div className="relative h-56">
                  <Image
                    src="https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=900&q=80"
                    alt="Couple laughing together"
                    fill
                    className="object-cover"
                  />
                </div>
              </Card>
            </div>
          </section>

          <section id="gallery" className="space-y-4">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">Our gallery</p>
                <h3 className="mt-2 text-3xl font-medium tracking-[-0.05em] sm:text-4xl">Moments we treasure</h3>
              </div>
              <Button variant="outline" className="hidden rounded-full sm:inline-flex">
                See more
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {galleryImages.map((image, index) => (
                <Card key={`${image.alt}-${index}`} className="overflow-hidden border-0 p-0 shadow-sm">
                  <div className="relative h-72 w-full">
                    <Image src={image.src} alt={image.alt} fill className="object-cover" />
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <section id="details" className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Clock3 className="h-5 w-5 text-primary" />
                  Wedding timeline
                </CardTitle>
                <CardDescription>Everything you need to know for the day of celebration.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {timeline.map((entry, index) => (
                  <div key={entry.time} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary" />
                      {index !== timeline.length - 1 && <div className="mt-1 h-full w-px bg-border" />}
                    </div>

                    <div className="flex-1 pb-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{entry.time}</p>
                      <h4 className="mt-1 text-lg font-medium text-foreground">{entry.title}</h4>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{entry.detail}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Users className="h-5 w-5 text-primary" />
                  RSVP form
                </CardTitle>
                <CardDescription>We would love to celebrate with you.</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Name</label>
                    <Input placeholder="Your full name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Guests</label>
                    <Input placeholder="2 guests" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <Input type="email" placeholder="you@example.com" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Message</label>
                  <Textarea placeholder="Share a note for the couple..." className="min-h-28" />
                </div>

                <Button className="w-full rounded-full">Send RSVP</Button>
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
            <Card className="border-0 bg-[linear-gradient(135deg,#f8ece9,#fff7f4)] shadow-sm dark:bg-[linear-gradient(135deg,#2c2423,#2a1e1d)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <MapPin className="h-5 w-5 text-primary" />
                  Venue details
                </CardTitle>
                <CardDescription>We&apos;ll be gathering at the heart of the city.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 text-sm leading-6 text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground">The Willow Garden</p>
                  <p>24 Rose Avenue, Sandton, Johannesburg</p>
                </div>
                <Separator />
                <div>
                  <p className="font-medium text-foreground">Dress code</p>
                  <p>Formal elegance in soft romantic tones.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Gifts</p>
                  <p>Your presence is the greatest gift of all.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 shadow-sm">
              <div className="relative h-full min-h-72">
                <Image
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"
                  alt="Wedding venue as a community celebration"
                  fill
                  className="object-cover"
                />
              </div>
            </Card>
          </section>
        </main>

        <footer className="pb-8 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">With love</p>
          <h3 className="mt-3 text-3xl font-medium tracking-[-0.05em] text-foreground">Gloria & Peter</h3>
        </footer>
      </div>
    </div>
  );
}
