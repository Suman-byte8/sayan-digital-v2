"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Fraunces } from "next/font/google";
import styles from "@/app/coming-soon/coming-soon.module.css";
import { cn } from "@/lib/utils";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "500"],
});

const ACCESS_COOKIE = "sd_preview_access";
const ACCESS_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function formatTime(date) {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

// SSR-safe live clock: the server has no meaningful "current time" to
// hydrate-match, so getServerSnapshot returns "" and the real value syncs
// in right after mount via useSyncExternalStore — no setState-in-effect.
function subscribeClock(callback) {
  const id = setInterval(callback, 1000 * 15);
  return () => clearInterval(id);
}
function getClockSnapshot() {
  return formatTime(new Date());
}
function getServerClockSnapshot() {
  return "";
}

export function ComingSoonView() {
  const router = useRouter();
  const time = useSyncExternalStore(subscribeClock, getClockSnapshot, getServerClockSnapshot);
  const [email, setEmail] = useState("");
  const [buttonLabel, setButtonLabel] = useState("Notify me");
  const [showStatus, setShowStatus] = useState(false);
  const resetTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  function handleNotifySubmit(event) {
    event.preventDefault();
    if (!email.trim()) return;

    // -- integration point --
    // fetch('/api/notify', { method: 'POST', body: JSON.stringify({ email }) });

    setButtonLabel("Saved");
    setShowStatus(true);
    setEmail("");

    resetTimer.current = setTimeout(() => {
      setButtonLabel("Notify me");
      setShowStatus(false);
    }, 3200);
  }

  function handleVisitAnyway() {
    document.cookie = `${ACCESS_COOKIE}=true; path=/; max-age=${ACCESS_MAX_AGE}`;
    router.push("/");
  }

  return (
    <div className={cn(styles.page, fraunces.variable)}>
      <div className={styles.ring} aria-hidden="true" />

      <div className={styles.frame}>
        <div className={styles.bar}>
          <div className={styles.mark}>Sayan Digital</div>
          <div className={styles.clock}>
            <span className={styles.dot} aria-hidden="true" />
            <span className={styles.label}>In progress &mdash; {time}</span>
          </div>
        </div>

        <main className={styles.stage}>
          <span className={styles.devTag}>
            <span className={styles.dot} aria-hidden="true" />
            Site under development
          </span>

          <p className={styles.eyebrow}>Under Process</p>

          <h1>
            Good work
            <br />
            takes <em>time</em> to arrive.
          </h1>

          <div className={styles.threadWrap}>
            <svg className={styles.thread} viewBox="0 0 400 20" preserveAspectRatio="none">
              <path d="M0,10 Q 100,0 200,10 T 400,10" />
            </svg>
          </div>

          <p className={styles.lede}>
            This site is being built with the same care it deserves &mdash; every detail
            considered before it goes live. Leave your email and we&apos;ll let you know the
            moment it&apos;s ready.
          </p>

          <form className={styles.notify} onSubmit={handleNotifySubmit}>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Your email address"
              required
              aria-label="Email address"
            />
            <button type="submit">{buttonLabel}</button>
          </form>

          <div className={cn(styles.statusMsg, showStatus && styles.show)}>
            Thank you &mdash; we&apos;ll be in touch.
          </div>

          <button type="button" className={styles.visitAnyway} onClick={handleVisitAnyway}>
            Want a look anyway? Visit the site in progress &rarr;
          </button>
        </main>

        <footer>
          <div className={styles.col}>
            Currently
            <span>Refining detail, not adding it.</span>
          </div>
          <div className={styles.col} style={{ textAlign: "right" }}>
            Reach us
            <span>
              <a href="mailto:sayandigital.malda@gmail.com">sayandigital.malda@gmail.com</a>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
