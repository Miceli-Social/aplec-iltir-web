# Aplec Iltiŕ

Web pública de l’Aplec Iltiŕ i eina editorial per explicar i activar l’arquitectura de governança compartida de Cabanelles, Lladó i Navata.

## Desenvolupament local

```bash
pnpm install
pnpm dev
```

La web pública és a `/` i el tauler privat és a `/admin`.

## Contingut i administració

La web combina tres capes de contingut:

1. Contingut base dins el codi, sobretot a `src/lib/content.ts`.
2. Fonts opcionals externes: Google Sheet i Google Calendar.
3. Edicions manuals des de `/admin`, desades a Vercel Blob.

El punt important: les edicions humanes del tauler, les actes pujades i els registres de consentiment no viuen només al codi. Per això, en qualsevol traspàs de Vercel cal conservar o migrar correctament `BLOB_READ_WRITE_TOKEN`.

Des del tauler privat es pot:

- Editar textos, propòsits, propers passos i enllaços de cada cercle.
- Afegir, editar i eliminar trobades.
- Pujar actes públiques en PDF.
- Publicar enllaços de Google Docs o Drive.
- Consultar els registres de protecció de dades vinculats als botons de WhatsApp.

## Variables d’entorn

Copieu `.env.example` a `.env.local` per treballar en local. A Vercel, configureu les mateixes claus a Project Settings → Environment Variables.

Variables imprescindibles:

- `ADMIN_PASSWORD`: contrasenya del tauler privat.
- `ADMIN_SESSION_SECRET`: secret per signar la sessió d’admin.
- `BLOB_READ_WRITE_TOKEN`: accés al Vercel Blob on es guarden edicions, actes i consentiments.

Variables importants si feu servir el registre legal de WhatsApp:

- `CONSENT_ENCRYPTION_SECRET`: secret propi per xifrar els consentiments. No el canvieu si ja hi ha registres creats.
- `CONSENT_GOOGLE_SCRIPT_URL`: webhook opcional per copiar els registres a Google Drive/Sheets.
- `CONSENT_GOOGLE_SCRIPT_SECRET`: secret opcional compartit amb el webhook.

Variables opcionals de contingut extern:

- `GOOGLE_SHEET_CSV_URL`: exportació CSV pública d’un Google Sheet.
- `GOOGLE_CALENDAR_ICS_URL`: adreça iCal pública d’un Google Calendar.
- `NEXT_PUBLIC_SITE_URL`: URL canònica de producció, actualment `https://apleciltir.cat`.

## Desplegament

El projecte està pensat per desplegar-se a Vercel com a aplicació Next.js.

Comandes habituals:

```bash
pnpm build
vercel deploy --prod
```

En el traspàs a un compte nou, no es recomana esborrar el projecte antic fins que:

1. El GitHub nou tingui tot el codi.
2. El Vercel nou desplegui correctament.
3. Les variables d’entorn estiguin copiades.
4. L’admin funcioni.
5. El domini `apleciltir.cat` apunti al projecte nou.
