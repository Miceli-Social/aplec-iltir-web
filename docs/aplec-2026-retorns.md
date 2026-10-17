# Aplec 2026 · Fotos i retorns

## Ús des de /admin

1. Entra amb l'accés d'administració existent i obre «Aplec 2026 · Fotos i retorns».
2. Desplega una activitat del dia corresponent.
3. Selecciona diverses fotografies i prem «Pujar fotografies seleccionades». Es permet publicar amb una sola foto. Màxim 10 per activitat i 15 MB per fitxer. Formats: JPEG, PNG, WebP, AVIF i GIF. Converteix HEIC a JPEG abans de pujar-lo.
4. Tria la principal, indica l'autoria/crèdit i, opcionalment, fins a tres idees, una cita i una URL HTTPS de vídeo.
5. Prem «Desar i publicar». El missatge confirma la publicació i l'enllaç permet obrir la fitxa.
6. Per editar, torna a desplegar l'activitat. Pots canviar la principal, retirar fotos de la galeria, afegir-ne o canviar els textos i tornar a publicar.

Les fotos es pugen directament al Blob públic abans de publicar el retorn; la galeria no apareix al web fins que es desa. No canviïs de pàgina abans de publicar. Si falla una pujada, es mantenen les fotos ja pujades en el formulari: selecciona només les pendents. Retirar una foto de la galeria no elimina el fitxer original de Blob.

El bloc «Reviu l’Aplec Iltiŕ 2026» apareix sota l’hero de la Home només quan hi ha fotos publicades. Mostra automàticament la portada de la darrera activitat amb fotos segons l’ordre del Programa, perquè el model de retorns no exposa una data de publicació. La foto s’optimitza amb `next/image`; en mòbil queda damunt del text i del botó d’accés a `/aplecs/2026/reviu`.

## Arquitectura i fitxers

- `src/lib/aplec-2026-program.ts`: font única de títol, hora, lloc i descripció. IDs literals estables `aplec26-001`…; mai renumerar-los, reutilitzar-los ni generar-los a partir del títol/hora. L'activitat complementària també té ID per compatibilitat amb el tipus compartit; l'editor inclou els tres dies principals.
- `src/lib/aplec-2026-returns.ts`: model, validació i combinació Programa + retorns. Només desa `activityId`, `photos`, `cover`, `credit`, `ideas`, `quote`, `videoUrl`.
- `src/lib/content-store.ts`: ampliació de l'emmagatzematge editorial amb `getAplecReturns()` i `saveAplecReturn()`. Conserva intacte el JSON editorial anterior (cercles, agenda, actes).
- `src/lib/aplec-photo-upload.ts` i `src/app/admin/aplec-photos/route.ts`: pujada directa navegador → Blob, amb autorització admin al servidor, prefix validat, noms sanejats, formats i mida limitats, token curt i sense sobreescriptura.
- `src/app/admin/aplec-return-actions.ts`: autenticació, validació i publicació. Verifica amb Blob `head` l'existència, tipus i mida de cada foto, el domini del magatzem i la pertinença a l'activitat.
- `src/components/aplec-2026-returns-admin.tsx` i `src/app/admin/page.tsx`: editor agrupat per dies, formularis amb estat de progrés/error i controls de mida tàctil.
- `src/components/aplec-return-public.tsx`, `src/app/page.tsx` i `src/app/aplecs/2026/page.tsx`: bloc condicional de Home i indicador a cada activitat amb fotos.
- `src/app/aplecs/2026/reviu/page.tsx`: targetes automàtiques per dia, una foto per activitat publicada.
- `src/app/aplecs/2026/activitats/[activityId]/page.tsx`: fitxa dinàmica que combina Programa + editorial, galeria a dalt i originals oberts en una pestanya nova.
- `src/app/globals.css`: estils adaptables de galeria i editor.
- `tests/aplec-2026-returns.test.mjs`: proves de model, components renderitzats, autenticació, autorització de pujada i persistència/refresc amb Blob simulat.
- `tests/aplec-2026-home-date.test.mjs`: actualitza el mock de dependències de Home per mantenir les proves de dates.

## Blob i publicació sense redeploy

Única credencial utilitzada: `BLOB_READ_WRITE_TOKEN`, del magatzem editorial **públic** existent. No es llegeix ni es modifica `REGISTRATION_BLOB_READ_WRITE_TOKEN`. No hi ha canvis a inscripcions ni correus.

- Fotos: `iltir/aplec-2026/photos/<activityId>/<nom-sanejat>-<sufix-aleatori>`.
- Retorns: `iltir/aplec-2026/returns/<activityId>/<timestamp>-<uuid>.json`.

