import {mkdir, copyFile, readdir, stat} from "node:fs/promises";
import {basename, join} from "node:path/posix";
import {fileURLToPath} from "node:url";

async function recursiveCopy(src: string, dest: string): Promise<void> {
  const st = await stat(src);
  if (st.isDirectory()) {
    await mkdir(dest, {recursive: true});
    for (const entry of await readdir(src)) {
      await recursiveCopy(join(src, entry), join(dest, entry));
    }
  } else {
    await mkdir(join(dest, ".."), {recursive: true});
    await copyFile(src, dest);
  }
}

export async function copySamples(dest = "samples"): Promise<void> {
  const source = join(fileURLToPath(import.meta.url), "..", "..", "samples");
  await recursiveCopy(source, dest);
}
