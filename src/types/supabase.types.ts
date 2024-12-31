export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password?: string
          // ... other user fields
        }
        // ... other table configuration
      }
      // ... other tables
    }
  }
} 