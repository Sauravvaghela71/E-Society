/**
 * Seed test users for E-Society
 * This file creates test accounts for Admin, Guard, and Resident users
 */

async function seedUsers() {
  try {
    console.log('🌱 Seeding test users...');
    
    const response = await fetch('http://localhost:5100/api/user/seed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        users: [
          {
            email: 'admin@esociety.com',
            password: 'admin123',
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin'
          },
          {
            email: 'guard@esociety.com',
            password: 'guard123',
            firstName: 'Raj',
            lastName: 'Kumar',
            role: 'guard'
          },
          {
            email: 'resident@esociety.com',
            password: 'resident123',
            firstName: 'Saurav',
            lastName: 'Vaghela',
            role: 'resident'
          }
        ]
      })
    });

    const data = await response.json();
    console.log('✅ Seed response:', data);
    
    if (response.ok) {
      console.log('✨ Test users created successfully!');
      console.log('\n📝 Test Credentials:');
      console.log('───────────────────────────────');
      console.log('Admin:    admin@esociety.com / admin123');
      console.log('Guard:    guard@esociety.com / guard123');
      console.log('Resident: resident@esociety.com / resident123');
      console.log('───────────────────────────────\n');
    }
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  }
}

seedUsers();
