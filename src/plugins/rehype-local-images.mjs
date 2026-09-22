import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { visit } from 'unist-util-visit';

const cache = new Map();
export function rehypeLocalImages() {
  return async tree => {
    const pending = [];
    visit(tree, 'element', node => {
      if (node.tagName !== 'img') return;
      node.properties.loading = 'lazy';
      node.properties.decoding = 'async';
      const src = String(node.properties.src || '');
      if (!src.startsWith('/image/')) return;
      const root = path.resolve('public');
      const file = path.resolve(root, '.' + decodeURI(src));
      if (!file.startsWith(root + path.sep) || !fs.existsSync(file)) throw new Error(`Missing article image: ${src}`);
      if (!cache.has(file)) cache.set(file, sharp(file).metadata());
      pending.push(cache.get(file).then(({ width, height }) => {
        node.properties.width = width;
        node.properties.height = height;
      }));
    });
    await Promise.all(pending);
  };
}
