import { Request, Response } from "express";
import { FilterQuery, Model, isValidObjectId } from "mongoose";
import slugify from "slugify";

import { ApiError } from "./ApiError";
import { catchAsync } from "./catchAsync";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface QueryParams {
  page?: string;
  limit?: string;
  sort?: string;
  search?: string;
}

const buildFilters = <T>(query: Request["query"]): FilterQuery<T> => {
  const filters: Record<string, unknown> = {};
  const excludedKeys = new Set(["page", "limit", "sort", "search"]);

  Object.entries(query).forEach(([key, value]) => {
    if (excludedKeys.has(key)) {
      return;
    }

    if (typeof value === "string") {
      if (value.includes(",")) {
        filters[key] = { $in: value.split(",").map((item) => item.trim()) };
      } else {
        filters[key] = value;
      }
      return;
    }

    if (Array.isArray(value)) {
      filters[key] = { $in: value };
    }
  });

  return filters as FilterQuery<T>;
};

const getPagination = (query: QueryParams): { page: number; limit: number } => {
  const page = Math.max(1, Number.parseInt(query.page ?? "1", 10));
  const limit = Math.min(
    100,
    Math.max(1, Number.parseInt(query.limit ?? "20", 10)),
  );
  return { page, limit };
};

const buildSort = (sort?: string): string => {
  if (!sort) {
    return "-createdAt";
  }
  return sort.split(",").join(" ");
};

const normalizePayloadWithSlug = <T>(payload: Partial<T>): Partial<T> => {
  const payloadWithName = payload as Partial<T> & { name?: string };

  if (
    typeof payloadWithName.name === "string" &&
    payloadWithName.name.trim().length > 0
  ) {
    return {
      ...payload,
      slug: slugify(payloadWithName.name, {
        lower: true,
        strict: true,
        trim: true,
      }),
    } as Partial<T>;
  }

  return payload;
};

const resolveFindByIdOrSlug = async <T>(
  ModelClass: Model<T>,
  idOrSlug: string,
): Promise<T | null> => {
  if (isValidObjectId(idOrSlug)) {
    return ModelClass.findById(idOrSlug).exec();
  }
  return ModelClass.findOne({ slug: idOrSlug } as FilterQuery<T>).exec();
};

const resolveFindOneAndUpdate = async <T>(
  ModelClass: Model<T>,
  idOrSlug: string,
  payload: Partial<T>,
): Promise<T | null> => {
  if (isValidObjectId(idOrSlug)) {
    return ModelClass.findByIdAndUpdate(idOrSlug, payload, {
      new: true,
      runValidators: true,
    }).exec();
  }
  return ModelClass.findOneAndUpdate(
    { slug: idOrSlug } as FilterQuery<T>,
    payload,
    {
      new: true,
      runValidators: true,
    },
  ).exec();
};

const resolveFindOneAndDelete = async <T>(
  ModelClass: Model<T>,
  idOrSlug: string,
): Promise<T | null> => {
  if (isValidObjectId(idOrSlug)) {
    return ModelClass.findByIdAndDelete(idOrSlug).exec();
  }
  return ModelClass.findOneAndDelete({
    slug: idOrSlug,
  } as FilterQuery<T>).exec();
};

/**
 * WHY: Centralizes generic list handling (search, filters, pagination, sorting).
 */
export const getAll = <T>(ModelClass: Model<T>) =>
  catchAsync(async (req: Request, res: Response): Promise<void> => {
    const queryParams = req.query as QueryParams;
    const filters = buildFilters<T>(req.query);

    if (typeof queryParams.search === "string" && queryParams.search.trim()) {
      (filters as Record<string, unknown>).$text = {
        $search: queryParams.search.trim(),
      };
    }

    const { page, limit } = getPagination(queryParams);
    const sort = buildSort(queryParams.sort);
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      ModelClass.find(filters).sort(sort).skip(skip).limit(limit).exec(),
      ModelClass.countDocuments(filters).exec(),
    ]);

    const pagination: PaginationMeta = {
      page,
      limit,
      total,
      pages: Math.max(1, Math.ceil(total / limit)),
    };

    res.status(200).json({
      success: true,
      data,
      pagination,
    });
  });

/**
 * WHY: Retrieves a resource by id or slug with consistent error handling.
 */
export const getOne = <T>(ModelClass: Model<T>) =>
  catchAsync(async (req: Request, res: Response): Promise<void> => {
    const idOrSlug = req.params.id ?? req.params.slug;

    if (!idOrSlug) {
      throw ApiError.badRequest("Missing identifier");
    }

    const document = await resolveFindByIdOrSlug(ModelClass, idOrSlug);
    if (!document) {
      throw ApiError.notFound("Resource not found");
    }

    res.status(200).json({
      success: true,
      data: document,
    });
  });

/**
 * WHY: Standardizes creation responses and error handling.
 */
export const createOne = <T>(ModelClass: Model<T>) =>
  catchAsync(async (req: Request, res: Response): Promise<void> => {
    const document = await ModelClass.create(
      normalizePayloadWithSlug(req.body as Partial<T>),
    );

    res.status(201).json({
      success: true,
      data: document,
    });
  });

/**
 * WHY: Standardizes update responses and error handling.
 */
export const updateOne = <T>(ModelClass: Model<T>) =>
  catchAsync(async (req: Request, res: Response): Promise<void> => {
    const idOrSlug = req.params.id ?? req.params.slug;

    if (!idOrSlug) {
      throw ApiError.badRequest("Missing identifier");
    }

    const document = await resolveFindOneAndUpdate(
      ModelClass,
      idOrSlug,
      normalizePayloadWithSlug(req.body as Partial<T>),
    );
    if (!document) {
      throw ApiError.notFound("Resource not found");
    }

    res.status(200).json({
      success: true,
      data: document,
    });
  });

/**
 * WHY: Standardizes delete responses and error handling.
 */
export const deleteOne = <T>(ModelClass: Model<T>) =>
  catchAsync(async (req: Request, res: Response): Promise<void> => {
    const idOrSlug = req.params.id ?? req.params.slug;

    if (!idOrSlug) {
      throw ApiError.badRequest("Missing identifier");
    }

    const document = await resolveFindOneAndDelete(ModelClass, idOrSlug);
    if (!document) {
      throw ApiError.notFound("Resource not found");
    }

    res.status(204).send();
  });
