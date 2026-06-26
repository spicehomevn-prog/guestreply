// Bootstrap npm by downloading and extracting it from the registry
const https = require('https');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const DEST = 'E:\\node_modules\\npm';

function downloadUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        return downloadUrl(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function parseTar(buffer, destDir) {
  let offset = 0;
  while (offset < buffer.length - 512) {
    const header = buffer.slice(offset, offset + 512);
    const name = header.slice(0, 100).toString().replace(/\0/g, '');
    if (!name) break;
    const sizeStr = header.slice(124, 136).toString().replace(/\0/g, '').trim();
    const size = parseInt(sizeStr, 8) || 0;
    const type = header[156];
    const paddedSize = Math.ceil(size / 512) * 512;
    // Strip leading "package/" prefix
    const relName = name.replace(/^package\//, '');
    const fullPath = path.join(destDir, relName);
    if (type === 48 || type === 0 || type === undefined) { // regular file
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      if (size > 0) fs.writeFileSync(fullPath, buffer.slice(offset + 512, offset + 512 + size));
    } else if (type === 53) { // directory
      fs.mkdirSync(fullPath, { recursive: true });
    }
    offset += 512 + paddedSize;
  }
}

async function main() {
  console.log('Fetching npm package info...');
  const metaBuf = await downloadUrl('https://registry.npmjs.org/npm/10.9.2');
  const meta = JSON.parse(metaBuf.toString());
  const tarUrl = meta.dist.tarball;
  console.log('Downloading', tarUrl, '...');
  const tgz = await downloadUrl(tarUrl);
  console.log('Downloaded', tgz.length, 'bytes, extracting...');
  fs.mkdirSync(DEST, { recursive: true });
  const tar = zlib.gunzipSync(tgz);
  parseTar(tar, DEST);
  console.log('npm extracted to', DEST);
}

main().catch(e => { console.error(e); process.exit(1); });
