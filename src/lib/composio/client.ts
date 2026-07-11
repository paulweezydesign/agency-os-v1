import { Composio } from "@composio/core";
import { MastraProvider } from "@composio/mastra";

let composioClient: Composio<MastraProvider> | undefined;

export function getComposioClient() {
  if (!process.env.COMPOSIO_API_KEY) {
    throw new Error("Missing COMPOSIO_API_KEY");
  }

  if (!composioClient) {
    composioClient = new Composio({
      apiKey: process.env.COMPOSIO_API_KEY,
      provider: new MastraProvider({ strict: true }),
    });
  }

  return composioClient;
}
