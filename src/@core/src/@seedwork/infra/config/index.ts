import { config as readEnv } from "dotenv";
import { join } from "path";

function makeConfig(envFile) {
  const output = readEnv({ path: envFile });

  return {
    db: {
      connection: output.parsed.DB_CONNECTION as any,
      host: output.parsed.DB_HOST,
      logging: output.parsed.DB_LOGGING === "true",
    },
  };
}

const envTestingFile = join(__dirname, "../../../../.env.test");
export const configTest = makeConfig(envTestingFile);
