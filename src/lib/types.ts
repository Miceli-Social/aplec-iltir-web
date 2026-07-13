export type MunicipalitySlug = "cabanelles" | "llado" | "navata";
export type CircleKind = "local" | "sectorial";

export type DocumentLink = {
  title: string;
  url: string;
  date?: string;
};

export type Circle = {
  slug: string;
  name: string;
  shortName: string;
  kind: CircleKind;
  municipality?: MunicipalitySlug;
  theme: string;
  summary: string;
  purpose: string;
  workingOn: string[];
  nextSteps: string[];
  documents: DocumentLink[];
  whatsappUrl?: string;
  whatsappActive: boolean;
  linkedCircleSlugs?: string[];
  status?: "actiu" | "emergent";
};

export type Municipality = {
  slug: MunicipalitySlug;
  name: string;
  territory: string;
  intro: string;
  councilFocus: string[];
};

export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end?: string;
  location?: string;
  description?: string;
  tags: string[];
  circleSlug?: string;
  allDay?: boolean;
};

export type WhatsappConsent = {
  id: string;
  circleSlug: string;
  circleName: string;
  name: string;
  dni: string;
  acceptedAt: string;
  consentVersion: string;
  consentEntity?: string;
  userAgent?: string;
  ipAddress?: string;
  acceptLanguage?: string;
  driveSyncedAt?: string;
  driveSyncError?: string;
};
