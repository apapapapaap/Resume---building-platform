import bcrypt from 'bcryptjs';

// Mock users database (in-memory for now)
let users = [
  {
    id: 1,
    email: 'demo@resumebuilder.com',
    password: bcrypt.hashSync('demo123', 12), // password: demo123
    full_name: 'Demo User',
    created_at: new Date()
  }
];

export const mockUsers = {
  findByEmail: (email) => users.find(user => user.email === email),
  findById: (id) => users.find(user => user.id === parseInt(id)),
  create: (userData) => {
    const newUser = {
      id: users.length + 1,
      ...userData,
      created_at: new Date()
    };
    users.push(newUser);
    return newUser;
  },
  getAll: () => users
};
