const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear the database
  await prisma.plant.deleteMany({});
  console.log('Database cleared');

  const plants = [
    {
      cName: 'Rose',
      sName: 'Rosa',
      genus: 'Rosa',
      species: 'R. gallica',
      care: 'Water regularly, full sun',
      pColor: 'Red', // Correct field name
      sColor: 'Green', // Correct field name
      imageUrl: 'https://example.com/rose.jpg',
    },
    {
      cName: 'Tulip',
      sName: 'Tulipa',
      genus: 'Tulipa',
      species: 'T. gesneriana',
      care: 'Water moderately, full sun',
      pColor: 'Yellow', // Correct field name
      sColor: 'Green', // Correct field name
      imageUrl: 'https://example.com/tulip.jpg',
    },
    {
      cName: 'Sunflower',
      sName: 'Helianthus',
      genus: 'Helianthus',
      species: 'H. annuus',
      care: 'Water regularly, full sun',
      pColor: 'Yellow', // Correct field name
      sColor: 'Green', // Correct field name
      imageUrl: 'https://example.com/sunflower.jpg',
    },
    {
      cName: 'Daisy',
      sName: 'Bellis',
      genus: 'Bellis',
      species: 'B. perennis',
      care: 'Water moderately, full sun',
      pColor: 'White', // Correct field name
      sColor: 'Yellow', // Correct field name
      imageUrl: 'https://example.com/daisy.jpg',
    },
    {
      cName: 'Orchid',
      sName: 'Orchidaceae',
      genus: 'Orchidaceae',
      species: 'O. phalaenopsis',
      care: 'Water sparingly, indirect light',
      pColor: 'Purple', // Correct field name
      sColor: 'Green', // Correct field name
      imageUrl: 'https://example.com/orchid.jpg',
    },
    {
      cName: 'Lily',
      sName: 'Lilium',
      genus: 'Lilium',
      species: 'L. candidum',
      care: 'Water regularly, full sun',
      pColor: 'White', // Correct field name
      sColor: 'Green', // Correct field name
      imageUrl: 'https://example.com/lily.jpg',
    },
    {
      cName: 'Marigold',
      sName: 'Tagetes',
      genus: 'Tagetes',
      species: 'T. erecta',
      care: 'Water moderately, full sun',
      pColor: 'Orange', // Correct field name
      sColor: 'Green', // Correct field name
      imageUrl: 'https://example.com/marigold.jpg',
    },
    {
      cName: 'Lavender',
      sName: 'Lavandula',
      genus: 'Lavandula',
      species: 'L. angustifolia',
      care: 'Water sparingly, full sun',
      pColor: 'Purple', // Correct field name
      sColor: 'Green', // Correct field name
      imageUrl: 'https://example.com/lavender.jpg',
    },
    {
      cName: 'Peony',
      sName: 'Paeonia',
      genus: 'Paeonia',
      species: 'P. lactiflora',
      care: 'Water regularly, full sun',
      pColor: 'Pink', // Correct field name
      sColor: 'Green', // Correct field name
      imageUrl: 'https://example.com/peony.jpg',
    },
    {
      cName: 'Chrysanthemum',
      sName: 'Chrysanthemum',
      genus: 'Chrysanthemum',
      species: 'C. morifolium',
      care: 'Water moderately, full sun',
      pColor: 'Yellow', // Correct field name
      sColor: 'Green', // Correct field name
      imageUrl: 'https://example.com/chrysanthemum.jpg',
    },
  ];

  for (const plant of plants) {
    await prisma.plant.create({
      data: plant,
    });
  }

  console.log('Database seeded with 10 plants');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });