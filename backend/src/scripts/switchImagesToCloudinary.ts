import fs from 'fs';
import path from 'path';

import { connectDatabase } from '../config/database';
import { config } from '../config/env';
import { Complement } from '../models/Complement';
import { Food } from '../models/Food';
import { Supplement } from '../models/Supplement';

type ImageMap = {
  supplements?: Record<string, string[]>;
  complements?: Record<string, string[]>;
  foods?: Record<string, string>;
};

const sourceFileArg = process.argv[2] || 'data/image-map.json';
const sourceMapPath = path.resolve(__dirname, '../../', sourceFileArg);
const cloudMapPath = path.resolve(__dirname, '../../data/image-map.cloudinary.json');

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
const baseFolder = (process.env.CLOUDINARY_BASE_FOLDER || '').replace(/^\/+|\/+$/g, '');
const foodsFolder = (process.env.CLOUDINARY_FOODS_FOLDER || 'foods').replace(/^\/+|\/+$/g, '');
const supplementsFolder = (process.env.CLOUDINARY_SUPPLEMENTS_FOLDER || 'supplements').replace(/^\/+|\/+$/g, '');
const complementsFolder = (process.env.CLOUDINARY_COMPLEMENTS_FOLDER || 'complements').replace(/^\/+|\/+$/g, '');

const ensureCloudName = (): void => {
  if (!cloudName) {
    throw new Error('CLOUDINARY_CLOUD_NAME is required in backend/.env to switch image paths to Cloudinary URLs.');
  }
};

const parseMapFile = (): ImageMap => {
  if (!fs.existsSync(sourceMapPath)) {
    throw new Error(`Source image map not found: ${sourceMapPath}`);
  }
  return JSON.parse(fs.readFileSync(sourceMapPath, 'utf8')) as ImageMap;
};

const stripExtension = (value: string): string => value.replace(/\.(jpg|jpeg|png|webp)$/i, '');

const categoryFolder = (category: 'foods' | 'supplements' | 'complements'): string => {
  if (category === 'foods') {
    return foodsFolder;
  }
  if (category === 'supplements') {
    return supplementsFolder;
  }
  return complementsFolder;
};

const toCloudinaryUrl = (category: 'foods' | 'supplements' | 'complements', value: string): string => {
  const normalized = value.replace(/^\/+/, '');
  const filename = normalized.split('/').pop() || normalized;
  const publicId = stripExtension(filename);
  const prefix = baseFolder ? `${baseFolder}/` : '';
  return `https://res.cloudinary.com/${cloudName}/image/upload/${prefix}${categoryFolder(category)}/${publicId}`;
};

const buildCloudinaryMap = (map: ImageMap): ImageMap => {
  const supplements: Record<string, string[]> = {};
  const complements: Record<string, string[]> = {};
  const foods: Record<string, string> = {};

  for (const [slug, images] of Object.entries(map.supplements || {})) {
    if (!Array.isArray(images) || images.length === 0) {
      continue;
    }
    supplements[slug] = images.map((imagePath) => toCloudinaryUrl('supplements', imagePath));
  }

  for (const [slug, images] of Object.entries(map.complements || {})) {
    if (!Array.isArray(images) || images.length === 0) {
      continue;
    }
    complements[slug] = images.map((imagePath) => toCloudinaryUrl('complements', imagePath));
  }

  for (const [slug, imagePath] of Object.entries(map.foods || {})) {
    if (!imagePath) {
      continue;
    }
    foods[slug] = toCloudinaryUrl('foods', imagePath);
  }

  return { supplements, complements, foods };
};

const applySupplementImages = async (entries: Record<string, string[]> = {}): Promise<number> => {
  let updated = 0;
  for (const [slug, images] of Object.entries(entries)) {
    const result = await Supplement.updateOne({ slug }, { $set: { images } });
    if (result.matchedCount > 0) {
      updated += 1;
    }
  }
  return updated;
};

const applyComplementImages = async (entries: Record<string, string[]> = {}): Promise<number> => {
  let updated = 0;
  for (const [slug, images] of Object.entries(entries)) {
    const result = await Complement.updateOne({ slug }, { $set: { images } });
    if (result.matchedCount > 0) {
      updated += 1;
    }
  }
  return updated;
};

const applyFoodImages = async (entries: Record<string, string> = {}): Promise<number> => {
  let updated = 0;
  for (const [slug, image] of Object.entries(entries)) {
    const result = await Food.updateOne({ slug }, { $set: { image } });
    if (result.matchedCount > 0) {
      updated += 1;
    }
  }
  return updated;
};

const run = async (): Promise<void> => {
  try {
    ensureCloudName();
    const map = parseMapFile();
    const cloudMap = buildCloudinaryMap(map);

    fs.writeFileSync(cloudMapPath, `${JSON.stringify(cloudMap, null, 2)}\n`);

    await connectDatabase();

    const supplementUpdates = await applySupplementImages(cloudMap.supplements);
    const complementUpdates = await applyComplementImages(cloudMap.complements);
    const foodUpdates = await applyFoodImages(cloudMap.foods);

    console.log(`Cloudinary map written: ${cloudMapPath}`);
    console.log(`Supplements updated: ${supplementUpdates}`);
    console.log(`Complements updated: ${complementUpdates}`);
    console.log(`Foods updated: ${foodUpdates}`);
    console.log('Switched image URLs to Cloudinary successfully.');

    process.exit(0);
  } catch (error) {
    console.error('Failed to switch image URLs to Cloudinary:', error);
    process.exit(1);
  }
};

void run();
