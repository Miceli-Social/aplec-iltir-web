import type { Metadata } from "next";
import { LunchTicket } from "@/components/aplec-2026-ticket";
export const metadata: Metadata = { title: "Tiquet de reserva", robots: { index: false, follow: false }, referrer: "no-referrer" };
export default function TicketPage() { return <article className="aplec-2026-form-page section-shell"><h1>El teu tiquet de reserva</h1><LunchTicket /></article>; }
