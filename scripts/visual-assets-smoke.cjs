const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '..');
const rel = (p) => path.relative(root, p).replaceAll('\\', '/');
const missing = [];
const sourceFiles = [
  path.join(root, 'src', 'components', 'GameClient.tsx'),
  path.join(root, 'src', 'app', 'globals.css'),
  path.join(root, 'src', 'lib', 'visualAssets.ts'),
];
for (const file of sourceFiles) {
  const text = fs.readFileSync(file, 'utf8');
  const regex = /["'(]\/assets\/([^"')]+)["')]/g;
  let match;
  while ((match = regex.exec(text))) {
    const asset = path.join(root, 'public', 'assets', match[1]);
    if (!fs.existsSync(asset)) missing.push(`${rel(file)} -> /assets/${match[1]}`);
    else if (!fs.statSync(asset).size) missing.push(`${rel(file)} -> /assets/${match[1]} (empty)`);
  }
}

const worldDir = path.join(root, 'public', 'assets', 'world');
const requiredCrops = [
  'capital-dawn.webp', 'market-evening.webp', 'old-streets-night.webp',
  'tavern-interior.webp', 'royal-sanctuary.webp', 'equipment-stilllife.webp',
  'crafting-forge.webp', 'combat-arena.webp', 'dialogue-scene.webp',
  'world-chart.webp', 'forest-exploration.webp', 'alpine-frontier.webp',
  'dungeon-depths.webp', 'eye-observation.webp', 'character-codex.webp',
  'harbor-night.webp', 'caravan-road.webp', 'inner-city-night.webp', 'apothecary-workshop.webp',
];
for (const name of requiredCrops) {
  const file = path.join(worldDir, name);
  if (!fs.existsSync(file)) missing.push(`required clean world art -> ${name}`);
  else if (fs.statSync(file).size < 1000) missing.push(`world art unexpectedly small -> ${name}`);
}

