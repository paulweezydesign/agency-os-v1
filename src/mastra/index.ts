import { Mastra } from "@mastra/core";
import { MongoDBStore, MongoDBVector } from "@mastra/mongodb";
import { env } from "@/lib/env";
import {
  contentAgent,
  designerAgent,
  engineerAgent,
  opsAgent,
  pmAgent,
  qaAgent,
  salesAgent,
  strategistAgent,
} from "./agents";
import { leadToProjectWorkflow } from "./workflows";

const mongoConfig = {
  id: "agencyos-mongodb",
  uri: env.mongodbUri,
  dbName: env.mongodbDbName,
};

export const mastra = new Mastra({
  storage: new MongoDBStore(mongoConfig),
  vectors: {
    agencyMemory: new MongoDBVector({ ...mongoConfig, id: "agencyos-vector" }),
  },
  agents: {
    salesAgent,
    strategistAgent,
    pmAgent,
    designerAgent,
    engineerAgent,
    qaAgent,
    contentAgent,
    opsAgent,
  },
  workflows: {
    leadToProjectWorkflow,
  },
});
