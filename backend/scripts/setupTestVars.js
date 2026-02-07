const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const envPath = path.join(__dirname, "..", ".env");
dotenv.config({ path: envPath });

const baseUrl = process.env.BASE_URL || "http://localhost:5000";
const mongoUri = process.env.MONGODB_URI;

const userPayload = {
  email: "taha.demo@example.com",
  password: "Password123",
  name: "Taha Demo",
};

const adminPayload = {
  email: "admin.demo@example.com",
  password: "AdminPass123",
  name: "Admin Demo",
  role: "admin",
};

const request = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  if (!text) {
    return { status: response.status, data: null };
  }

  try {
    return { status: response.status, data: JSON.parse(text) };
  } catch (error) {
    return { status: response.status, data: text };
  }
};

const ensureAdminUser = async () => {
  if (!mongoUri) {
    console.warn("MONGODB_URI is missing. Skipping admin user creation.");
    return;
  }

  await mongoose.connect(mongoUri);
  const users = mongoose.connection.collection("users");

  const existing = await users.findOne({ email: adminPayload.email });
  if (existing) {
    await users.updateOne(
      { email: adminPayload.email },
      { $set: { role: "admin" } },
    );
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPayload.password, 12);
  const now = new Date();

  await users.insertOne({
    email: adminPayload.email,
    password: hashedPassword,
    name: adminPayload.name,
    role: "admin",
    favorites: { supplements: [], complements: [], foods: [] },
    createdAt: now,
    updatedAt: now,
  });

  await mongoose.disconnect();
};

const registerIfNeeded = async () => {
  const registerResponse = await request(`${baseUrl}/api/auth/register`, {
    method: "POST",
    body: JSON.stringify(userPayload),
  });

  if (registerResponse.status === 201) {
    return registerResponse.data?.data?.token || "";
  }

  if (registerResponse.status !== 409) {
    console.warn("Register response:", registerResponse);
  }

  return "";
};

const login = async (payload) => {
  const loginResponse = await request(`${baseUrl}/api/auth/login`, {
    method: "POST",
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
    }),
  });

  return loginResponse.data?.data?.token || "";
};

const fetchId = async (endpoint) => {
  const response = await request(`${baseUrl}${endpoint}`);
  return response.data?.data?.[0]?._id || "";
};

const updateTestsFile = ({
  token,
  adminToken,
  supplementId,
  complementId,
  foodId,
}) => {
  const testsPath = path.join(__dirname, "..", "tests.http");
  const content = fs.readFileSync(testsPath, "utf8");

  const updated = content
    .replace(/^@baseUrl\s*=.*$/m, `@baseUrl = ${baseUrl}`)
    .replace(/^@token\s*=.*$/m, `@token = ${token || "REPLACE_WITH_USER_JWT"}`)
    .replace(
      /^@adminToken\s*=.*$/m,
      `@adminToken = ${adminToken || "REPLACE_WITH_ADMIN_JWT"}`,
    )
    .replace(
      /^@supplementId\s*=.*$/m,
      `@supplementId = ${supplementId || "REPLACE_WITH_SUPPLEMENT_ID"}`,
    )
    .replace(
      /^@complementId\s*=.*$/m,
      `@complementId = ${complementId || "REPLACE_WITH_COMPLEMENT_ID"}`,
    )
    .replace(
      /^@foodId\s*=.*$/m,
      `@foodId = ${foodId || "REPLACE_WITH_FOOD_ID"}`,
    );

  fs.writeFileSync(testsPath, updated);
};

const main = async () => {
  try {
    await ensureAdminUser();

    await registerIfNeeded();
    const token = await login(userPayload);
    const adminToken = await login(adminPayload);

    const supplementId = await fetchId("/api/supplements?limit=1");
    const complementId = await fetchId("/api/complements?limit=1");
    const foodId = await fetchId("/api/foods?limit=1");

    updateTestsFile({ token, adminToken, supplementId, complementId, foodId });

    console.log("tests.http updated.");
    console.log("Note: tokens are saved locally. Avoid committing tests.http.");
  } catch (error) {
    console.error("Failed to update tests.http:", error);
    process.exit(1);
  }
};

void main();
