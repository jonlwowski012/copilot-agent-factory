// Common Jest testing patterns and examples

const { User, Database, APIClient } = require('./your-module');

// Basic test structure
describe('User', () => {
  test('creates user with valid data', () => {
    const user = new User({ username: 'testuser', email: 'test@example.com' });
    expect(user.username).toBe('testuser');
    expect(user.email).toBe('test@example.com');
  });
});

// Setup and teardown hooks
describe('Database operations', () => {
  let db;

  // Runs before all tests in this suite
  beforeAll(async () => {
    db = new Database('test_db');
    await db.connect();
  });

  // Runs after all tests in this suite
  afterAll(async () => {
    await db.disconnect();
  });

  // Runs before each test
  beforeEach(async () => {
    await db.clearTables();
  });

  // Runs after each test
  afterEach(async () => {
    await db.resetState();
  });

  test('inserts user into database', async () => {
    const user = await db.insertUser({ username: 'testuser' });
    expect(user.id).toBeDefined();
  });

  test('retrieves user by id', async () => {
    const inserted = await db.insertUser({ username: 'testuser' });
    const retrieved = await db.getUser(inserted.id);
    expect(retrieved.username).toBe('testuser');
  });
});

// Mocking dependencies
describe('APIClient', () => {
  let client;
  let mockFetch;

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;
    client = new APIClient('http://test.example.com');
  });

  test('makes GET request with correct URL', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: 'test' })
    });

    await client.get('/users');

    expect(mockFetch).toHaveBeenCalledWith(
      'http://test.example.com/users',
      expect.objectContaining({ method: 'GET' })
    );
  });

  test('handles error responses', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404
    });

    await expect(client.get('/notfound')).rejects.toThrow('Not found');
  });
});

// Parameterized tests using test.each
describe('Calculator', () => {
  test.each([
    [1, 1, 2],
    [2, 3, 5],
    [-1, 1, 0],
    [0, 0, 0],
  ])('add(%i, %i) returns %i', (a, b, expected) => {
    expect(a + b).toBe(expected);
  });

  test.each`
    a    | b    | expected
    ${1} | ${1} | ${2}
    ${2} | ${3} | ${5}
    ${-1}| ${1} | ${0}
  `('add($a, $b) returns $expected', ({ a, b, expected }) => {
    expect(a + b).toBe(expected);
  });
});

// Testing async code
describe('Async operations', () => {
  test('resolves with data', async () => {
    const data = await fetchData();
    expect(data).toBeDefined();
  });

  test('rejects with error', async () => {
    await expect(fetchInvalidData()).rejects.toThrow('Invalid');
  });

  test('callback-based async', (done) => {
    fetchDataCallback((error, data) => {
      expect(error).toBeNull();
      expect(data).toBeDefined();
      done();
    });
  });
});

// Spying on methods
describe('User service', () => {
  test('calls validate before save', () => {
    const user = new User({ username: 'test' });
    const validateSpy = jest.spyOn(user, 'validate');
    
    user.save();
    
    expect(validateSpy).toHaveBeenCalledTimes(1);
    validateSpy.mockRestore();
  });
});

// Snapshot testing
describe('Component rendering', () => {
  test('renders correctly', () => {
    const component = render(<UserProfile user={{ name: 'Test' }} />);
    expect(component).toMatchSnapshot();
  });
});

// Custom matchers
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    return {
      pass,
      message: () => `expected ${received} to be within range ${floor} - ${ceiling}`
    };
  }
});

test('custom matcher example', () => {
  expect(100).toBeWithinRange(90, 110);
});
