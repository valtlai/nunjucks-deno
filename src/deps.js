export * as path from "https://deno.land/std@0.183.0/path/mod.ts";
export { EventEmitter } from "node:events";

export function existsSync(p) {
  try {
    Deno.statSync(p);
    return true;
  } catch {
    return false;
  }
}
