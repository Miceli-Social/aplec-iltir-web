import { isRegistrationAdmin } from "@/lib/aplec-2026-registration-admin";
import { getRegistrations, getLunchSummary, hasRegistrationStore } from "@/lib/aplec-2026-registration-store";
import { LUNCH_CAPACITY, lunchStatusLabels, type RegistrationRecord } from "@/lib/aplec-2026-registration";
import { adminDateTimeFormatter } from "@/lib/date-time";
const resultMessages: Record<string, string> = {
  saved: "Canvis desats. Revisa l’estat dels correus a cada inscripció.",
  capacity: "No hi ha prou places per completar aquest canvi.",
  cancelled: "La reserva està cancel·lada. No s’ha reenviat cap correu.",
  "not-found": "No s’ha trobat la inscripció. Actualitza el tauler.",
  invalid: "Revisa el nombre de places indicat.",
  conflict: "Hi ha un conflicte amb una altra operació. Actualitza el tauler i torna-ho a provar.",
};
function Notification({ record }: { record: RegistrationRecord }) {
  const labels = { pending: "Pendent", sent: "Acceptat pel proveïdor", failed: "Ha fallat" };
  return <div><p>Notificació a l’organització: {labels[record.notifications.organization]}<br />Confirmació a la persona: {labels[record.notifications.participant]}</p>
    {(record.notifications.organization !== "sent" || record.notifications.participant !== "sent") && record.status !== "cancelled" && <form method="post" action="/admin/aplec-2026"><input type="hidden" name="action" value="notify" /><input type="hidden" name="id" value={record.id} /><input type="hidden" name="kind" value={record.kind} /><button className="text-link" type="submit">Reintenta els correus pendents</button></form>}
  </div>;
}
export async function RegistrationAdmin({ result }: { result?: string }) {
  if (!(await isRegistrationAdmin())) return null;
  let volunteers: RegistrationRecord[] = [], lunch: RegistrationRecord[] = [], walk: RegistrationRecord[] = [];
  let physicalPlaces = 0, reserved = 0;
  let unavailable = !hasRegistrationStore();
  if (!unavailable) {
    try {
      const [volunteerRecords, summary, walkRecords] = await Promise.all([getRegistrations("volunteers"), getLunchSummary(), getRegistrations("walk")]);
      volunteers = volunteerRecords; lunch = summary.records; walk = walkRecords; physicalPlaces = summary.physicalPlaces; reserved = summary.reserved;
    }
    catch { unavailable = true; }
  }
  return <section id="inscripcions-aplec" className="admin-editor-section">
    <div className="admin-section-heading"><span className="eyebrow">05 · Aplec 2026</span><h2>Aplec 2026 · Inscripcions</h2></div>
    {result && <p role="status">{resultMessages[result] || "No s’ha pogut completar l’operació. Torna-ho a provar."}</p>}
    {unavailable ? <p className="admin-alert error">No es poden consultar les inscripcions. Comprova el Blob PRIVAT i REGISTRATION_BLOB_READ_WRITE_TOKEN.</p> : <>
      <h3>Voluntariat</h3><a className="text-link" href="/admin/aplec-2026?kind=volunteers">Exporta voluntariat CSV</a>
      <div className="aplec-2026-admin-records">{volunteers.length ? [...volunteers].reverse().map(record => <article key={record.id}>
        <h4>{record.firstName} {record.lastName}</h4><p>{adminDateTimeFormatter.format(new Date(record.createdAt))} · {record.age} anys</p>
        <p>{record.email}<br />{record.phone}</p><p>{record.days?.join(" · ")}</p><p className="aplec-2026-preserve-lines">Franges: {record.availability}</p><p className="aplec-2026-preserve-lines">Observacions: {record.observations || "—"}</p><Notification record={record} />
      </article>) : <p>Encara no hi ha inscripcions.</p>}</div>
      <h3>Dinar</h3><p><strong>{reserved} / {LUNCH_CAPACITY} places reservades</strong></p><p>Les reserves cancel·lades no consumeixen aforament. Reserva aquí les places de venda física abans de confirmar-les. No hi comptis persones que ja tenen una reserva online.</p>
      <form method="post" action="/admin/aplec-2026" className="admin-form"><input type="hidden" name="action" value="physical" /><label htmlFor="physicalPlaces">Total de places reservades per venda física</label><input id="physicalPlaces" name="physicalPlaces" type="number" min={0} max={LUNCH_CAPACITY} step={1} defaultValue={physicalPlaces} required /><button className="button button-primary" type="submit">Actualitza les places físiques</button></form>
      <a className="text-link" href="/admin/aplec-2026?kind=lunch">Exporta reserves CSV</a>
      <div className="aplec-2026-admin-records">{lunch.length ? [...lunch].reverse().map(record => <article key={record.id}>
        <h4>{record.id}</h4><p>{adminDateTimeFormatter.format(new Date(record.createdAt))}</p><p>{record.firstName} {record.lastName}<br />{record.email}<br />{record.phone}</p>
        <p>{record.people} persones · {record.vegetarian} menús vegetarians</p><p>{lunchStatusLabels[record.status!]}</p>
        <form method="post" action="/admin/aplec-2026"><input type="hidden" name="id" value={record.id} /><label htmlFor={`status-${record.id}`}>Estat de {record.id}</label><select id={`status-${record.id}`} name="status" defaultValue={record.status}>{Object.entries(lunchStatusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select><button className="button button-primary" type="submit">Desa l’estat</button></form>
        <Notification record={record} />
      </article>) : <p>Encara no hi ha reserves.</p>}</div>
      <h3>Caminada</h3><a className="text-link" href="/admin/aplec-2026?kind=walk">Exporta caminada CSV</a>
      <div className="aplec-2026-admin-records">{walk.length ? [...walk].reverse().map(record => <article key={record.id}>
        <h4>{record.firstName} {record.lastName}</h4>
        <p>{adminDateTimeFormatter.format(new Date(record.createdAt))}</p>
        <p>{record.email}<br />{record.phone}</p>
        <Notification record={record} />
      </article>) : <p>Encara no hi ha inscripcions a la caminada.</p>}</div>
    </>}
  </section>;
}
