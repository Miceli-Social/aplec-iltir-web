# Inscripcions de l’Aplec 2026

## Configuració de producció

No s’ha creat ni connectat cap servei extern amb aquesta implementació.

### Emmagatzematge privat (necessari per desar)

Crear un **Vercel Blob PRIVAT**, separat del store públic editorial, i configurar
`REGISTRATION_BLOB_READ_WRITE_TOKEN`. No reutilitzar `BLOB_READ_WRITE_TOKEN`.
El codi exigeix el token propi i `access: "private"` en totes les operacions.
Sense aquest servei, el formulari informa que no es pot desar; mai simula una
inscripció correcta ni fa servir un fitxer local o el Blob públic com a alternativa.

Documents privats:

- `iltir-2026/volunteers/registrations.json`
- `iltir-2026/lunch/registrations.json`
- `iltir-2026/walk/registrations.json`

La caminada només registra nom, cognoms, correu i telèfon, amb el consentiment i
les metadades de registre. No té límit de places, estats de pagament ni tiquets.
El seu recompte és independent del dinar.

Cada document conté registres amb identificador propi. El del dinar inclou també
el total de places de venda física. El registre, la clau de reintent i el còmput
d’aforament es desen en **una única escriptura atòmica**. Les lectures van a origen
(`useCache: false`) i les actualitzacions utilitzen l’ETag amb `ifMatch`, amb
reintents limitats. La primera escriptura no permet sobreescriure. No s’utilitza
un recompte de `list()` ni un bloqueig de memòria d’una sola instància.

No editar manualment aquests documents mentre s’estan rebent reserves. El model
de document únic està pensat per a aquest esdeveniment petit, no per a una plataforma
de grans volums. Si s’amplia l’abast, migrar a un magatzem transaccional.

### Correus (opcionals per desar, necessaris per notificar)

Configurar Resend i un remitent verificat:

```dotenv
RESEND_API_KEY=
REGISTRATION_FROM_EMAIL=
REGISTRATION_NOTIFY_EMAIL=carla@resilience.earth
REGISTRATION_WALK_NOTIFY_EMAIL=lluis.arambilet@gmail.com
NEXT_PUBLIC_SITE_URL=https://apleciltir.cat
```

Primer es desa el registre amb notificacions pendents, després `after()` intenta
enviar els dos correus. S’utilitza l’API HTTP de Resend, sense afegir-ne l’SDK.
Sense configuració queden pendents; davant d’un error del proveïdor queden fallits.
La resposta de reserva correcta no depèn del correu. Si falla el desat de l’estat
del correu, el registre continua pendent de revisió. L’admin permet reintentar els
correus no enviats. Resend rep claus d’idempotència per registre i destinatari
(la seva finestra de deduplicació és de 24 hores). «Acceptat pel proveïdor» no
equival a lliurament confirmat a la bústia: no hi ha webhook de lliurament.

No s’ha enviat cap correu real durant les proves.
Les notificacions de caminada van al destinatari específic; les de voluntariat i
dinar continuen anant a Carla. La confirmació de caminada acredita la recepció de
la inscripció. Les reserves cancel·lades no permeten reenviar correus.

## Administració

`/admin` conserva la seva autenticació existent (`ADMIN_PASSWORD` i
`ADMIN_SESSION_SECRET`). La secció **Aplec 2026 · Inscripcions** mostra els registres,
permet exportar CSV i gestiona els estats pendent, pagat i cancel·lat del dinar.
La caminada té un bloc propi de consulta, exportació CSV i reintent de correus.
Les exportacions i mutacions de `/admin/aplec-2026` exigeixen la mateixa sessió;
els POST comproven també l’origen. Les respostes de dades i CSV són `private, no-store`.
El CSV neutralitza les fórmules i no inclou les credencials dels tiquets.

**Venda física:** introduir el total de places físiques a l’admin abans de confirmar
tiquets físics. No comptar-hi les persones que ja tenen reserva online: per a
aquestes, marcar la reserva com a pagada. Les places físiques i les reserves online
no cancel·lades comparteixen el límit de 120. Cancel·lar allibera places; reactivar
torna a comprovar l’aforament. El servidor tanca les reserves noves el 18 d’octubre
a les 00.00 h d’Europe/Madrid, és a dir, al final del dissabte 17.

## Tiquets i dades personals

Els números de reserva són aleatoris i no serveixen per si sols per llegir dades.
L’enllaç privat porta una credencial aleatòria de 256 bits al fragment (`#`), que
el navegador envia al servidor dins del cos d’un POST. No s’inclou a la URL de la
petició ni als referrers. No es retorna cap URL de Blob. El tiquet exposa només
la informació de la reserva corresponent, sense correu ni telèfon. No compartir
l’enllaç privat. La pàgina no carrega Analytics i declara `noindex` i `no-referrer`.

El PDF es genera al servidor amb `pdf-lib`, `@pdf-lib/fontkit` i la font Liberation
Sans inclosa amb la seva llicència a `src/assets/fonts/`. La configuració de tracing
inclou la font al desplegament. La descàrrega és un PDF real, no una finestra d’impressió.
El tiquet web i el PDF mostren l’estat actual: pendent de pagament, pagada o
cancel·lada sense plaça reservada. L’avís que la reserva no acredita el pagament
només apareix en l’estat pendent.

Es desa `createdAt`, `consentVersion` i el text de consentiment acceptat. La versió
inicial és `2026-09-24-v1`; preservar aquesta versió en l’historial quan es modifiqui
la informació de protecció de dades. No es recullen DNI/NIE, IP, drets d’imatge ni
consentiment comercial. No s’escriuen dades personals en logs de l’aplicació.
La política de conservació requereix una revisió de l’organització després de
l’esdeveniment; no s’ha inventat un termini de supressió automàtic.

## Proves locals

```sh
node --test tests/aplec-2026-registrations.test.mjs
pnpm lint
pnpm build
```

Les proves del servidor executen els mòduls reals amb adaptadors locals de Blob,
correu i autenticació. Inclouen concurrència, aforament, duplicats, consentiment,
validació, termini, cancel·lacions, venda física, correu fallit, CSV i descàrrega PDF.
No acrediten la configuració real dels serveis de producció.

La prova de navegador reutilitzable necessita Playwright disponible a l’entorn
(no s’ha afegit com a dependència del projecte), Edge i el servidor local:

```sh
pnpm start --port 3027
# PLAYWRIGHT_MODULE_PATH: ruta opcional a l’index.mjs de Playwright de l’entorn.
# TEST_BASE_URL: opcional, per defecte http://localhost:3027.
node tests/aplec-2026-browser.mjs
```

Els formularis del navegador criden els handlers reals amb proveïdors substituïts
pel magatzem en memòria de proves. Es comproven errors, reintents, confirmacions,
descàrrega, teclat, 43 activitats i mòbil/desktop. Només s’utilitzen dades fictícies.
No hi ha cap mode de proves ni store de memòria activable a producció.

Abans de posar-ho en servei, cal comprovar amb l’organització el Blob privat,
el remitent verificat i el procediment de venda física. No s’ha fet cap deploy.
