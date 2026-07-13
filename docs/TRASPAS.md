# Traspàs del web Aplec Iltiŕ

Aquest document és la guia curta per passar el projecte al compte de treball `iltir@miceli.social` i deixar-lo publicat a `apleciltir.cat`.

## Objectiu

Que el web deixi de dependre del compte personal i passi a dependre dels comptes de treball:

- GitHub: compte o organització vinculada a `iltir@miceli.social`.
- Vercel: compte vinculat a `iltir@miceli.social`.
- Domini: `apleciltir.cat`, comprat a cdmon.

## Estat actual que cal respectar

El projecte no és només codi. Hi ha contingut editorial viu a Vercel Blob:

- Textos editats des del tauler `/admin`.
- Actes i documents pujats.
- Registres de consentiment dels botons de WhatsApp.

Per això, el traspàs s’ha de fer sense perdre `BLOB_READ_WRITE_TOKEN` ni `CONSENT_ENCRYPTION_SECRET`.

## Pas 1 · Crear el repo nou a GitHub

Opció recomanada:

1. Entrar a GitHub amb el compte `iltir@miceli.social`.
2. Crear un repositori privat o públic, per exemple:
   - `aplec-iltir-web`
3. No afegir README ni `.gitignore` des de GitHub si el projecte ja es puja des d’aquesta carpeta.

Després, des d’aquest directori local:

```bash
git init
git add .
git commit -m "Initial import Aplec Iltiŕ web"
git branch -M main
git remote add origin https://github.com/USUARI_O_ORG/aplec-iltir-web.git
git push -u origin main
```

## Pas 2 · Crear el projecte nou a Vercel

1. Entrar a Vercel amb `iltir@miceli.social`.
2. Importar el repo `aplec-iltir-web` des de GitHub.
3. Framework: Next.js.
4. Build command: deixar el valor detectat o `pnpm build`.
5. Install command: deixar el valor detectat o `pnpm install`.

## Pas 3 · Copiar variables d’entorn

Al projecte nou de Vercel, anar a:

Project Settings → Environment Variables

I copiar com a mínim:

- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `BLOB_READ_WRITE_TOKEN`
- `CONSENT_ENCRYPTION_SECRET`
- `CONSENT_GOOGLE_SCRIPT_URL`, si el registre s’envia a Google Drive/Sheets.
- `CONSENT_GOOGLE_SCRIPT_SECRET`, si el webhook el fa servir.
- `GOOGLE_SHEET_CSV_URL`, si hi ha Google Sheet connectat.
- `GOOGLE_CALENDAR_ICS_URL`, si hi ha Google Calendar connectat.
- `NEXT_PUBLIC_SITE_URL=https://apleciltir.cat`

Important: si es canvia `CONSENT_ENCRYPTION_SECRET`, els consentiments antics poden quedar il·legibles.

## Pas 4 · Provar el projecte nou

Abans de moure el domini:

1. Obrir la URL temporal de Vercel.
2. Entrar a `/admin`.
3. Comprovar que es veuen les actes i les edicions manuals.
4. Comprovar que el botó de WhatsApp mostra el formulari de protecció de dades.
5. Fer una prova controlada de consentiment, si cal.

## Pas 5 · Moure `apleciltir.cat`

Quan el projecte nou funcioni:

1. Al projecte antic de Vercel, eliminar:
   - `apleciltir.cat`
   - `www.apleciltir.cat`
2. Al projecte nou de Vercel, afegir:
   - `apleciltir.cat`
   - `www.apleciltir.cat`
3. A cdmon, mantenir DNS apuntant a Vercel:
   - Domini arrel amb registre A cap a Vercel.
   - `www` amb CNAME cap a Vercel.

Si cdmon ja està apuntant a Vercel, normalment no cal canviar DNS; només cal reassignar el domini dins Vercel.

## Pas 6 · No esborrar l’antic fins al final

No esborrar el projecte antic fins que:

- `https://apleciltir.cat` carrega el projecte nou.
- `/admin` funciona.
- Les actes segueixen visibles.
- Els consentiments segueixen visibles.
- El compte de comunicació té accés al GitHub, Vercel i correu.

## Mini formació per comunicació

Per editar contingut:

1. Entrar a `https://apleciltir.cat/admin`.
2. Fer login amb la contrasenya acordada.
3. Editar textos, trobades o actes.
4. Revisar la pàgina pública corresponent.

Per canvis de disseny o codi:

1. Obrir el repo a Codex o en local.
2. Editar fitxers.
3. Executar `pnpm build`.
4. Pujar canvis a GitHub.
5. Vercel desplega automàticament.
