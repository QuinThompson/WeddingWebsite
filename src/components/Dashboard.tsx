"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { CountdownTicket } from "@/components/CountdownTicket";
import { DashboardNavLink } from "@/components/DashboardNavLink";
import { FlightBoardingPass } from "@/components/FlightBoardingPass";
import { InvitationDocument } from "@/components/InvitationDocument";
import { MemoriesPolaroid } from "@/components/MemoriesPolaroid";
import { PolaroidCard } from "@/components/PolaroidCard";
import { RegistryCard } from "@/components/RegistryCard";
import { FaqCard } from "@/components/FaqCard";
import { wedding } from "@/data/wedding";
import { assemble, dashboardContainer, elegantEase } from "@/lib/motion";

// Hidden with passport for now — restore with MiniPassport block below:
// import { DashboardCard } from "@/components/DashboardCard";
// import { MiniPassport } from "@/components/MiniPassport";

type DashboardProps = {
  shortened?: boolean;
  fromOpening?: boolean;
};

export function Dashboard({ shortened = false, fromOpening = false }: DashboardProps) {
  const reduced = useReducedMotion();
  const [unlocked, setUnlocked] = useState(false);
  const interactive = Boolean(reduced || shortened || unlocked);
  const opts = { shortened, reduced: Boolean(reduced) };

  useEffect(() => {
    if (reduced || shortened) return;
    const id = window.setTimeout(() => setUnlocked(true), fromOpening ? 2800 : 2500);
    return () => window.clearTimeout(id);
  }, [reduced, shortened, fromOpening]);

  return (
    <section className="paper-texture relative min-h-dvh overflow-x-hidden safe-pad">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 18%, #78658F 0 1px, transparent 1.5px), radial-gradient(circle at 88% 72%, #66745E 0 1px, transparent 1.5px)",
          backgroundSize: "52px 52px",
        }}
      />

      {fromOpening && !reduced ? (
        <motion.div
          className="pointer-events-none fixed inset-0 z-30 bg-ivory"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.75, ease: elegantEase, delay: 0.04 }}
          aria-hidden
        />
      ) : null}

      <div className="relative mx-auto invite-shell pb-8 pt-3">
        <motion.div
          className="relative"
          variants={dashboardContainer}
          initial={reduced ? false : "hidden"}
          animate="visible"
          style={{ pointerEvents: interactive ? "auto" : "none" }}
        >
          {/*
            Mini passport + Entourage tab — hidden for now (looked odd alone on mobile).
            <div className="mt-3 flex flex-col gap-3 min-[480px]:flex-row min-[480px]:items-stretch min-[480px]:gap-3">
              <motion.div
                className="mx-auto flex w-[9.5rem] flex-col min-[480px]:mx-0 min-[480px]:w-[7rem] min-[480px]:shrink-0 sm:w-[7.5rem]"
                variants={assemble({ x: -36, y: 10 }, { ...opts, index: 2 })}
              >
                <motion.div
                  className="relative z-0 mx-auto w-max shrink-0 -mb-1"
                  variants={assemble({ y: -12, scale: 0.98 }, { ...opts, index: 3 })}
                >
                  <DashboardCard
                    href="/invite/party"
                    title={wedding.dashboard.partyTabTitle}
                    subtitle={wedding.dashboard.partyTabSubtitle}
                  />
                </motion.div>
                <div className="relative z-10 w-full min-[480px]:min-h-0 min-[480px]:flex-1">
                  <MiniPassport className="aspect-[3/4.15] min-[480px]:h-full min-[480px]:!aspect-auto" />
                </div>
              </motion.div>

              <motion.div
                className="min-w-0 w-full min-[480px]:flex-1"
                variants={assemble({ y: -28, scale: 0.97 }, { ...opts, index: 1 })}
              >
                <InvitationDocument className="min-[480px]:h-full" />
              </motion.div>
            </div>
          */}
          <motion.div
            className="mt-3 min-w-0 w-full"
            variants={assemble({ y: -28, scale: 0.97 }, { ...opts, index: 1 })}
          >
            <InvitationDocument />
          </motion.div>

          <div className="mt-4 flex flex-wrap items-end justify-center gap-2">
            <motion.div variants={assemble({ y: 64, rotate: -12 }, { ...opts, index: 4 })}>
              <PolaroidCard
                href="/invite/story"
                src="/images/love_story.jpeg"
                alt="Shenice and Quinton together at sunset on the beach"
                caption={wedding.dashboard.storyCaption}
                rotate={-3.5}
              />
            </motion.div>
            {/* Prenup photos — hidden for now
            <motion.div variants={assemble({ y: 64, rotate: 12 }, { ...opts, index: 5 })}>
              <PolaroidCard
                href="/invite/gallery"
                src={wedding.gallery[0].src}
                alt={wedding.gallery[0].alt}
                caption={wedding.dashboard.photosCaption}
                rotate={3}
              />
            </motion.div>
            */}
            <motion.div variants={assemble({ y: 64, rotate: -8 }, { ...opts, index: 6 })}>
              <MemoriesPolaroid rotate={-2} />
            </motion.div>
            <motion.div variants={assemble({ y: 64, rotate: 10 }, { ...opts, index: 7 })}>
              <RegistryCard rotate={3} />
            </motion.div>
          </div>

          <motion.div
            className="mt-4"
            variants={assemble({ scale: 0.88, y: 28 }, { ...opts, index: 8 })}
          >
            <CountdownTicket />
          </motion.div>

          <motion.div
            className="mt-3.5"
            variants={assemble({ y: 58, scale: 0.95 }, { ...opts, index: 9 })}
          >
            <FlightBoardingPass />
          </motion.div>

          <motion.div
            className="mt-3.5"
            variants={assemble({ y: 24, scale: 0.97 }, { ...opts, index: 10 })}
          >
            <FaqCard />
          </motion.div>

          <motion.nav
            className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[0.9rem]"
            aria-label="More invitation pages"
            variants={assemble({ y: 18 }, { ...opts, index: 11 })}
          >
            <DashboardNavLink
              href="/invite/attire"
              className="inline-flex min-h-10 items-center text-lilac-deep underline-offset-2 hover:underline"
            >
              Attire
            </DashboardNavLink>
            <DashboardNavLink
              href="/invite/timeline"
              className="inline-flex min-h-10 items-center text-lilac-deep underline-offset-2 hover:underline"
            >
              Timeline
            </DashboardNavLink>
            {/* <DashboardNavLink
              href="/invite/destination"
              className="inline-flex min-h-10 items-center text-lilac-deep underline-offset-2 hover:underline"
            >
              Destination
            </DashboardNavLink> */}
            <DashboardNavLink
              href="/invite/party"
              className="inline-flex min-h-10 items-center text-lilac-deep underline-offset-2 hover:underline"
            >
              Entourage
            </DashboardNavLink>
            <DashboardNavLink
              href="/invite/registry"
              className="inline-flex min-h-10 items-center text-lilac-deep underline-offset-2 hover:underline"
            >
              Registry
            </DashboardNavLink>
            <DashboardNavLink
              href="/invite/rsvp"
              className="inline-flex min-h-10 items-center text-lilac-deep underline-offset-2 hover:underline"
            >
              RSVP
            </DashboardNavLink>
          </motion.nav>
        </motion.div>
      </div>
    </section>
  );
}
