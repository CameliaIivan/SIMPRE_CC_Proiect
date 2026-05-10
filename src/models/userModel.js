export const userSchema = {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['username', 'email', 'password'],
        properties: {
          username: { bsonType: 'string', minLength: 1 },
          email: { bsonType: 'string', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' },
          password: { bsonType: 'string', minLength: 6 },
          createdAt: { bsonType: 'date' },
          updatedAt: { bsonType: 'date' }
        }
      }
    }
  };