function objectBlock(source, constant) {
  const start = source.indexOf(`export const ${constant}`);
  if (start < 0) return '';
  const open = source.indexOf('{', source.indexOf('=', start));
  const close = source.indexOf('\n};', open);
  return open >= 0 && close >= 0 ? source.slice(open + 1, close) : '';
}
function parseStringMap(block) {
  const values = new Map();
  const regex = /^\s*"([^"\n]+)"\s*:\s*"([^"\n]+)"\s*,?\s*$/gm;
  let match;
  while ((match = regex.exec(block))) values.set(match[1], match[2]);
  return values;
}
function sha(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}
const visualSource = fs.readFileSync(path.join(root, 'src/lib/visualAssets.ts'), 'utf8');
const itemMap = parseStringMap(objectBlock(visualSource, 'ITEM_ART: Record<string, string>'));
const familyBlock = objectBlock(visualSource, 'ITEM_FAMILY_FALLBACK_ART: Record<string, string>');
const categoryBlock = objectBlock(visualSource, 'ITEM_CATEGORY_FALLBACK_ART: Record<string, string>');
const familyMap = new Map();
for (const match of familyBlock.matchAll(/^\s*"?([A-Za-z0-9]+)"?\s*:\s*ITEM_ART\.([A-Za-z0-9]+)\s*,?\s*$/gm)) familyMap.set(match[1], match[2]);
const categoryMap = new Map();
for (const match of categoryBlock.matchAll(/^\s*([A-Za-z0-9]+)\s*:\s*ITEM_ART\.([A-Za-z0-9]+)\s*,?\s*$/gm)) categoryMap.set(match[1], match[2]);
const npcMap = parseStringMap(objectBlock(visualSource, 'NPC_PORTRAIT_ART: Record<string, string>'));
const districtMap = parseStringMap(objectBlock(visualSource, 'DISTRICT_ART: Record<string, string>'));

const contentSource = fs.readFileSync(path.join(root, 'src/lib/content.ts'), 'utf8');
const expansionSource = fs.readFileSync(path.join(root, 'src/lib/expansionItems.ts'), 'utf8');
const catalogIds = new Set();
for (const source of [contentSource, expansionSource]) {
  const blocks = [];
  if (source === contentSource) {
    const base = source.split('const BASE_ITEMS: ItemDefinition[] = [')[1]?.split('\n];')[0] ?? '';
    blocks.push(base);
  } else {
    blocks.push(source.split('export const EXPANSION_ITEMS: ItemDefinition[] = [')[1]?.split('\n];')[0] ?? '');
  }
  for (const block of blocks) {
    for (const match of block.matchAll(/\bid:\s*"([A-Za-z0-9]+)"/g)) catalogIds.add(match[1]);
  }
}
for (const [id, url] of itemMap) {
  if (!catalogIds.has(id)) missing.push(`ITEM_ART references unknown authored item ID -> ${id}`);
  const file = path.join(root, 'public', url.replace(/^\//, ''));
  if (!fs.existsSync(file)) missing.push(`item artwork missing -> ${id} (${url})`);
  else if (fs.statSync(file).size < 1000) missing.push(`item artwork unexpectedly small -> ${id} (${url})`);
}
if (itemMap.size !== 74) missing.push(`expected 74 explicitly mapped item arts after alpha.18, found ${itemMap.size}`);
if (new Set(itemMap.values()).size !== itemMap.size) missing.push('ITEM_ART has duplicate file paths');
const itemHashes = [...itemMap.values()].map((url) => sha(path.join(root, 'public', url.replace(/^\//, ''))));
if (new Set(itemHashes).size !== itemHashes.length) missing.push('ITEM_ART contains byte-identical item images for different IDs');

const cropReceiptPath = path.join(root, 'docs/artwork-sources/integration-sources/crop-receipts.json');
const preservedGridPath = path.join(root, 'docs/artwork-sources/integration-sources/a_dark_moody_high_detail_fantasy_item_icon_grid.png');
const alpha6Crops = ['courtInvitation', 'blackCoin', 'royalTransitPass', 'rareAmber', 'blackSalt', 'guildWaxSet', 'echoThreadCloak', 'harborCoat', 'dockHook', 'watchLantern'];
const alpha8Crops = ['rustedKey', 'navigatorChart', 'sailorsStew', 'shipRepairKit', 'diplomaticToken'];
let receiptItems = [];
try { receiptItems = JSON.parse(fs.readFileSync(cropReceiptPath, 'utf8')).items ?? []; }
catch (error) { missing.push(`crop receipts JSON could not be parsed: ${error instanceof Error ? error.message : String(error)}`); }
if (!fs.existsSync(preservedGridPath)) missing.push('preserved item contact grid source is missing');
else {
  const sourceHash = sha(preservedGridPath);
  for (const id of alpha6Crops) {
    const receipt = receiptItems.find(item => item.id === id);
    if (!receipt) { missing.push(`missing crop lineage receipt -> ${id}`); continue; }
    if (receipt.source_sha256 !== sourceHash) missing.push(`crop source hash mismatch -> ${id}`);
    if (receipt.output_path !== itemMap.get(id)) missing.push(`crop receipt output path differs from unique map -> ${id}`);
    if (receipt.origin !== 'preserved conversation-generated artwork contact sheet from AIMORPG_VISUAL_ASSET_ARCHIVE_2026-10-18.zip; cropped in alpha.6') missing.push(`unexpected crop provenance -> ${id}`);
    if (!fs.existsSync(path.join(root, 'public', receipt.output_path.replace(/^\//, '')))) missing.push(`cropped item image missing -> ${id}`);
  }
}
for (const id of alpha8Crops) {
  const receipt = receiptItems.find(item => item.id === id);
  if (!receipt) { missing.push(`missing alpha.8 crop lineage receipt -> ${id}`); continue; }
  const source = path.join(root, receipt.source_path ?? '');
  if (!fs.existsSync(source)) missing.push(`alpha.8 crop source image is missing -> ${id} (${receipt.source_path})`);
  else if (sha(source) !== receipt.source_sha256) missing.push(`alpha.8 crop source hash mismatch -> ${id}`);
  if (receipt.output_path !== itemMap.get(id)) missing.push(`alpha.8 crop receipt output path differs from unique map -> ${id}`);
  if (!fs.existsSync(path.join(root, 'public', receipt.output_path.replace(/^\//, '')))) missing.push(`alpha.8 cropped item image missing -> ${id}`);
}
const alpha13Crops = ['brokenSealRing', 'canalKnife', 'caravanCompass', 'championRibbon', 'duelistCape', 'firstWitnessLens', 'quietBell', 'sailorsKnife', 'stormKnot', 'stormglassBow'];
for (const id of alpha13Crops) {
  const receipts = receiptItems.filter(item => item.id === id);
  if (receipts.length !== 1) { missing.push(`expected one alpha.13 crop lineage receipt -> ${id}, found ${receipts.length}`); continue; }
  const receipt = receipts[0];
  const source = path.join(root, receipt.source_path ?? '');
  const output = path.join(root, 'public', String(receipt.output_path ?? '').replace(/^\//, ''));
  if (!receipt.source_path || !fs.existsSync(source)) missing.push(`alpha.13 crop source is missing -> ${id} (${receipt.source_path})`);
  else if (sha(source) !== receipt.source_sha256) missing.push(`alpha.13 crop source hash mismatch -> ${id}`);
  if (receipt.output_path !== itemMap.get(id)) missing.push(`alpha.13 crop receipt output path differs from unique map -> ${id}`);
  if (!fs.existsSync(output)) missing.push(`alpha.13 cropped item image missing -> ${id}`);
  else {
    if (fs.statSync(output).size < 1000) missing.push(`alpha.13 cropped item image unexpectedly small -> ${id}`);
    if (!receipt.output_sha256 || sha(output) !== receipt.output_sha256) missing.push(`alpha.13 output SHA-256 mismatch -> ${id}`);
    if (receipt.output_bytes !== fs.statSync(output).size) missing.push(`alpha.13 output byte-count mismatch -> ${id}`);
  }
  if (receipt.size_px !== '512x512' || receipt.format !== 'WEBP') missing.push(`alpha.13 crop metadata should be 512x512 WEBP -> ${id}`);
}

const alpha16ConceptCrops = [
  { id: 'streetMap', filename: 'concept03_item_22_kuldetesterkep.webp', conceptId: 'concept03-item-022' },
  { id: 'guildPermit', filename: 'concept03_item_21_cehokmany.webp', conceptId: 'concept03-item-021' },
  { id: 'tradeSilk', filename: 'concept03_item_29_finom_szovet.webp', conceptId: 'concept03-item-029' },
  { id: 'guildMeal', filename: 'concept03_item_32_sajt_es_kenyer.webp', conceptId: 'concept03-item-032' },
  { id: 'sailcloth', filename: 'concept03_item_35_vitorlavaszon.webp', conceptId: 'concept03-item-035' },
];
for (const entry of alpha16ConceptCrops) {
  const receipts = receiptItems.filter(item => item.id === entry.id);
  if (receipts.length !== 1) { missing.push(`expected one alpha.16 concept receipt -> ${entry.id}, found ${receipts.length}`); continue; }
  const receipt = receipts[0];
  const source = path.join(root, receipt.source_path ?? '');
  const output = path.join(root, 'public', String(receipt.output_path ?? '').replace(/^\//, ''));
  if (!receipt.source_path || !fs.existsSync(source)) missing.push(`alpha.16 concept source missing -> ${entry.id} (${receipt.source_path})`);
  else if (sha(source) !== receipt.source_sha256) missing.push(`alpha.16 concept source SHA-256 mismatch -> ${entry.id}`);
  if (receipt.concept_pack_asset_id !== entry.conceptId) missing.push(`alpha.16 concept pack ID mismatch -> ${entry.id}`);
  if (receipt.output_path !== itemMap.get(entry.id)) missing.push(`alpha.16 receipt output path differs from unique item map -> ${entry.id}`);
  if (familyMap.has(entry.id)) missing.push(`alpha.16 unique item still has a family fallback entry -> ${entry.id}`);
  if (!fs.existsSync(output)) missing.push(`alpha.16 unique item output missing -> ${entry.id}`);
  else {
    if (fs.statSync(output).size < 1000) missing.push(`alpha.16 unique item output unexpectedly small -> ${entry.id}`);
    if (!receipt.output_sha256 || sha(output) !== receipt.output_sha256) missing.push(`alpha.16 output SHA-256 mismatch -> ${entry.id}`);
    if (receipt.output_bytes !== fs.statSync(output).size) missing.push(`alpha.16 output byte-count mismatch -> ${entry.id}`);
  }
  if (receipt.size_px !== '512x512' || receipt.format !== 'WEBP') missing.push(`alpha.16 concept metadata should be 512x512 WEBP -> ${entry.id}`);
}

const alpha17ConceptCrops = [
  { id: 'sealedLedger', filename: 'item_concept_11_sealed_dossier.png', conceptId: 'concept01_item_11', sourceSha: 'a8b301c1a96dcc9063277ef4fa2d792df412557cb71d77d3e482fc62e6b4ead1' },
];
for (const entry of alpha17ConceptCrops) {
  const receipts = receiptItems.filter(item => item.id === entry.id);
  if (receipts.length !== 1) { missing.push(`expected one alpha.17 concept receipt -> ${entry.id}, found ${receipts.length}`); continue; }
  const receipt = receipts[0];
  const source = path.join(root, receipt.source_path ?? '');
  const output = path.join(root, 'public', String(receipt.output_path ?? '').replace(/^\//, ''));
  if (!receipt.source_path || !fs.existsSync(source)) missing.push(`alpha.17 concept source missing -> ${entry.id} (${receipt.source_path})`);
  else if (sha(source) !== entry.sourceSha || sha(source) !== receipt.source_sha256) missing.push(`alpha.17 concept source SHA-256 mismatch -> ${entry.id}`);
  if (!source.endsWith(entry.filename)) missing.push(`alpha.17 source filename mismatch -> ${entry.id}`);
  if (receipt.concept_pack_asset_id !== entry.conceptId) missing.push(`alpha.17 concept pack ID mismatch -> ${entry.id}`);
  if (receipt.output_path !== itemMap.get(entry.id)) missing.push(`alpha.17 receipt output path differs from unique item map -> ${entry.id}`);
  if (familyMap.has(entry.id)) missing.push(`alpha.17 unique item still has a family fallback entry -> ${entry.id}`);
  if (!fs.existsSync(output)) missing.push(`alpha.17 unique item output missing -> ${entry.id}`);
  else {
    if (fs.statSync(output).size < 1000) missing.push(`alpha.17 unique item output unexpectedly small -> ${entry.id}`);
    if (!receipt.output_sha256 || sha(output) !== receipt.output_sha256) missing.push(`alpha.17 output SHA-256 mismatch -> ${entry.id}`);
    if (receipt.output_bytes !== fs.statSync(output).size) missing.push(`alpha.17 output byte-count mismatch -> ${entry.id}`);
    try {
      const header = fs.readFileSync(output).subarray(0, 12).toString('ascii');
      if (!header.startsWith('RIFF') || !header.includes('WEBP')) missing.push(`alpha.17 output is not a WebP -> ${entry.id}`);
    } catch { missing.push(`alpha.17 output format could not be read -> ${entry.id}`); }
  }
  if (receipt.size_px !== '512x512' || receipt.format !== 'WEBP') missing.push(`alpha.17 concept metadata should be 512x512 WEBP -> ${entry.id}`);
}
const alpha18CorrectedCrops = [
  { id: 'courierRunners', crop: [314, 930, 607, 1223] },
  { id: 'royalRapier', crop: [620, 926, 922, 1228] },
  { id: 'harborAegis', crop: [928, 926, 1242, 1240] },
];
for (const entry of alpha18CorrectedCrops) {
  const matches = receiptItems.filter(item => item.id === entry.id);
  if (matches.length !== 1) { missing.push(`expected one alpha.18 corrected-crop receipt -> ${entry.id}, found ${matches.length}`); continue; }
  const receipt = matches[0];
  const source = path.join(root, receipt.source_path ?? '');
  const output = path.join(root, 'public', String(receipt.output_path ?? '').replace(/^\//, ''));
  if (!fs.existsSync(source)) missing.push(`alpha.18 preserved crop source missing -> ${entry.id}`);
  else if (sha(source) !== receipt.source_sha256) missing.push(`alpha.18 source hash mismatch -> ${entry.id}`);
  if (JSON.stringify(receipt.manual_crop_px) !== JSON.stringify(entry.crop)) missing.push(`alpha.18 crop coordinates mismatch -> ${entry.id}`);
  if (receipt.output_path !== itemMap.get(entry.id)) missing.push(`alpha.18 corrected-crop path differs from item map -> ${entry.id}`);
  if (!fs.existsSync(output)) missing.push(`alpha.18 corrected output missing -> ${entry.id}`);
  else {
    if (!receipt.output_sha256 || sha(output) !== receipt.output_sha256) missing.push(`alpha.18 corrected output SHA mismatch -> ${entry.id}`);
    if (receipt.output_bytes !== fs.statSync(output).size) missing.push(`alpha.18 corrected output bytes mismatch -> ${entry.id}`);
    try {
      const header = fs.readFileSync(output).subarray(0, 12).toString('ascii');
      if (!header.startsWith('RIFF') || !header.includes('WEBP')) missing.push(`alpha.18 corrected output is not a WebP -> ${entry.id}`);
    } catch { missing.push(`alpha.18 corrected output could not be read -> ${entry.id}`); }
  }
  if (receipt.size_px !== '512x512' || receipt.format !== 'WEBP') missing.push(`alpha.18 corrected output metadata invalid -> ${entry.id}`);
}

if (familyMap.get('heartyStew') !== 'sailorsStew') missing.push('heartyStew fallback should use the existing closer-match sailorsStew illustration');
if (familyMap.get('stormSalt') !== 'blackSalt') missing.push('stormSalt fallback should use the existing closer-match blackSalt illustration');

if (new Set(receiptItems.map(item => item.id)).size !== receiptItems.length) missing.push('crop receipts contain duplicate item IDs');
if (familyMap.size !== 23) missing.push(`expected 23 explicit item-family fallbacks after alpha.18 audit, found ${familyMap.size}`);
for (const [id, artKey] of familyMap) {
  if (itemMap.has(id)) missing.push(`item has both unique and family-fallback art -> ${id}`);
  if (!catalogIds.has(id)) missing.push(`item-family fallback references unknown authored item ID -> ${id}`);
  const fallbackPath = itemMap.get(artKey);
  if (!fallbackPath) missing.push(`item-family fallback references unknown unique art key -> ${id} => ${artKey}`);
  else {
    const file = path.join(root, 'public', fallbackPath.replace(/^\//, ''));
    if (!fs.existsSync(file)) missing.push(`item-family fallback source missing -> ${id} => ${artKey} (${fallbackPath})`);
    else if (fs.statSync(file).size < 1000) missing.push(`item-family fallback source unexpectedly small -> ${id} => ${artKey}`);
  }
}
if (categoryMap.size !== 12) missing.push(`expected 12 semantic item-category fallbacks, found ${categoryMap.size}`);
for (const [category, artKey] of categoryMap) {
  const fallbackPath = itemMap.get(artKey);
  if (!fallbackPath) missing.push(`item category fallback references unknown unique art key -> ${category} => ${artKey}`);
  else {
    const file = path.join(root, 'public', fallbackPath.replace(/^\//, ''));
    if (!fs.existsSync(file)) missing.push(`item category fallback source missing -> ${category} => ${artKey} (${fallbackPath})`);
    else if (fs.statSync(file).size < 1000) missing.push(`item category fallback source unexpectedly small -> ${category} => ${artKey}`);
  }
}

const npcBlock = contentSource.split('export const NPCS: NpcDefinition[] = [')[1]?.split('\n];')[0] ?? '';
const npcRecords = [...npcBlock.matchAll(/\{\s*id:\s*"([A-Za-z0-9]+)"([^\n]*)/g)].map(m => ({ id: m[1], line: m[2] }));
const npcIds = new Set(npcRecords.map(n => n.id));
const directAvatarPaths = new Set();
for (const npc of npcRecords) {
  const avatar = npc.line.match(/avatarSrc:\s*"(\/assets\/[^"]+)"/);
  if (avatar) {
    directAvatarPaths.add(avatar[1]);
    const file = path.join(root, 'public', avatar[1].replace(/^\//, ''));
    if (!fs.existsSync(file)) missing.push(`NPC avatarSrc asset missing -> ${npc.id} (${avatar[1]})`);
    else if (fs.statSync(file).size < 1000) missing.push(`NPC avatarSrc asset unexpectedly small -> ${npc.id} (${avatar[1]})`);
  }
}
for (const id of npcMap.keys()) if (!npcIds.has(id)) missing.push(`NPC portrait map references unknown NPC ID -> ${id}`);
for (const [id, url] of npcMap) {
  const file = path.join(root, 'public', url.replace(/^\//, ''));
  if (!fs.existsSync(file)) missing.push(`NPC portrait missing -> ${id} (${url})`);
  else if (fs.statSync(file).size < 1000) missing.push(`NPC portrait unexpectedly small -> ${id} (${url})`);
}
if (npcMap.size !== 64) missing.push(`expected 64 unique NPC portrait mappings, found ${npcMap.size}`);
if (new Set(npcMap.values()).size !== npcMap.size) missing.push('NPC_PORTRAIT_ART has duplicate file paths');
const npcHashes = [...npcMap.values()].map((url) => sha(path.join(root, 'public', url.replace(/^\//, ''))));
if (new Set(npcHashes).size !== npcHashes.length) missing.push('NPC portrait crops contain byte-identical files');
const npcWithoutVisual = npcRecords.filter(n => !npcMap.has(n.id) && !/avatarSrc:\s*"\/assets\/(?:npc-[^"]+|avatar-[^"]+)"/.test(n.line));
if (npcWithoutVisual.length) missing.push(`NPCs with neither custom mapping nor existing avatarSrc: ${npcWithoutVisual.map(x=>x.id).join(', ')}`);

const districtBlock = contentSource.split('export const REGION_DISTRICTS: RegionDistrict[] = [')[1]?.split('\n];')[0] ?? '';
const districtIds = new Set([...districtBlock.matchAll(/\bid:\s*"([A-Za-z0-9]+)"/g)].map(m => m[1]));
if (districtIds.size !== 28) missing.push(`expected 28 unique source district IDs, found ${districtIds.size}`);
for (const id of districtIds) {
  if (!districtMap.has(id)) missing.push(`district has no ID-based visual mapping -> ${id}`);
  const url = districtMap.get(id);
  if (url) {
    const file = path.join(root, 'public', url.replace(/^\//, ''));
    if (!fs.existsSync(file)) missing.push(`district art missing -> ${id} (${url})`);
    else if (fs.statSync(file).size < 1000) missing.push(`district art unexpectedly small -> ${id} (${url})`);
  }
}
if (districtMap.size !== 28) missing.push(`expected 28 district artwork mappings, found ${districtMap.size}`);

const originalsDir = path.join(root, 'docs', 'artwork-sources', 'original-concepts');
const originals = fs.existsSync(originalsDir) ? fs.readdirSync(originalsDir).filter(x => x.endsWith('.png')) : [];
if (originals.length !== 9) missing.push(`expected 9 preserved concept boards, found ${originals.length}`);
const legacyDir = path.join(root, 'docs', 'artwork-sources', 'legacy-ui-panels-review', 'world');
const archivedLegacy = fs.existsSync(legacyDir) ? fs.readdirSync(legacyDir).filter(x => x.endsWith('.webp')) : [];
if (archivedLegacy.length !== 19) missing.push(`expected 19 archived pre-integration world images, found ${archivedLegacy.length}`);

if (missing.length) {
  console.error('Visual asset smoke test: FAIL');
  for (const line of missing) console.error(` - ${line}`);
  process.exitCode = 1;
} else {
  console.log('Visual asset smoke test: PASS');
  console.log(`Validated ${requiredCrops.length} clean world paintings, ${itemMap.size} unique item-ID artworks, ${familyMap.size} item-specific family fallbacks, ${categoryMap.size} semantic category fallbacks, ${npcMap.size} explicit NPC portrait mappings, ${directAvatarPaths.size} distinct directly-authored NPC avatarSrc assets, ${npcRecords.length} NPC records, ${districtMap.size} district artwork mappings, ${originals.length} preserved concept boards and ${archivedLegacy.length} archived legacy world files.`);
}
