export const noteSchema = {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['title', 'content', 'user_id', 'name'],
        properties: {
          title: { bsonType: 'string', minLength: 1 },
          content: { bsonType: 'string', minLength: 1 },
          date: { bsonType: 'date' },
          user_id: { bsonType: 'string' },
          name: { bsonType: 'string' },
          createdAt: { bsonType: 'date' },
          updatedAt: { bsonType: 'date' }
        }
      }
    }
  };