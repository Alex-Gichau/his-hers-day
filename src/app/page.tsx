"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  MapPin,
  Moon,
  Sparkles,
  Sun,
  Users,
} from "lucide-react";

import WhatsAppDrawer from "@/components/whatsappDrawer";
import WeddingCalendar from "@/components/weddingCalendar";
import { Countdown } from "@/components/countdown";
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
import { cn } from "@/lib/utils";
import { iconMap } from "@/types/data";
import { siteData } from "@/data";

export default function Home() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === "dark";
  const {
    couple,
    wedding,
    hero,
    countdown,
    highlights,
    features,
    story,
    gallery,
    timeline,
    rsvp,
    venue,
    footer,
  } = siteData;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <header className="sticky top-0 z-40 mb-6 rounded-full border border-border/80 bg-background/80 px-3 py-2 shadow-sm backdrop-blur-md sm:px-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 bg-primary/5 text-[10px] font-semibold tracking-[0.2em] text-primary">
                {couple.initials}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">{couple.eyebrow}</p>
                <h1 className="text-lg font-semibold tracking-[0.18em] text-foreground sm:text-xl">
                  {couple.displayName}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                aria-label="Toggle theme"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full"
              >
                {mounted && isDark ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
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
                {hero.badge}
              </Badge>

              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.45em] text-muted-foreground">{hero.greeting}</p>
                <h2 className="max-w-xl text-4xl font-medium tracking-[-0.06em] text-foreground sm:text-5xl lg:text-6xl">
                  {hero.title}
                  <span className="mt-2 block text-primary">{hero.titleAccent}</span>
                </h2>
              </div>

              <p className="max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
                {hero.description}
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <WhatsAppDrawer />
                <Button variant="outline" className="rounded-full px-6">
                  {hero.secondaryCta}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {highlights.map(({ icon, label, value }) => {
                  const Icon = iconMap[icon];
                  return (
                    <div key={label} className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
                      <Icon className="mb-2 h-5 w-5 text-primary" />
                      <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
                      <p className="mt-2 text-sm font-medium text-foreground">{value}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-[2rem] border border-border bg-card p-3 shadow-[0_30px_80px_rgba(120,77,63,0.18)]">
                <div className="relative overflow-hidden rounded-[1.5rem]">
                  <Image
                    src={hero.image.src}
                    alt={hero.image.alt}
                    width={900}
                    height={1100}
                    className="h-[420px] w-full rounded-[1.5rem] object-cover sm:h-[500px]"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:col-span-2">
              <div className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm">
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Our day</p>
                <p className="mt-1 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  {wedding.dateLabel}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{wedding.venue}</p>
                <p className="text-sm text-muted-foreground">{wedding.address}</p>
              </div>

              <Countdown date={wedding.date} content={countdown} />
            </div>
          </section>

          <section id="gallery" className="space-y-4">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">{gallery.eyebrow}</p>
                <h3 className="mt-2 text-3xl font-medium tracking-[-0.05em] sm:text-4xl">{gallery.title}</h3>
              </div>
              <Button variant="outline" className="hidden rounded-full sm:inline-flex">
                {gallery.cta}
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.images.map((image, index) => (
                <Card key={`${image.alt}-${index}`} className="overflow-hidden border-0 p-0 shadow-sm">
                  <div className="relative h-72 w-full">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = iconMap[feature.icon];
              const gradients = [
                "bg-[linear-gradient(135deg,#fffaf7,#fdf2ee)] dark:bg-[linear-gradient(135deg,#2c1d1b,#2f2623)]",
                "bg-[linear-gradient(135deg,#f9f5ef,#f0ece6)] dark:bg-[linear-gradient(135deg,#2a2622,#231f1d)]",
                "bg-[linear-gradient(135deg,#f8f3ff,#f0ebff)] dark:bg-[linear-gradient(135deg,#241d2d,#221f2d)]",
              ];

              return (
                <Card key={feature.title} className={cn("border-0 shadow-sm", gradients[index % gradients.length])}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Icon className="h-5 w-5 text-primary" />
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </section>

          <section id="story" className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">{story.eyebrow}</p>
              <h3 className="text-3xl font-medium tracking-[-0.05em] sm:text-4xl">{story.title}</h3>
              <p className="text-base leading-7 text-muted-foreground">{story.description}</p>
              <ul className="space-y-3 text-sm text-foreground">
                {story.points.map((item) => (
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
              {story.images.map((image) => (
                <Card key={image.src} className="overflow-hidden border-0 bg-card shadow-sm">
                  <div className="relative h-56">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
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
                  {timeline.title}
                </CardTitle>
                <CardDescription>{timeline.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {timeline.items.map((entry, index) => (
                  <div key={entry.time} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary" />
                      {index !== timeline.items.length - 1 && <div className="mt-1 h-full w-px bg-border" />}
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
                  {rsvp.title}
                </CardTitle>
                <CardDescription>{rsvp.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {(() => {
                  const halfFields = rsvp.fields.filter((field) => field.half);
                  const fullFields = rsvp.fields.filter((field) => !field.half);

                  return (
                    <>
                      {halfFields.length > 0 && (
                        <div className="grid gap-4 sm:grid-cols-2">
                          {halfFields.map((field) => (
                            <div key={field.id} className="space-y-2">
                              <label htmlFor={field.id} className="text-sm font-medium text-foreground">
                                {field.label}
                              </label>
                              <Input id={field.id} type={field.type} placeholder={field.placeholder} />
                            </div>
                          ))}
                        </div>
                      )}

                      {fullFields.map((field) => (
                        <div key={field.id} className="space-y-2">
                          <label htmlFor={field.id} className="text-sm font-medium text-foreground">
                            {field.label}
                          </label>
                          {field.type === "textarea" ? (
                            <Textarea id={field.id} placeholder={field.placeholder} className="min-h-28" />
                          ) : (
                            <Input id={field.id} type={field.type} placeholder={field.placeholder} />
                          )}
                        </div>
                      ))}
                    </>
                  );
                })()}

                <Button className="w-full rounded-full">{rsvp.submit}</Button>
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
            <Card className="border-0 bg-[linear-gradient(135deg,#f8ece9,#fff7f4)] shadow-sm dark:bg-[linear-gradient(135deg,#2c2423,#2a1e1d)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <MapPin className="h-5 w-5 text-primary" />
                  {venue.title}
                </CardTitle>
                <CardDescription>{venue.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 text-sm leading-6 text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground">{wedding.venue}</p>
                  <p>{wedding.address}</p>
                </div>
                <Separator />
                <div>
                  <p className="font-medium text-foreground">{wedding.dressCodeLabel}</p>
                  <p>{wedding.dressCode}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">{wedding.giftsLabel}</p>
                  <p>{wedding.gifts}</p>
                </div>

                <div className="rounded-2xl border border-border bg-background/60 p-3">
                  <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    Wedding date
                  </p>
                  <WeddingCalendar />
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 shadow-sm">
              <div className="relative h-full min-h-72">
                <Image
                  src={venue.image.src}
                  alt={venue.image.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>
            </Card>
          </section>
        </main>

        <footer className="pb-8 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">{footer.eyebrow}</p>
          <h3 className="mt-3 text-3xl font-medium tracking-[-0.05em] text-foreground">{footer.name}</h3>
        </footer>
      </div>
    </div>
  );
}
