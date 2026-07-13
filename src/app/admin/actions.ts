"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  ADMIN_COOKIE,
  createAdminToken,
  isValidAdminToken,
} from "@/lib/admin-auth";
import {
  getEditorialState,
  saveEditorialState,
  uploadPublicDocument,
} from "@/lib/content-store";
import { fallbackCircles } from "@/lib/content";
import { localDateTimeToIso } from "@/lib/date-time";

export async function loginAdmin(formData: FormData) {
  const password = String(formData.get("password") || "");
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    redirect("/admin?error=1");
  }
  (await cookies()).set(ADMIN_COOKIE, createAdminToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 8,
  });
  redirect("/admin");
}

export async function logoutAdmin() {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin");
}

async function requireAdmin() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!isValidAdminToken(token)) redirect("/admin?error=session");
}

const lines = (value: FormDataEntryValue | null) =>
  String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

function refreshPublicPages(slug?: string) {
  revalidatePath("/");
  revalidatePath("/agenda");
  revalidatePath("/admin");
  if (slug) revalidatePath(`/cercles/${slug}`);
}

export async function saveCircle(formData: FormData) {
  await requireAdmin();
  const slug = String(formData.get("slug") || "");
  if (!fallbackCircles.some((circle) => circle.slug === slug)) {
    redirect("/admin?error=circle");
  }
  const state = await getEditorialState({ fresh: true, required: true });
  const whatsappUrl = String(formData.get("whatsappUrl") || "").trim();
  state.circleOverrides[slug] = {
    summary: String(formData.get("summary") || "").trim(),
    purpose: String(formData.get("purpose") || "").trim(),
    workingOn: lines(formData.get("workingOn")),
    nextSteps: lines(formData.get("nextSteps")),
    whatsappUrl: whatsappUrl || undefined,
    whatsappActive:
      formData.get("whatsappActive") === "on" && Boolean(whatsappUrl),
  };
  await saveEditorialState(state);
  refreshPublicPages(slug);
  redirect(`/admin?ok=circle&edit=${slug}`);
}

export async function addEvent(formData: FormData) {
  await requireAdmin();
  const eventId = String(formData.get("eventId") || "");
  const title = String(formData.get("title") || "").trim();
  const start = String(formData.get("start") || "");
  const circleSlug = String(formData.get("circleSlug") || "");
  const circle = fallbackCircles.find((item) => item.slug === circleSlug);
  if (!title || !start || !circle) redirect("/admin?error=event");
  const tags = [
    circle.municipality,
    circle.theme,
    circle.kind === "sectorial" ? "sectorial" : "local",
  ].filter((tag): tag is string => Boolean(tag));
  const state = await getEditorialState({ fresh: true, required: true });
  const event = {
    title,
    start: localDateTimeToIso(start),
    location: String(formData.get("location") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    tags,
    circleSlug,
    allDay: formData.get("allDay") === "on",
  };
  const manualIndex = state.events.findIndex((item) => item.id === eventId);
  if (eventId && manualIndex >= 0) {
    state.events[manualIndex] = { ...state.events[manualIndex], ...event };
  } else if (eventId) {
    state.eventOverrides[eventId] = event;
  } else {
    state.events.push({
      id: `manual-${Date.now()}`,
      ...event,
    });
  }
  await saveEditorialState(state);
  refreshPublicPages(circleSlug);
  redirect(`/admin?ok=event${eventId ? `&event=${encodeURIComponent(eventId)}` : ""}#agenda-admin`);
}

export async function deleteEvent(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const state = await getEditorialState({ fresh: true, required: true });
  state.events = state.events.filter((event) => event.id !== id);
  await saveEditorialState(state);
  refreshPublicPages();
  redirect("/admin?ok=event-deleted#agenda-admin");
}

export async function uploadDocument(formData: FormData) {
  await requireAdmin();
  if (formData.get("publicConfirmed") !== "on") {
    redirect("/admin?error=public-document");
  }
  const circleSlug = String(formData.get("circleSlug") || "");
  const title = String(formData.get("title") || "").trim();
  const file = formData.get("file");
  if (
    !fallbackCircles.some((circle) => circle.slug === circleSlug) ||
    !title ||
    !(file instanceof File) ||
    file.size === 0 ||
    file.size > 8 * 1024 * 1024 ||
    file.type !== "application/pdf"
  ) {
    redirect("/admin?error=document");
  }
  const document = await uploadPublicDocument(file, title);
  const state = await getEditorialState({ fresh: true, required: true });
  state.documents[circleSlug] = [
    ...(state.documents[circleSlug] || []),
    document,
  ];
  await saveEditorialState(state);
  refreshPublicPages(circleSlug);
  redirect(`/admin?ok=document&documents=${circleSlug}#actes-admin`);
}

export async function addDocumentLink(formData: FormData) {
  await requireAdmin();
  if (formData.get("publicConfirmed") !== "on") {
    redirect("/admin?error=public-document");
  }
  const circleSlug = String(formData.get("circleSlug") || "");
  const title = String(formData.get("title") || "").trim();
  const url = String(formData.get("url") || "").trim();
  if (
    !fallbackCircles.some((circle) => circle.slug === circleSlug) ||
    !title ||
    !/^https:\/\//.test(url)
  ) {
    redirect("/admin?error=document-link");
  }
  const state = await getEditorialState({ fresh: true, required: true });
  state.documents[circleSlug] = [
    ...(state.documents[circleSlug] || []),
    {
      title,
      url,
      date: new Intl.DateTimeFormat("ca-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date()),
    },
  ];
  await saveEditorialState(state);
  refreshPublicPages(circleSlug);
  redirect(`/admin?ok=document&documents=${circleSlug}#actes-admin`);
}

export async function removeDocument(formData: FormData) {
  await requireAdmin();
  const circleSlug = String(formData.get("circleSlug") || "");
  const url = String(formData.get("url") || "");
  const state = await getEditorialState({ fresh: true, required: true });
  state.documents[circleSlug] = (state.documents[circleSlug] || []).filter(
    (document) => document.url !== url,
  );
  await saveEditorialState(state);
  refreshPublicPages(circleSlug);
  redirect(`/admin?ok=document-deleted&documents=${circleSlug}#actes-admin`);
}
