export class RWDependencyGraph {
  protected pathToWrite: Map<string, Promise<unknown>>;
  protected pathToRead: Map<string, Promise<unknown>>;

  constructor() {
    this.pathToWrite = new Map();
    this.pathToRead = new Map();
  }

  public lock = async (path: string, type: "read" | "write"): Promise<() => void> => {
    if (type == "read") {
      const lastRead = this.pathToRead.get(path) ?? Promise.resolve();
      const lastWrite = this.pathToWrite.get(path) ?? Promise.resolve();

      let release!: () => void;
      const currentRead = new Promise<void>((r) => {
        release = () => {
          r();
        };
      });

      const read = lastRead.then(() => currentRead); // A subsequent write may not write until all prior reads have completed.

      this.pathToRead.set(path, read);
      read
        .finally(() => {
          if (this.pathToRead.get(path) === read) {
            this.pathToRead.delete(path);
          }
        })
        .catch(console.error);

      await lastWrite;

      return release;
    } else {
      const lastRead = this.pathToRead.get(path) ?? Promise.resolve();
      const lastWrite = this.pathToWrite.get(path) ?? Promise.resolve();

      let release!: () => void;
      const currentWrite = new Promise<void>((r) => {
        release = () => {
          r();
        };
      });

      const write = Promise.all([lastRead, lastWrite]).then(() => currentWrite); // A subsequent write may not write until all prior reads and writes have completed.

      this.pathToWrite.set(path, write);
      write
        .finally(() => {
          if (this.pathToWrite.get(path) === write) {
            this.pathToWrite.delete(path);
          }
        })
        .catch(console.error);

      await Promise.all([lastRead, lastWrite]);

      return release;
    }
  };
}
