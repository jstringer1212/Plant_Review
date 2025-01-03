const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear the database
  await prisma.comment.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.favorite.deleteMany({});
  await prisma.plant.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('Database cleared');

  // Seed users
  const user1 = await prisma.user.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123', // In a real application, ensure passwords are hashed
    },
  });

  const user2 = await prisma.user.create({
    data: {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      password: 'password123', // In a real application, ensure passwords are hashed
    },
  });

  // Seed plants
  const plants = [
    {
      cName: 'Rose',
      sName: 'Rosa',
      genus: 'Rosa',
      species: 'R. gallica',
      care: 'Water regularly, full sun',
      pColor: 'Red',
      sColor: 'Green',
      imageUrl: 'https://images.unsplash.com/photo-1496062031456-07b8f162a322?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      cName: 'Tulip',
      sName: 'Tulipa',
      genus: 'Tulipa',
      species: 'T. gesneriana',
      care: 'Water moderately, full sun',
      pColor: 'Yellow',
      sColor: 'Green',
      imageUrl: 'https://images.unsplash.com/photo-1486608766848-9b9fe0c37b9d?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      cName: 'Sunflower',
      sName: 'Helianthus',
      genus: 'Helianthus',
      species: 'H. annuus',
      care: 'Water regularly, full sun',
      pColor: 'Yellow',
      sColor: 'Green',
      imageUrl: 'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      cName: 'Daffodil',
      sName: 'Narcissus',
      genus: 'Narcissus',
      species: 'N. pseudonarcissus',
      care: 'Water moderately, full sun',
      pColor: 'Yellow',
      sColor: 'Green',
      imageUrl: 'https://plus.unsplash.com/premium_photo-1676070094538-7663fb7c2745?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8RGFmZm9kaWx8ZW58MHx8MHx8fDA%3D',
    },
    {
      cName: 'Lily',
      sName: 'Lilium',
      genus: 'Lilium',
      species: 'L. candidum',
      care: 'Water regularly, partial shade',
      pColor: 'White',
      sColor: 'Green',
      imageUrl: 'https://images.unsplash.com/photo-1501973931234-5ac2964cd94a?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      cName: 'Orchid',
      sName: 'Orchidaceae',
      genus: 'Orchidaceae',
      species: 'O. phalaenopsis',
      care: 'Water moderately, indirect light',
      pColor: 'Purple',
      sColor: 'Green',
      imageUrl: 'https://images.unsplash.com/photo-1516477266610-9e4c763da721?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      cName: 'Daisy',
      sName: 'Bellis',
      genus: 'Bellis',
      species: 'B. perennis',
      care: 'Water regularly, full sun',
      pColor: 'White',
      sColor: 'Yellow',
      imageUrl: 'https://images.unsplash.com/photo-1714735643758-72dc1c8cf6be?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGFpc3klMjBmbG93ZXJ8ZW58MHx8MHx8fDA%3D',
    },
    {
      cName: 'Marigold',
      sName: 'Tagetes',
      genus: 'Tagetes',
      species: 'T. erecta',
      care: 'Water moderately, full sun',
      pColor: 'Orange',
      sColor: 'Green',
      imageUrl: 'https://images.unsplash.com/photo-1613901924339-e93f4582e4f9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      cName: 'Lavender',
      sName: 'Lavandula',
      genus: 'Lavandula',
      species: 'L. angustifolia',
      care: 'Water moderately, full sun',
      pColor: 'Purple',
      sColor: 'Green',
      imageUrl: 'https://images.unsplash.com/photo-1528756514091-dee5ecaa3278?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      cName: 'Peony',
      sName: 'Paeonia',
      genus: 'Paeonia',
      species: 'P. lactiflora',
      care: 'Water regularly, full sun',
      pColor: 'Pink',
      sColor: 'Green',
      imageUrl: 'https://images.unsplash.com/photo-1527960609338-2f6aa1b6046c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  ];

  const createdPlants = await Promise.all(
    plants.map((plant) => prisma.plant.create({ data: plant }))
  );

  console.log('Plants seeded');

  // Seed reviews
  const reviews = [
    {
      userId: user1.id,
      plantId: createdPlants[0].id, // Assuming the first plant (Rose)
      rating: 5,
      content: 'Beautiful and fragrant!',
    },
    {
      userId: user2.id,
      plantId: createdPlants[1].id, // Assuming the second plant (Tulip)
      rating: 4,
      content: 'Bright and cheerful!',
    },
    {
      userId: user1.id,
      plantId: createdPlants[2].id, // Assuming the third plant (Sunflower)
      rating: 5,
      content: 'Tall and stunning!',
    },
  ];

  const createdReviews = await Promise.all(
    reviews.map((review) => prisma.review.create({ data: review }))
  );

  console.log('Reviews seeded');

  // Seed comments
  const comments = [
    {
      userId: user2.id,
      reviewId: createdReviews[0].id, // Assuming the first review
      content: 'I agree, roses are amazing!',
    },
    {
      userId: user1.id,
      reviewId: createdReviews[1].id, // Assuming the second review
      content: 'Tulips are my favorite!',
    },
    {
      userId: user2.id,
      reviewId: createdReviews[2].id, // Assuming the third review
      content: 'Sunflowers always make me smile!',
    },
  ];

  const createdComments = await Promise.all(
    comments.map((comment) => prisma.comment.create({ data: comment }))
  );

  console.log('Comments seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });