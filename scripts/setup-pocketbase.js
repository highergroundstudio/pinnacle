const PocketBase = require('pocketbase/cjs');

async function setupPocketBase() {
  const pb = new PocketBase('http://127.0.0.1:8090');

  try {
    // Wait for PocketBase to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create users collection if it doesn't exist
    const collections = await pb.collections.getList();
    if (!collections.items.find(c => c.name === 'users')) {
      await pb.collections.create({
        name: 'users',
        type: 'auth',
        schema: [
          {
            name: 'name',
            type: 'text',
            required: true,
          },
          {
            name: 'role',
            type: 'select',
            required: true,
            options: {
              values: ['admin', 'user'],
            },
          },
        ],
      });
    }

    // Create settings collection if it doesn't exist
    if (!collections.items.find(c => c.name === 'settings')) {
      await pb.collections.create({
        name: 'settings',
        type: 'base',
        schema: [
          {
            name: 'type',
            type: 'text',
            required: true,
          },
          {
            name: 'googleApiKey',
            type: 'text',
          },
          {
            name: 'hubspotToken',
            type: 'text',
          },
          {
            name: 'filesystemPath',
            type: 'text',
          },
        ],
      });
    }

    // Create default admin user
    try {
      await pb.collection('users').create({
        email: 'admin@example.com',
        password: 'admin123',
        passwordConfirm: 'admin123',
        name: 'Admin User',
        role: 'admin',
      });
      console.log('Default admin user created successfully!');
    } catch (error) {
      if (error.status === 400 && error.data.email?.code === 'validation_not_unique') {
        console.log('Admin user already exists');
      } else {
        throw error;
      }
    }

    console.log('PocketBase setup completed successfully!');
    console.log('Default admin credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error setting up PocketBase:', error);
    process.exit(1);
  }
}

setupPocketBase();