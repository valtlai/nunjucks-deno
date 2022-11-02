export * as path from "https://deno.land/std@0.161.0/path/mod.ts";
export { default as EventEmitter } from "https://deno.land/x/events@v1.0.0/mod.ts";

export function existsSync(p) {
  try {
    Deno.statSync(p);
    return true;
  } catch {
    return false;
  }
}
