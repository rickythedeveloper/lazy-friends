import { execSync } from "child_process";
import { DbClient, type DbConfig } from "../db/dbService.ts";

export interface TestDbConfig {
  port: number;
  projectName: string;
}

export function startTestDbAndGetDbClient(): {
  client: DbClient;
  config: TestDbConfig;
} {
  const dbPort = Math.floor(Math.random() * 10000) + 20000;
  const projectName = `test-db-${Date.now().toString()}-${dbPort.toString()}`;

  console.log("Starting db in port", dbPort);
  startTestDb({ port: dbPort, projectName });

  const dbConfig: DbConfig = {
    database: "postgres",
    port: dbPort,
    password: "postgres",
    user: "postgres",
  };
  return {
    client: new DbClient(dbConfig),
    config: {
      port: dbPort,
      projectName,
    },
  };
}

function startTestDb(config: TestDbConfig) {
  execSync(
    `${getDockerComposeBase(config)} up -d --remove-orphans db && ${getDockerComposeBase(config)} run migrate`,
  );
}

export function tearDownTestDb(config: TestDbConfig) {
  execSync(`${getDockerComposeBase(config)} down db --remove-orphans`);
}

function getDockerComposeBase({ port, projectName }: TestDbConfig): string {
  return `DB_PORT=${port.toString()} docker compose -f ../db/docker-compose.yml -p ${projectName}`;
}
