import { once } from "node:events";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Client, LockManager } from "@far-analytics/persistence";

const manager = new LockManager();
const client = new Client({ manager });

const directory = await mkdtemp(join(tmpdir(), "persistence-manual-tests-"));
const file = join(directory, "example.json");

try {
  await client.write(file, "Hello, World!");

  const writeStream = await client.createWriteStream(file);
  writeStream.write(JSON.stringify({ message: "Streaming Hello, World!" }) + `\n`);
  writeStream.end();
  await once(writeStream, "finish");

  const collection = await client.collect(directory);
  console.log(collection);

  const id = await manager.acquireAll([join(directory, "a", "b"), join(directory, "a")]);
  console.log("A");
  manager.release(id);
  console.log("B");
} finally {
  await rm(directory, { recursive: true, force: true });
}
