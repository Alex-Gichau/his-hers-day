"use client";

import Image from "next/image";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";

import WhatsAppDrawer from "@/components/whatsappDrawer";
import WeddingCalendar from "@/components/weddingCalendar";
import { Countdown } from "@/components/countdown";
import { GalleryMarquee } from "@/components/galleryMarquee";
import { SiteNav } from "@/components/siteNav";
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
    nav,
    footer,
  } = siteData;

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <SiteNav nav={nav} />

      <section id="top" className="relative w-full">
        <div className="relative w-full overflow-hidden">
          <Image
            src={hero.image.src}
            alt={hero.image.alt}
            width={2400}
            height={1350}
            className="h-[68vh] max-h-[760px] min-h-[440px] w-full object-cover lg:h-[82vh]"
            priority
            sizes="100vw"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-background/5" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background/70 to-transparent" />
        </div>

        <div className="absolute inset-x-0 bottom-0">
          <div className="container-page pb-10 sm:pb-14">
            <div className="max-w-2xl space-y-5">
              <Badge className="max-w-full whitespace-normal rounded-full border-rose-800 bg-rose-950/40 px-3 py-1 text-left text-[11px] font-medium uppercase tracking-[0.24em] text-rose-300 [&>svg]:size-3.5">
                <Sparkles className="h-3.5 w-3.5 shrink-0" />
                {hero.badge}
              </Badge>

              <div className="space-y-3">
                <p className="text-sm uppercase tracking-[0.45em] text-muted-foreground">{hero.greeting}</p>
                <h2 className="font-wedding text-5xl leading-[1.05] text-foreground sm:text-6xl lg:text-7xl">
                  {hero.title}
                  <span className="mt-1 block text-primary">{hero.titleAccent}</span>
                </h2>
                <p className="font-wedding-alt text-3xl text-muted-foreground sm:text-4xl">
                  {couple.nameOne} <span className="text-primary">&amp;</span> {couple.nameTwo}
                </p>
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
            </div>
          </div>
        </div>
      </section>

      <main className="space-y-8 pb-28 pt-16 sm:pb-16 sm:pt-24">
        <div className="container-page space-y-8">
          <section
            id="our-day"
            className="grid scroll-mt-20 gap-4 sm:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]"
          >
            <div className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Our day</p>
              <p className="font-wedding-alt mt-1 flex items-center gap-2 text-2xl text-foreground">
                <CalendarDays className="h-5 w-5 text-primary" />
                {wedding.dateLabel}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{wedding.venue}</p>
              <p className="text-sm text-muted-foreground">{wedding.address}</p>
            </div>

            <Countdown date={wedding.date} content={countdown} />
          </section>

          <section className="grid gap-3 sm:grid-cols-3">
            {highlights.map(({ icon, label, value }) => {
              const Icon = iconMap[icon];
              return (
                <div key={label} className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
                  <Icon className="mb-2 h-5 w-5 text-primary" />
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
                  <p className="mt-2 font-wedding-alt text-xl text-foreground">{value}</p>
                </div>
              );
            })}
          </section>
        </div>

        <section id="gallery" className="scroll-mt-20 space-y-4">
          <div className="container-page">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">{gallery.eyebrow}</p>
                <h3 className="font-wedding mt-2 text-4xl text-foreground sm:text-5xl">{gallery.title}</h3>
              </div>
              <Button variant="outline" className="hidden rounded-full sm:inline-flex">
                {gallery.cta}
              </Button>
            </div>
          </div>

          <GalleryMarquee images={gallery.images} />
        </section>

        <div className="container-page space-y-8">
          <section className="grid gap-4 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = iconMap[feature.icon];
              const gradients = [
                "bg-[linear-gradient(135deg,#2c1d1b,#2f2623)]",
                "bg-[linear-gradient(135deg,#2a2622,#231f1d)]",
                "bg-[linear-gradient(135deg,#241d2d,#221f2d)]",
              ];

              return (
                <Card key={feature.title} className={cn("border-0 shadow-sm", gradients[index % gradients.length])}>
                  <CardHeader className="pb-3">
                    <CardTitle className="font-wedding-alt flex items-center gap-2 text-3xl text-foreground">
                      <Icon className="h-5 w-5 shrink-0 text-primary" />
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

          <section id="story" className="grid scroll-mt-20 gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">{story.eyebrow}</p>
              <h3 className="font-wedding text-4xl text-foreground sm:text-5xl">{story.title}</h3>
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

          <section id="details" className="scroll-mt-20">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="font-wedding flex items-center gap-2 text-4xl text-foreground">
                  <Clock3 className="h-6 w-6 shrink-0 text-primary" />
                  {timeline.title}
                </CardTitle>
                <CardDescription>{timeline.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-x-8 gap-y-0 md:grid-cols-2">
                  {timeline.items.map((entry, index) => (
                    <div key={entry.time} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary" />
                        {index !== timeline.items.length - 1 && <div className="mt-1 h-full w-px bg-border" />}
                      </div>

                      <div className="flex-1 pb-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{entry.time}</p>
                        <h4 className="font-wedding-alt mt-1 text-2xl text-foreground">{entry.title}</h4>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">{entry.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="rsvp" className="scroll-mt-20">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="font-wedding flex items-center gap-2 text-4xl text-foreground">
                  <Users className="h-6 w-6 shrink-0 text-primary" />
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

          <section id="venue" className="grid scroll-mt-20 gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
            <Card className="min-w-0 overflow-hidden border-0 bg-[linear-gradient(135deg,#2c2423,#2a1e1d)] shadow-sm">
              <CardHeader>
                <CardTitle className="font-wedding flex items-center gap-2 text-4xl text-foreground">
                  <MapPin className="h-6 w-6 shrink-0 text-primary" />
                  {venue.title}
                </CardTitle>
                <CardDescription>{venue.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 px-4 text-sm leading-6 text-muted-foreground sm:px-6">
                <div>
                  <p className="font-wedding-alt text-2xl text-foreground">{wedding.venue}</p>
                  <p>{wedding.address}</p>
                </div>
                <Separator />
                <div>
                  <p className="font-wedding-alt text-2xl text-foreground">{wedding.giftsLabel}</p>
                  <p>{wedding.gifts}</p>
                </div>

                <div className="rounded-2xl border border-border bg-background/60 p-2 sm:p-3">
                  <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    Wedding date
                  </p>
                  <WeddingCalendar />
                </div>
              </CardContent>
            </Card>

            <Card className="min-w-0 overflow-hidden border-0 shadow-sm">
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
        </div>
      </main>

      <footer className="container-page pb-24 text-center sm:pb-8">
        <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">{footer.eyebrow}</p>
        <h3 className="font-wedding mt-3 text-5xl text-foreground">{footer.name}</h3>
      </footer>
    </div>
  );
}
