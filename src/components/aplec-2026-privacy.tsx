import { consentPurpose, FOOTBALL_CONSENT_VERSION, CONSENT_VERSION, type RegistrationKind } from "@/lib/aplec-2026-registration";
export function RegistrationPrivacy({ kind }: { kind: RegistrationKind }) {
  return <section className="aplec-2026-privacy" aria-labelledby="privacy-title">
    <h2 id="privacy-title">Protecció de dades</h2>
    <dl>
      <dt>Responsable del tractament</dt><dd>Miceli Rural Coop, SCCL (Miceli Social) · NIF F10983864</dd>
      <dt>Finalitat</dt><dd>{consentPurpose[kind]}</dd>
      <dt>Destinataris</dt><dd>Les dades no es comunicaran a tercers, excepte per obligació legal{kind === "volunteers" ? " o quan sigui necessari per a assegurances o serveis associats a l’activitat voluntària" : kind === "walk" ? " o quan sigui necessari per als serveis associats a l’organització de la caminada" : kind === "football" ? " o quan sigui necessari per a l’assegurança i els serveis associats al torneig" : " o quan sigui necessari per als serveis associats a l’organització del dinar"}.</dd>
      <dt>Conservació</dt><dd>Les dades es conservaran mentre duri {kind === "volunteers" ? "la relació de voluntariat" : kind === "walk" ? "la gestió de la inscripció i de la caminada" : kind === "football" ? "la gestió de la inscripció i del torneig" : "la gestió de la reserva i del dinar"} i, posteriorment, durant el temps necessari per complir obligacions legals o justificar els projectes vinculats.</dd>
      <dt>Drets</dt><dd>Pots exercir els drets d’accés, rectificació, supressió, oposició, limitació del tractament i portabilitat, així com retirar el consentiment, escrivint a <a href="mailto:info@miceli.social">info@miceli.social</a>.</dd>
    </dl>
    <small>Versió de la informació i del consentiment: {kind === "football" ? FOOTBALL_CONSENT_VERSION : CONSENT_VERSION}</small>
  </section>;
}
