import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
function loader(mocks = {}) {
  const cache = new Map();
  function load(file) {
    file = resolve(file);
    if (cache.has(file)) return cache.get(file).exports;
    const loaded = { exports: {} }; cache.set(file, loaded);
    const source = readFileSync(file, 'utf8');
    const { outputText } = ts.transpileModule(source, { compilerOptions: {
      module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
    }});
    new Function('require', 'module', 'exports', outputText)((name) => {
      if (name in mocks) return mocks[name];
      if (name.startsWith('@/') || name.startsWith('./')) {
        const base = name.startsWith('@/') ? resolve('src', name.slice(2)) : resolve(dirname(file), name);
        try { return load(base + '.ts'); } catch (error) { if (error.code !== 'ENOENT') throw error; return load(base + '.tsx'); }
      }
      return require(name);
    }, loaded, loaded.exports);
    return loaded.exports;
  }
  return load;
}
const load = loader();
const model = load('src/lib/aplec-2026-returns.ts');
const { aplec2026Program: program } = load('src/lib/aplec-2026-program.ts');
const activity = program[0].activities[0];
const origin = 'https://teststore.public.blob.vercel-storage.com';
const photo = `${origin}/${model.photoPrefix(activity.id)}foto.jpg`;
const record = { activityId: activity.id, photos: [photo], cover: photo, credit: 'Anna', ideas: ['Escoltar'], quote: 'Un territori compartit', videoUrl: 'https://example.com/video' };
const returns = { [activity.id]: record };
const uiMocks = {
  'next/link': ({ children, ...props }) => React.createElement('a', props, children),
  'next/image': ({ unoptimized, ...props }) => { void unoptimized; return React.createElement('img', props); },
  'next/navigation': { notFound: () => { throw new Error('404'); } },
};

test('persistent activity IDs are unique; all existing programme data is unchanged', () => {
  const ids = program.flatMap(day => day.activities.map(item => item.id));
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every(id => /^aplec26-\d{3}$/.test(id)));
  const original = execFileSync('git', ['show', 'HEAD:src/lib/aplec-2026-program.ts'], { encoding: 'utf8' });
  const compiled = ts.transpileModule(original, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const loaded = { exports: {} }; new Function('exports', compiled)(loaded.exports);
  const withoutIds = program.map(day => ({ ...day, activities: day.activities.map(({ id, ...rest }) => { void id; return rest; }) }));
  const previous = loaded.exports.aplec2026Program.map(day => ({ ...day, activities: day.activities.map(({ id, ...rest }) => { void id; return rest; }) }));
  assert.deepEqual(withoutIds, previous);
});

test('programme indicator and Home block render only for published photographs', () => {
  const { ActivityPhotoLink, ReviuHome } = loader(uiMocks)('src/components/aplec-return-public.tsx');
  assert.equal(renderToStaticMarkup(React.createElement(ActivityPhotoLink, {})), '');
  assert.match(renderToStaticMarkup(React.createElement(ActivityPhotoLink, { editorial: record })), /Fotos disponibles/);
  assert.equal(renderToStaticMarkup(React.createElement(ReviuHome, { returns: {} })), '');
  assert.match(renderToStaticMarkup(React.createElement(ReviuHome, { returns })), /Veure fotos i retorns/);
  assert.equal(model.hasPublishedReturns({ unknown: record }), false);
});

