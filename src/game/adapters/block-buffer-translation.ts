import { defaultBlockRegistry, type BlockRegistry } from '../blocks/registry';
import { browserBlockIdToEngineId, engineBlockIdToBrowserId } from './browser-block-ids';

export type BlockArrayTranslation =
  | { readonly ok: true; readonly blocks: Uint16Array }
  | { readonly ok: false; readonly errors: readonly { readonly index: number; readonly blockId: number; readonly direction: 'browser-to-engine' | 'engine-to-browser' }[] };

/**
 * Converts a whole block buffer atomically. If even one block is unsupported,
 * no converted buffer is returned; callers must not partially migrate a chunk.
 */
export function translateBrowserBlockBuffer(
  source: ArrayLike<number>,
  registry: BlockRegistry = defaultBlockRegistry,
): BlockArrayTranslation {
  return translateBlockBuffer(source, id => browserBlockIdToEngineId(id, registry), 'browser-to-engine');
}

/** Reverse conversion has the same all-or-nothing behavior as forward conversion. */
export function translateEngineBlockBufferToBrowser(
  source: ArrayLike<number>,
  registry: BlockRegistry = defaultBlockRegistry,
): BlockArrayTranslation {
  return translateBlockBuffer(source, id => engineBlockIdToBrowserId(id, registry), 'engine-to-browser');
}

function translateBlockBuffer(
  source: ArrayLike<number>,
  translate: (id: number) => number | undefined,
  direction: 'browser-to-engine' | 'engine-to-browser',
): BlockArrayTranslation {
  if (!source || !Number.isSafeInteger(source.length) || source.length < 0 || source.length > 16_777_216) {
    throw new RangeError('Block buffer length must be a safe integer between 0 and 16777216');
  }
  const converted = new Uint16Array(source.length);
  const errors: { index: number; blockId: number; direction: 'browser-to-engine' | 'engine-to-browser' }[] = [];
  for (let index = 0; index < source.length; index += 1) {
    const blockId = source[index];
    if (!Number.isSafeInteger(blockId) || blockId < 0 || blockId > 0xffff) {
      errors.push(Object.freeze({ index, blockId, direction }));
      continue;
    }
    const translated = translate(blockId);
    if (translated === undefined || translated < 0 || translated > 0xffff) {
      errors.push(Object.freeze({ index, blockId, direction }));
      continue;
    }
    converted[index] = translated;
  }
  if (errors.length > 0) return Object.freeze({ ok: false, errors: Object.freeze(errors) });
  return Object.freeze({ ok: true, blocks: converted });
}