Cada publicació crea una revisió immutable; el lector pagina el llistat de revisions i tria la més recent de cada activitat. Les URLs noves eviten servir un JSON sobreescrit des de la CDN. Les lectures dels retorns utilitzen `cache: "no-store"` i no passen per la cache de deu minuts dels altres continguts editorials. No cal invalidar ni modificar aquesta cache preexistent.

Home, Programa, Reviu i fitxes són rutes dinàmiques. Després de desar, l'acció executa `revalidatePath()` sobre `/`, `/aplecs/2026`, `/aplecs/2026/reviu`, la fitxa afectada i `/admin`. Una petició nova veu el retorn desat; una pestanya pública que ja estava oberta s'ha de refrescar. Cal desplegar inicialment aquest codi una vegada; les publicacions posteriors no requereixen commits ni builds.

La pujada directa segueix el patró oficial: https://vercel.com/docs/vercel-blob/client-upload. Evita enviar les fotografies dins d'una petició a una Function de Vercel.

## Validació

- `node --test tests/aplec-2026-returns.test.mjs tests/aplec-2026-home-date.test.mjs`: **17/17 passen**.
- ESLint sobre tots els fitxers TypeScript/TSX modificats i les dues proves: **correcte**.
- `tsc --noEmit`: **correcte**.
- `next build`: **correcte**. La primera execució va topar amb un permís del sandbox a `.next`; repetida amb permís ampliat, genera les 29 pàgines correctament.
- Suite completa `node --test tests/*.test.mjs`: **39 passen, 5 fallen**. Les cinc fallades també es reprodueixen amb els fitxers de `HEAD` anteriors al canvi: dos tests antics d'inscripcions/programa i tres de properes activitats encara esperen un programa anterior (43 activitats, dos actes simultanis, menys exposicions i l'horari antic del taller). No s'han alterat els textos ni horaris per adaptar-los a tests obsolets.
- No hi ha credencials editorials locals: les operacions Blob s'han provat amb un servei simulat, no amb publicacions reals.
- El servidor local va iniciar-se, però les eines de navegador i HTTP no hi van poder connectar. No s'afirma verificació visual ni de la pujada real de principi a fi. Cal fer una prova amb fins a 10 fotos en un entorn amb Blob abans de l'ús durant l'Aplec.

## Límits operatius

- Dos editors poden publicar activitats diferents sense sobreescriure's. Si editen alhora la mateixa activitat, preval la revisió amb el timestamp més recent; no hi ha bloqueig ni fusió d'edicions. Eviteu editar simultàniament una mateixa activitat.
- Les revisions històriques i fotos retirades/pugades però no publicades es conserven. Cal preveure neteja posterior i costos de Blob. El llistat i les lectures per petició prioritzen frescor; el cost creix amb les revisions.
- Les vistes Reviu, fitxa i admin utilitzen next/image amb sizes adaptats a la graella i a mòbil/escriptori. Les fotos originals de Blob es conserven intactes i els enllaços de la galeria permeten obrir-los expressament. Next.js pot conservar sense transformar les imatges animades. HEIC no s'admet.
- Si Blob falla en una lectura, es registra l'error i es manté accessible el Programa; els retorns poden desaparèixer temporalment fins a recuperar la connexió. Si una publicació falla, no es mostra confirmació d'èxit.
- El vídeo és un enllaç HTTPS, no una incrustació de tercers. No s'ha afegit un flux d'esborranys ni despublicació completa.

## Optimització de fotografies (revisió abans del merge)

`next.config.ts` autoritza exclusivament HTTPS, sense port alternatiu ni query string, per a `*.public.blob.vercel-storage.com/iltir/aplec-2026/photos/**`. Les tres vistes eliminen `unoptimized` i comparteixen `src/lib/aplec-photo-sizes.ts`, que calcula els sizes segons les columnes, els marges i el nombre de fotos. La principal de la fitxa ocupa tota l’amplada; les altres es carreguen de manera diferida. El navegador demana variants a `/_next/image`; Next.js recupera l’original al servidor per generar-les, sense modificar-lo a Blob.

Proves addicionals: acceptació/rebuig de URLs amb el matcher real de Next.js i renderitzat amb el component real next/image, comprovant src/srcSet optimitzats, sizes i enllaços als originals. Referència: https://nextjs.org/docs/app/api-reference/components/image.

Validació d’aquesta revisió: 13/13 tests de retorns correctes (incloses les dues proves noves d’imatges), TypeScript i lint dels fitxers afectats correctes. La branca incorpora `origin/main` (`29c5517`) mitjançant rebase, sense commit de merge.
Build de producció correcte (29 pàgines), repetit fora del sandbox després del bloqueig EPERM de .next.
