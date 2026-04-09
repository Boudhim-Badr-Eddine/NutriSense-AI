const baseUrl = process.env.SMOKE_BASE_URL || 'http://localhost:5000/api';
const smokeEmail = process.env.SMOKE_EMAIL || `smoke_${Date.now()}@test.com`;
const smokePassword = process.env.SMOKE_PASSWORD || 'Test1234!';

const log = (status, name, details = '') => {
  const suffix = details ? ` | ${details}` : '';
  console.log(`${status} | ${name}${suffix}`);
};

const requestJson = async (path, options = {}) => {
  const mergedHeaders = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: mergedHeaders,
  });

  const text = await response.text();
  let payload = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { raw: text };
    }
  }

  return { status: response.status, payload };
};

const expectStatus = (name, status, expected) => {
  const ok = Array.isArray(expected)
    ? expected.includes(status)
    : status === expected;

  if (!ok) {
    throw new Error(`${name} expected ${expected} but got ${status}`);
  }

  log('OK', name, `HTTP ${status}`);
};

const run = async () => {
  let token = '';

  const health = await requestJson('/health');
  expectStatus('health', health.status, 200);

  const register = await requestJson('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Smoke User',
      email: smokeEmail,
      password: smokePassword,
    }),
  });
  expectStatus('auth register', register.status, [201, 409]);

  const login = await requestJson('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: smokeEmail,
      password: smokePassword,
    }),
  });
  expectStatus('auth login', login.status, 200);

  token = login.payload?.data?.token || '';
  if (!token) {
    throw new Error('auth login did not return token');
  }

  const profile = await requestJson('/auth/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  expectStatus('auth profile', profile.status, 200);

  const supplements = await requestJson('/supplements');
  expectStatus('supplements list', supplements.status, 200);

  const complements = await requestJson('/complements');
  expectStatus('complements list', complements.status, 200);

  const foods = await requestJson('/foods');
  expectStatus('foods list', foods.status, 200);

  const chat = await requestJson('/chat', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message: 'Give me 3 high protein foods' }),
  });
  expectStatus('chat send', chat.status, 200);

  log('DONE', 'smoke test', 'all checks passed');
};

run().catch((error) => {
  log('FAIL', 'smoke test', error.message);
  process.exit(1);
});
