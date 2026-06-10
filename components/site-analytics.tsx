"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

type AnalyticsEventType = "visit" | "click" | "whatsapp_click";

type AnalyticsPayload = {
  eventType: AnalyticsEventType;
  path: string;
  label?: string;
  target?: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export function SiteAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (shouldIgnoreCurrentPage()) {
      return;
    }

    const path = currentPath();
    const visitKey = `jos-travel-visit:${path}`;

    if (safeSessionStorageGet(visitKey) !== "1") {
      safeSessionStorageSet(visitKey, "1");
      sendAnalytics({ eventType: "visit", path });
    }
  }, [pathname]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (shouldIgnoreCurrentPage() || !(event.target instanceof Element)) {
        return;
      }

      const interactiveElement = event.target.closest<HTMLElement>("a,button,[role='button'],input,select,textarea");
      if (!interactiveElement) {
        return;
      }

      const anchor = interactiveElement.closest<HTMLAnchorElement>("a[href]");
      const target = anchor?.href ?? interactiveElement.getAttribute("data-analytics-target") ?? undefined;
      const label = getElementLabel(interactiveElement);
      const tag = interactiveElement.tagName.toLowerCase();
      const path = currentPath();

      sendAnalytics({
        eventType: "click",
        path,
        label,
        target,
        metadata: {
          tag,
          id: interactiveElement.id || null
        }
      });

      if (target && isWhatsAppTarget(target)) {
        sendAnalytics({
          eventType: "whatsapp_click",
          path,
          label,
          target,
          metadata: {
            tag,
            id: interactiveElement.id || null
          }
        });
      }
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}

function sendAnalytics(payload: AnalyticsPayload) {
  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon("/api/analytics", blob)) {
      return;
    }
  }

  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true
  }).catch(() => undefined);
}

function currentPath() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function shouldIgnoreCurrentPage() {
  return window.location.pathname.startsWith("/admin");
}

function getElementLabel(element: HTMLElement) {
  const label =
    element.getAttribute("aria-label") ??
    element.getAttribute("title") ??
    element.innerText ??
    element.textContent ??
    element.getAttribute("name") ??
    element.tagName.toLowerCase();

  return label.replace(/\s+/g, " ").trim().slice(0, 160);
}

function isWhatsAppTarget(target: string) {
  const normalized = target.toLowerCase();
  return normalized.includes("wa.me") || normalized.includes("whatsapp.com") || normalized.includes("whatsapp");
}

function safeSessionStorageGet(key: string) {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSessionStorageSet(key: string, value: string) {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // Analytics should never block the visitor experience.
  }
}
