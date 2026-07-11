import { setupMongoIndexes } from "../src/lib/mongodb/indexes";

await setupMongoIndexes();
console.log("MongoDB indexes are ready.");
process.exit(0);
