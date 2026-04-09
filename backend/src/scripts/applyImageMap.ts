import fs from 'fs';
import path from 'path';

import { connectDatabase } from '../config/database';
import { Complement } from '../models/Complement';
import { Food } from '../models/Food';
import { Supplement } from '../models/Supplement';

type ImageMap = {
  supplements?: Record<string, string[]>;
  complements?: Record<string, string[]>;
  foods?: Record<string, string>;
};

const fileArg = process.argv[2] || 'data/image-map.json';
const mapPath = path.resolve(__dirname, '../../', fileArg);

const parseMapFile = (): ImageMap => {
  if (!fs.existsSync(mapPath)) {
    throw new Error(
      `Image map file not found: ${mapPath}. Start from backend/data/image-map.example.json`,
    );
  }

  const content = fs.readFileSync(mapPath, 'utf8');
  return JSON.parse(content) as ImageMap;
};

const applySupplementImages = async (
  entries: Record<string, string[]> = {},
): Promise<number> => {
  let updated = 0;

  for (const [slug, images] of Object.entries(entries)) {
    if (!Array.isArray(images) || images.length === 0) {
      continue;
    }

    const result = await Supplement.updateOne({ slug }, { $set: { images } });
    if (result.matchedCount > 0) {
      updated += 1;
    }
  }

  return updated;
};

const applyComplementImages = async (
  entries: Record<string, string[]> = {},
): Promise<number> => {
  let updated = 0;

  for (const [slug, images] of Object.entries(entries)) {
    if (!Array.isArray(images) || images.length === 0) {
      continue;
    }

    const result = await Complement.updateOne({ slug }, { $set: { images } });
    if (result.matchedCount > 0) {
      updated += 1;
    }
  }

  return updated;
};

const applyFoodImages = async (
  entries: Record<string, string> = {},
): Promise<number> => {
  let updated = 0;

  for (const [slug, image] of Object.entries(entries)) {
    if (!image) {
      continue;
    }

    const result = await Food.updateOne({ slug }, { $set: { image } });
    if (result.matchedCount > 0) {
      updated += 1;
    }
  }

  return updated;
};

const run = async (): Promise<void> => {
  try {
    const imageMap = parseMapFile();
    await connectDatabase();

    const supplementUpdates = await applySupplementImages(imageMap.supplements);
    const complementUpdates = await applyComplementImages(imageMap.complements);
    const foodUpdates = await applyFoodImages(imageMap.foods);

    console.log(`Supplements updated: ${supplementUpdates}`);
    console.log(`Complements updated: ${complementUpdates}`);
    console.log(`Foods updated: ${foodUpdates}`);
    console.log('Image mapping completed.');

    process.exit(0);
  } catch (error) {
    console.error('Failed to apply image map:', error);
    process.exit(1);
  }
};

void run();
