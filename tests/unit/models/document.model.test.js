// document.model.test.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Document = require('../../../src/models/document.model');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Document Model', () => {
  beforeEach(async () => {
    await Document.deleteMany({});
  });

  test('should correctly apply the toJSON plugin', async () => {
    const document = await Document.create({
      files: [
        {
          filename: 'file1.pdf',
          firebaseUrl: 'https://firebase.com/path/to/file1.pdf',
        },
      ],
      notarizationService: {
        id: new mongoose.Types.ObjectId(),
        name: 'Service',
        fieldId: new mongoose.Types.ObjectId(),
        description: 'Service Description',
        price: 100,
      },
      notarizationField: {
        id: new mongoose.Types.ObjectId(),
        name: 'Field',
        description: 'Field Description',
      },
      requesterInfo: {
        citizenId: '123456789',
        phoneNumber: '1234567890',
        email: 'test@example.com',
      },
      userId: new mongoose.Types.ObjectId(),
    });

    const jsonDocument = document.toJSON();
    expect(jsonDocument).not.toHaveProperty('_id');
    expect(jsonDocument).not.toHaveProperty('__v');
    expect(jsonDocument).toHaveProperty('id', document._id.toString());
  });

  test('should correctly apply the paginate plugin', async () => {
    await Document.create([
      {
        files: [
          {
            filename: 'file1.pdf',
            firebaseUrl: 'https://firebase.com/path/to/file1.pdf',
          },
        ],
        notarizationService: {
          id: new mongoose.Types.ObjectId(),
          name: 'Service 1',
          fieldId: new mongoose.Types.ObjectId(),
          description: 'Service Description 1',
          price: 100,
        },
        notarizationField: {
          id: new mongoose.Types.ObjectId(),
          name: 'Field 1',
          description: 'Field Description 1',
        },
        requesterInfo: {
          citizenId: '123456789',
          phoneNumber: '1234567890',
          email: 'test1@example.com',
        },
        userId: new mongoose.Types.ObjectId(),
      },
      {
        files: [
          {
            filename: 'file2.pdf',
            firebaseUrl: 'https://firebase.com/path/to/file2.pdf',
          },
        ],
        notarizationService: {
          id: new mongoose.Types.ObjectId(),
          name: 'Service 2',
          fieldId: new mongoose.Types.ObjectId(),
          description: 'Service Description 2',
          price: 200,
        },
        notarizationField: {
          id: new mongoose.Types.ObjectId(),
          name: 'Field 2',
          description: 'Field Description 2',
        },
        requesterInfo: {
          citizenId: '987654321',
          phoneNumber: '0987654321',
          email: 'test2@example.com',
        },
        userId: new mongoose.Types.ObjectId(),
      },
    ]);

    const result = await Document.paginate({}, { page: 1, limit: 1 });
    expect(result.results).toHaveLength(1);
    expect(result.totalResults).toBe(2);
    expect(result.totalPages).toBe(2);
    expect(result.page).toBe(1);
  });

  test('should throw validation error if required fields are missing', async () => {
    const document = new Document({
      files: [
        {
          filename: 'file1.pdf',
          firebaseUrl: 'https://firebase.com/path/to/file1.pdf',
        },
      ],
      notarizationService: {
        id: new mongoose.Types.ObjectId(),
        name: 'Service',
        fieldId: new mongoose.Types.ObjectId(),
        description: 'Service Description',
        price: 100,
      },
      notarizationField: {
        id: new mongoose.Types.ObjectId(),
        name: 'Field',
        description: 'Field Description',
      },
      requesterInfo: {
        citizenId: '123456789',
        phoneNumber: '1234567890',
        email: 'test@example.com',
      },
    });

    let err;
    try {
      await document.validate();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.userId).toBeDefined();
  });
});
