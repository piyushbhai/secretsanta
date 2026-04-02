const SantaEngine = require('../src/services/santaEngine');
const FileExporter = require('../src/services/fileExporter');
const path = require('path');
const fs = require('fs');

// ============ test data ============

const people = [
  { name: 'Hamish Murray', email: 'hamish.murray@acme.com' },
  { name: 'Layla Graham', email: 'layla.graham@acme.com' },
  { name: 'Matthew King', email: 'matthew.king@acme.com' },
  { name: 'Benjamin Collins', email: 'benjamin.collins@acme.com' },
  { name: 'Isabella Scott', email: 'isabella.scott@acme.com' },
  { name: 'Charlie Ross', email: 'charlie.ross@acme.com' }
];

// ============ SantaEngine tests ============

describe('SantaEngine - basic', () => {

  it('assigns everyone', () => {
    const engine = new SantaEngine(people);
    const result = engine.generate();
    expect(result.length).toBe(people.length);
  });

  it('nobody gets themselves', () => {
    const engine = new SantaEngine(people);
    const result = engine.generate();
    for (const pair of result) {
      expect(pair.giverEmail).not.toBe(pair.receiverEmail);
    }
  });

  it('everyone is a giver exactly once', () => {
    const engine = new SantaEngine(people);
    const result = engine.generate();
    const givers = result.map(r => r.giverEmail);
    expect([...new Set(givers)].length).toBe(people.length);
  });

  it('everyone is a receiver exactly once', () => {
    const engine = new SantaEngine(people);
    const result = engine.generate();
    const receivers = result.map(r => r.receiverEmail);
    expect([...new Set(receivers)].length).toBe(people.length);
  });

  it('works with exactly 2 people', () => {
    const two = people.slice(0, 2);
    const engine = new SantaEngine(two);
    const result = engine.generate();
    expect(result.length).toBe(2);
    // they must give to each other
    expect(result[0].giverEmail).toBe(result[1].receiverEmail);
    expect(result[1].giverEmail).toBe(result[0].receiverEmail);
  });
});

describe('SantaEngine - previous year constraint', () => {

  const prevPairs = [
    { giverEmail: 'hamish.murray@acme.com', receiverEmail: 'layla.graham@acme.com' },
    { giverEmail: 'layla.graham@acme.com', receiverEmail: 'matthew.king@acme.com' },
    { giverEmail: 'matthew.king@acme.com', receiverEmail: 'benjamin.collins@acme.com' },
    { giverEmail: 'benjamin.collins@acme.com', receiverEmail: 'isabella.scott@acme.com' },
    { giverEmail: 'isabella.scott@acme.com', receiverEmail: 'charlie.ross@acme.com' },
    { giverEmail: 'charlie.ross@acme.com', receiverEmail: 'hamish.murray@acme.com' },
  ];

  it('never repeats previous year assignment', () => {
    // run 50 times to be confident
    for (let i = 0; i < 50; i++) {
      const engine = new SantaEngine(people, prevPairs);
      const result = engine.generate();

      for (const pair of result) {
        const prev = prevPairs.find(p => p.giverEmail === pair.giverEmail);
        if (prev) {
          expect(pair.receiverEmail).not.toBe(prev.receiverEmail);
        }
      }
    }
  });

  it('still assigns everyone even with constraints', () => {
    const engine = new SantaEngine(people, prevPairs);
    const result = engine.generate();
    expect(result.length).toBe(people.length);
  });
});

describe('SantaEngine - error handling', () => {

  it('throws with 0 people', () => {
    expect(() => new SantaEngine([])).toThrow('need at least 2');
  });

  it('throws with 1 person', () => {
    expect(() => new SantaEngine([people[0]])).toThrow('need at least 2');
  });

  it('throws with null', () => {
    expect(() => new SantaEngine(null)).toThrow();
  });

  it('throws with undefined', () => {
    expect(() => new SantaEngine(undefined)).toThrow();
  });
});

describe('SantaEngine - large group', () => {

  it('handles 50 employees', () => {
    const bigGroup = [];
    for (let i = 0; i < 50; i++) {
      bigGroup.push({
        name: `Person ${i}`,
        email: `person${i}@acme.com`
      });
    }

    const engine = new SantaEngine(bigGroup);
    const result = engine.generate();

    expect(result.length).toBe(50);

    // nobody gets themselves
    for (const pair of result) {
      expect(pair.giverEmail).not.toBe(pair.receiverEmail);
    }
  });
});

// ============ FileExporter tests ============

describe('FileExporter', () => {

  const testOutputDir = path.join(__dirname, '../output/test');

  afterAll(() => {
    // cleanup test files
    if (fs.existsSync(testOutputDir)) {
      fs.rmSync(testOutputDir, { recursive: true, force: true });
    }
  });

  it('creates a csv file', () => {
    const exp = new FileExporter(testOutputDir);
    const sampleData = [
      {
        giverName: 'Hamish Murray',
        giverEmail: 'hamish@acme.com',
        receiverName: 'Layla Graham',
        receiverEmail: 'layla@acme.com'
      }
    ];

    const filepath = exp.exportToCSV(sampleData, 'test_output.csv');
    expect(fs.existsSync(filepath)).toBe(true);
  });

  it('csv contains correct headers', () => {
    const exp = new FileExporter(testOutputDir);
    const sampleData = [
      {
        giverName: 'Hamish Murray',
        giverEmail: 'hamish@acme.com',
        receiverName: 'Layla Graham',
        receiverEmail: 'layla@acme.com'
      }
    ];

    const filepath = exp.exportToCSV(sampleData, 'test_headers.csv');
    const content = fs.readFileSync(filepath, 'utf-8');

    expect(content).toContain('Employee_Name');
    expect(content).toContain('Employee_EmailID');
    expect(content).toContain('Secret_Child_Name');
    expect(content).toContain('Secret_Child_EmailID');
  });

  it('csv contains actual data', () => {
    const exp = new FileExporter(testOutputDir);
    const sampleData = [
      {
        giverName: 'Hamish Murray',
        giverEmail: 'hamish@acme.com',
        receiverName: 'Layla Graham',
        receiverEmail: 'layla@acme.com'
      }
    ];

    const filepath = exp.exportToCSV(sampleData, 'test_data.csv');
    const content = fs.readFileSync(filepath, 'utf-8');

    expect(content).toContain('Hamish Murray');
    expect(content).toContain('hamish@acme.com');
    expect(content).toContain('Layla Graham');
    expect(content).toContain('layla@acme.com');
  });

  it('throws on empty array', () => {
    const exp = new FileExporter(testOutputDir);
    expect(() => exp.exportToCSV([])).toThrow('nothing to export');
  });

  it('toCSVString returns string not file', () => {
    const exp = new FileExporter(testOutputDir);
    const sampleData = [
      {
        giverName: 'Test',
        giverEmail: 'test@acme.com',
        receiverName: 'Test2',
        receiverEmail: 'test2@acme.com'
      }
    ];

    const csvStr = exp.toCSVString(sampleData);
    expect(typeof csvStr).toBe('string');
    expect(csvStr).toContain('Employee_Name');
  });
});