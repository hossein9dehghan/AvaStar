/** Deterministic ZIP export, generated during build so binaries stay out of source history. */
import { readFileSync, readdirSync, statSync, mkdirSync, writeFileSync, renameSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { relative, join } from 'node:path';
import { deflateRawSync } from 'node:zlib';
const root = fileURLToPath(new URL('../', import.meta.url));
const excluded = new Set([
  'node_modules',
  '.next',
  '.git',
  'dist',
  '.vercel',
  '__pycache__',
  '.sites-runtime',
]);
const files = [];
function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    if (excluded.has(entry.name)) continue;
    const path = join(directory, entry.name),
      name = relative(root, path).replaceAll('\\', '/');
    if (entry.isDirectory()) {
      if (!/^apps\/[^/]+\/public$/.test(name)) walk(path);
      continue;
    }
    if (
      !entry.isFile() ||
      /\.(zip|tsbuildinfo|log|tmp)$/.test(name) ||
      entry.name === 'next-env.d.ts' ||
      (entry.name.startsWith('.env') && entry.name !== '.env.example')
    )
      continue;
    files.push([name, readFileSync(path)]);
  }
}
for (const folder of ['apps', 'packages', 'scripts', 'docs', 'database', 'tests'])
  walk(join(root, folder));
for (const name of [
  'README.md',
  'package.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  '.gitignore',
  '.prettierrc.json',
  '.prettierignore',
])
  files.push([name, readFileSync(join(root, name))]);
const crcTable = Array.from({ length: 256 }, (_, n) => {
  for (let i = 0; i < 8; i++) n = n & 1 ? 0xedb88320 ^ (n >>> 1) : n >>> 1;
  return n >>> 0;
});
function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = crcTable[(crc ^ byte) & 255] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
const local = [],
  central = [];
let offset = 0;
for (const [name, bytes] of files) {
  const filename = Buffer.from(name),
    compressed = deflateRawSync(bytes),
    crc = crc32(bytes),
    header = Buffer.alloc(30),
    directory = Buffer.alloc(46);
  header.writeUInt32LE(0x04034b50);
  header.writeUInt16LE(20, 4);
  header.writeUInt16LE(0x800, 6);
  header.writeUInt16LE(8, 8);
  header.writeUInt16LE(0x5821, 12);
  header.writeUInt32LE(crc, 14);
  header.writeUInt32LE(compressed.length, 18);
  header.writeUInt32LE(bytes.length, 22);
  header.writeUInt16LE(filename.length, 26);
  directory.writeUInt32LE(0x02014b50);
  directory.writeUInt16LE(20, 4);
  directory.writeUInt16LE(20, 6);
  directory.writeUInt16LE(0x800, 8);
  directory.writeUInt16LE(8, 10);
  directory.writeUInt16LE(0x5821, 14);
  directory.writeUInt32LE(crc, 16);
  directory.writeUInt32LE(compressed.length, 20);
  directory.writeUInt32LE(bytes.length, 24);
  directory.writeUInt16LE(filename.length, 28);
  directory.writeUInt32LE(offset, 42);
  local.push(header, filename, compressed);
  central.push(directory, filename);
  offset += header.length + filename.length + compressed.length;
}
const end = Buffer.alloc(22),
  centralSize = central.reduce((sum, part) => sum + part.length, 0);
end.writeUInt32LE(0x06054b50);
end.writeUInt16LE(files.length, 8);
end.writeUInt16LE(files.length, 10);
end.writeUInt32LE(centralSize, 12);
end.writeUInt32LE(offset, 16);
const output = join(root, 'packages/theme/avastar-design-kit.zip'),
  temporary = `${output}.${process.pid}.tmp`;
mkdirSync(join(root, 'packages/theme'), { recursive: true });
writeFileSync(temporary, Buffer.concat([...local, ...central, end]));
renameSync(temporary, output);
console.log(
  `Design kit generated: ${files.length} source and asset files (${statSync(output).size} bytes).`,
);
