import { connectDatabase } from "../config/database";
import {
  complementCatalog,
  foodCatalog,
  supplementCatalog,
} from "../data/catalog/catalogData";
import { Complement } from "../models/Complement";
import { Food } from "../models/Food";
import { Supplement } from "../models/Supplement";

const upsertSupplements = async (): Promise<void> => {
  await Promise.all(
    supplementCatalog.map((item) =>
      Supplement.findOneAndUpdate(
        { slug: item.slug },
        { $set: item },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      ).exec(),
    ),
  );
};

const upsertComplements = async (): Promise<void> => {
  await Promise.all(
    complementCatalog.map((item) =>
      Complement.findOneAndUpdate(
        { slug: item.slug },
        { $set: item },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      ).exec(),
    ),
  );
};

const upsertFoods = async (): Promise<void> => {
  await Promise.all(
    foodCatalog.map((item) =>
      Food.findOneAndUpdate(
        { slug: item.slug },
        { $set: item },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      ).exec(),
    ),
  );
};

export const upsertCatalogCollections = async (): Promise<void> => {
  await upsertSupplements();
  await upsertComplements();
  await upsertFoods();
};

const run = async (): Promise<void> => {
  try {
    await connectDatabase();

    await upsertCatalogCollections();

    console.log("Catalog upsert completed successfully.");
    console.log(
      `Supplements: ${supplementCatalog.length}, Complements: ${complementCatalog.length}, Foods: ${foodCatalog.length}`,
    );

    process.exit(0);
  } catch (error) {
    console.error("Catalog upsert failed:", error);
    process.exit(1);
  }
};

void run();
