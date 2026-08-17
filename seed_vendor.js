const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: 'tiendalaptop@gmail.com' }
  });

  if (existingUser) {
    console.log('User already exists');
    return;
  }

  const hashedPassword = await bcrypt.hash('123456', 10);
  
  const user = await prisma.user.create({
    data: {
      name: 'Vendedor Laptops',
      email: 'tiendalaptop@gmail.com',
      password: hashedPassword,
      role: 'VENDOR',
    }
  });

  console.log('User created:', user.email);

  const store = await prisma.store.create({
    data: {
      name: 'TechStore - Laptops',
      description: 'Las mejores laptops, computadoras y accesorios.',
      ownerId: user.id,
      bannerImage: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1200&q=80',
    }
  });

  console.log('Store created:', store.name);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
