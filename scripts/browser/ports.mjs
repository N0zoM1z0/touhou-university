import { createServer } from "node:net";

function portNumber(value) {
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error(`Invalid browser-tool port: ${value}`);
  return port;
}

async function freePort(excluded) {
  while (true) {
    const server = createServer();
    await new Promise((resolve, reject) => {
      server.once("error", reject);
      server.listen(0, "127.0.0.1", resolve);
    });
    const port = server.address().port;
    await new Promise((resolve) => server.close(resolve));
    if (!excluded.includes(port)) return port;
  }
}

export async function browserPorts(siteOverride, debugOverride) {
  const sitePort = siteOverride ? portNumber(siteOverride) : await freePort([]);
  const debugPort = debugOverride ? portNumber(debugOverride) : await freePort([sitePort]);
  if (sitePort === debugPort) throw new Error("Site and Chrome debugger must use different ports");
  return { sitePort, debugPort };
}