test('Reviu renders only photographed programme activities and one cover each', async () => {
  const page = loader({ ...uiMocks, '@/lib/content-store': { getAplecReturns: async () => returns } })('src/app/aplecs/2026/reviu/page.tsx');
  const html = renderToStaticMarkup(await page.default());
  assert.match(html, new RegExp(activity.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.equal((html.match(/<img /g) || []).length, 1);
  assert.equal(model.publishedDays(returns).flatMap(day => day.activities).length, 1);
  assert.ok(!html.includes(program[0].activities[1].title));
});

test('activity page combines current programme data with editorial gallery and credits', async () => {
  const page = loader({ ...uiMocks, '@/lib/content-store': { getAplecReturns: async () => returns } })('src/app/aplecs/2026/activitats/[activityId]/page.tsx');
  const html = renderToStaticMarkup(await page.default({ params: Promise.resolve({ activityId: activity.id }) }));
  for (const text of [activity.title, activity.time, activity.location, activity.moreInfo, record.credit, record.ideas[0], record.quote]) assert.ok(html.includes(text), text);
  assert.ok(html.includes(photo));
  assert.ok(html.includes('target="_blank"'));
  await assert.rejects(page.default({ params: Promise.resolve({ activityId: 'unknown' }) }), /404/);
});

test('return validation rejects unknown activities, foreign covers, excess photos, ideas and unsafe video URLs', () => {
  assert.deepEqual(model.validateReturn(record), record);
  for (const changes of [{ activityId: 'unknown' }, { photos: [] }, { cover: 'other' }, { photos: Array(7).fill(photo) }, { ideas: ['1','2','3','4'] }, { credit: '' }, { videoUrl: 'javascript:alert(1)' }]) {
    assert.throws(() => model.validateReturn({ ...record, ...changes }));
  }
  assert.equal(model.cleanPhotoName('../Fòto bonica.JPG'), 'foto-bonica.jpg');
});

test('publication authenticates before storage and revalidates every public surface without deploy', async () => {
  let authenticated = false; const saved = []; const paths = [];
  const actions = loader({
    'next/headers': { cookies: async () => ({ get: () => ({ value: 'token' }) }) },
    'next/cache': { revalidatePath: path => paths.push(path) },
    '@/lib/admin-auth': { ADMIN_COOKIE: 'admin', isValidAdminToken: () => authenticated },
    '@/lib/content-store': { saveAplecReturn: async value => saved.push(value) },
  })('src/app/admin/aplec-return-actions.ts');
  assert.ok((await actions.publishAplecReturn(record)).error);
  assert.equal(saved.length, 0); assert.equal(paths.length, 0);
  authenticated = true;
  assert.deepEqual(await actions.publishAplecReturn(record), { ok: true });
  assert.deepEqual(saved, [record]);
  assert.deepEqual(paths, ['/', '/aplecs/2026', '/aplecs/2026/reviu', model.activityUrl(activity.id), '/admin']);
});

test('upload authorization requires admin, scopes paths and limits formats and bytes', async () => {
  let authenticated = false; let configuration; let pathname = model.photoPrefix(activity.id) + 'foto.jpg';
  const route = loader({
    'next/headers': { cookies: async () => ({ get: () => ({ value: 'token' }) }) },
    '@/lib/admin-auth': { ADMIN_COOKIE: 'admin', isValidAdminToken: () => authenticated },
    '@vercel/blob/client': { handleUpload: async options => { configuration = await options.onBeforeGenerateToken(pathname, activity.id); return { ok: true }; } },
  })('src/app/admin/aplec-photos/route.ts');
  const request = () => new Request('https://example.com/admin/aplec-photos', { method: 'POST', body: '{}' });
  assert.equal((await route.POST(request())).status, 400);
  authenticated = true;
  assert.equal((await route.POST(request())).status, 200);
  assert.equal(configuration.maximumSizeInBytes, 15 * 1024 * 1024);
  assert.ok(!configuration.allowedContentTypes.includes('image/svg+xml'));
  assert.equal(configuration.allowOverwrite, false);
  pathname = 'iltir/editorial-state/state.json';
  assert.equal((await route.POST(request())).status, 400);
});

test('public Blob revisions are visible on next read across instances; unrelated editorial state is untouched', async () => {
  const before = process.env.BLOB_READ_WRITE_TOKEN; const oldFetch = global.fetch;
  process.env.BLOB_READ_WRITE_TOKEN = 'vercel_blob_rw_teststore_secret';
  const blobs = []; const contents = new Map(); const reads = [];
  const mockBlob = {
    list: async ({ prefix, token }) => { assert.equal(token, process.env.BLOB_READ_WRITE_TOKEN); return { blobs: blobs.filter(blob => blob.pathname.startsWith(prefix)), hasMore: false }; },
    head: async () => ({ contentType: 'image/jpeg', size: 1024 }),
    put: async (pathname, body, options) => { assert.equal(options.access, 'public'); assert.equal(options.token, process.env.BLOB_READ_WRITE_TOKEN); assert.ok(pathname.startsWith('iltir/aplec-2026/returns/')); const blob = { pathname, url: origin + '/' + pathname }; blobs.push(blob); contents.set(blob.url, body); return blob; },
  };
  global.fetch = async (url, options) => { reads.push(options); return new Response(contents.get(url)); };
  try {
    const store = loader({ '@vercel/blob': mockBlob })('src/lib/content-store.ts');
    assert.deepEqual(await store.getAplecReturns(), {});
    await store.saveAplecReturn(record);
    assert.deepEqual(await store.getAplecReturns(), returns);
    await new Promise(resolve => setTimeout(resolve, 3));
    await store.saveAplecReturn({ ...record, credit: 'Nou crèdit' });
    const otherInstance = loader({ '@vercel/blob': mockBlob })('src/lib/content-store.ts');
    assert.equal((await otherInstance.getAplecReturns())[activity.id].credit, 'Nou crèdit');
    assert.ok(reads.every(options => options.cache === 'no-store'));
    const badPhoto = 'https://foreign.example/photo.jpg';
    await assert.rejects(store.saveAplecReturn({ ...record, photos: [badPhoto], cover: badPhoto }));
    assert.equal(blobs.length, 2);
  } finally { global.fetch = oldFetch; if (before === undefined) delete process.env.BLOB_READ_WRITE_TOKEN; else process.env.BLOB_READ_WRITE_TOKEN = before; }
});

test('upload helper validates files before uploading and returns public URL', async () => {
  const uploaded = [];
  const helper = loader({ '@vercel/blob/client': { upload: async (...args) => { uploaded.push(args); return { url: photo }; } } })('src/lib/aplec-photo-upload.ts');
  await assert.rejects(helper.uploadAplecPhoto(new File(['x'], 'bad.svg', { type: 'image/svg+xml' }), activity.id));
  assert.equal(uploaded.length, 0);
  const file = new File(['jpeg'], 'Fòto bonica.jpg', { type: 'image/jpeg' });
  assert.equal(await helper.uploadAplecPhoto(file, activity.id), photo);
  assert.equal(uploaded[0][0], model.photoPrefix(activity.id) + 'foto-bonica.jpg');
  assert.equal(uploaded[0][2].handleUploadUrl, '/admin/aplec-photos');
});

test('admin page does not read returns or expose editor before authentication', async () => {
  let reads = 0;
  const page = loader({
    ...uiMocks,
    'next/headers': { cookies: async () => ({ get: () => undefined }) },
    '@/lib/admin-auth': { ADMIN_COOKIE: 'admin', isAdminConfigured: () => true, isValidAdminToken: () => false },
    '@/app/admin/actions': { loginAdmin: '/admin' },
    '@/components/aplec-2026-registration-admin': { RegistrationAdmin: () => null },
    '@/components/aplec-2026-returns-admin': { AplecReturnsAdmin: () => 'EDITOR MUST NOT RENDER' },
    '@/lib/content-store': { getAplecReturns: async () => { reads++; return returns; } },
    '@/lib/consent-store': {}, '@/lib/remote-content': {},
  })('src/app/admin/page.tsx');
  const html = renderToStaticMarkup(await page.default({ searchParams: Promise.resolve({}) }));
  assert.ok(html.includes('Contrasenya'));
  assert.ok(!html.includes('EDITOR MUST NOT RENDER'));
  assert.equal(reads, 0);
});

test('programme renders photo link only on its matching activity', async () => {
  const page = loader({ ...uiMocks, '@/lib/content-store': { getAplecReturns: async () => returns } })('src/app/aplecs/2026/page.tsx');
  const html = renderToStaticMarkup(await page.default());
  assert.equal((html.match(/Fotos disponibles/g) || []).length, 1);
  assert.ok(html.includes(model.activityUrl(activity.id)));
});

test('image optimizer allows only HTTPS Aplec photo paths in public Blob stores', () => {
  const config = load('next.config.ts').default;
  const { hasRemoteMatch } = require('next/dist/shared/lib/match-remote-pattern');
  const allowed = url => hasRemoteMatch([], config.images.remotePatterns, new URL(url));
  assert.equal(allowed(photo), true);
  for (const url of [photo.replace('https:', 'http:'), photo.replace('.public.', '.private.'), photo.replace('/photos/', '/returns/'), photo + '?download=1', photo.replace('.com/', '.com:8443/'), photo.replace('teststore.public.blob.vercel-storage.com', 'example.com')]) {
    assert.equal(allowed(url), false, url);
  }
});

test('public galleries and admin render responsive optimizer URLs while activity links keep originals', async () => {
  const config = load('next.config.ts').default;
  const { imageConfigDefault } = require('next/dist/shared/lib/image-config');
  const { ImageConfigContext } = require('next/dist/shared/lib/image-config-context.shared-runtime');
  const nextImage = require('next/image');
  const imageMocks = { ...uiMocks, 'next/image': nextImage,
    '@/lib/content-store': { getAplecReturns: async () => returns },
    '@/lib/aplec-photo-upload': {}, '@/app/admin/aplec-return-actions': {},
  };
  const render = element => renderToStaticMarkup(React.createElement(ImageConfigContext.Provider, { value: { ...imageConfigDefault, ...config.images } }, element));
  const detail = loader(imageMocks)('src/app/aplecs/2026/activitats/[activityId]/page.tsx');
  const html = render(await detail.default({ params: Promise.resolve({ activityId: activity.id }) }));
  assert.ok(html.includes(`href="${photo}"`));
  const reviu = loader(imageMocks)('src/app/aplecs/2026/reviu/page.tsx');
  const admin = loader(imageMocks)('src/components/aplec-2026-returns-admin.tsx');
  for (const markup of [html, render(await reviu.default()), render(React.createElement(admin.AplecReturnsAdmin, { returns }))]) {
    assert.match(markup, /src="\/_next\/image\?/);
    assert.match(markup, /srcSet="\/_next\/image\?/);
    assert.match(markup, /sizes="\(max-width:/);
    assert.ok(!markup.includes(`src="${photo}"`));
  }
});
