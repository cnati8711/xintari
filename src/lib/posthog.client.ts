"use client";

declare global { interface Window { _phInit?: boolean } }

let ph: any = null;

export async function initPostHog() {
  if (typeof window === "undefined") return;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

  if (window._phInit) return;
  window._phInit = true;

  const { default: posthog } = await import("posthog-js");
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com"
  });
  ph = posthog;
}

export function posthogCapture(event: string, props?: Record<string, any>) {
  if (!ph) return;
  ph.capture(event, props);
}
