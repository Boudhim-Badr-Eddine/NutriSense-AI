import { connectDatabase } from "../config/database";
import { Conversation } from "../models/Conversation";
import { upsertCatalogCollections } from "./upsertCatalogData";

const run = async (): Promise<void> => {
  try {
    await connectDatabase();

    await upsertCatalogCollections();
    await Conversation.deleteMany({}).exec();

    console.log("Full seed completed.");
    process.exit(0);
  } catch (error) {
    console.error("Full seed failed:", error);
    process.exit(1);
  }
};

void run();
