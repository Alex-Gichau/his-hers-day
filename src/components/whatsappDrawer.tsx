import { Button } from "./ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { siteData } from "@/data";

const WhatsAppDrawer = () => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button size="lg" className="rounded-full">
          {siteData.hero.primaryCta}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="mx-auto max-w-md rounded-t-2xl px-4 pb-6 sm:px-6">
        <DrawerHeader className="items-center text-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-rose-400 text-lg font-semibold text-white shadow-sm">
            ❤
          </div>
          <DrawerTitle className="font-wedding text-4xl text-foreground">
            We are happy to have you
          </DrawerTitle>
          <DrawerDescription className="max-w-xs text-sm text-muted-foreground">
            Join our WhatsApp family and stay connected with all the details.
          </DrawerDescription>
        </DrawerHeader>

        <DrawerFooter className="w-full">
          <a
            href="https://wa.me/2348000000000"
            target="_blank"
            rel="noreferrer"
            className="w-full"
          >
            <Button className="w-full rounded-full">WhatsApp Family</Button>
          </a>

          <DrawerClose asChild>
            <Button variant="outline" className="w-full rounded-full">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default WhatsAppDrawer;