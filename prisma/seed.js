const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  try {
    await prisma.service.deleteMany();
  } catch (error) {
    console.log('Tabel service tidak ditemukan atau error:', error.message);
  }

  // Create architectural services
  const services = [
    {
      name: 'Architectural Design - 1',
      price: 100000000,
      size: 'Under 250m²',
    },
    {
      name: 'Architectural Design - 2',
      price: 250000000,
      size: '251-500m²',
    },
    {
      name: 'Architectural Design - 3',
      price: 350000000,
      size: '501-1000m²',
    },
    {
      name: 'Architectural Design - 4',
      price: 500000000,
      size: 'Under 250m²',
    },
    {
      name: 'Home Renovation',
      price: 2000000,
      size: 'Per m²',
    },
    {
      name: 'House Construction',
      price: 5000000,
      size: 'Per m²',
    },
    {
      name: 'Villa Construction',
      price: 7500000,
      size: 'Per m²',
    }
  ];

  // Insert services
  for (const service of services) {
    const createdService = await prisma.service.create({
      data: service
    });
    console.log(`Created service: ${createdService.name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 