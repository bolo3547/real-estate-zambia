import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@zambiaproperty.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';
  
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: new Date(),
    },
  });

  console.log(`✅ Admin user created: ${admin.email}`);

  // Create sample agent
  const agent = await prisma.user.upsert({
    where: { email: 'agent@example.com' },
    update: {},
    create: {
      email: 'agent@example.com',
      passwordHash: hashedPassword,
      firstName: 'John',
      lastName: 'Mwanza',
      phone: '+260971234567',
      role: 'AGENT',
      status: 'ACTIVE',
      emailVerified: new Date(),
    },
  });

  console.log(`✅ Agent user created: ${agent.email}`);

  // Create sample landlord
  const landlord = await prisma.user.upsert({
    where: { email: 'landlord@example.com' },
    update: {},
    create: {
      email: 'landlord@example.com',
      passwordHash: hashedPassword,
      firstName: 'Mary',
      lastName: 'Banda',
      phone: '+260977654321',
      role: 'LANDLORD',
      status: 'ACTIVE',
      emailVerified: new Date(),
    },
  });

  console.log(`✅ Landlord user created: ${landlord.email}`);

  // Create sample properties - Mumbwa District
  const propertiesData = [
    {
      title: 'Modern 4 Bedroom House in Mumbwa Town',
      slug: 'modern-4-bedroom-house-mumbwa-town',
      description: 'Beautiful modern house in the heart of Mumbwa Town. Features include a large yard, modern kitchen, and spacious living areas. Perfect for a growing family.',
      propertyType: 'HOUSE' as const,
      listingType: 'SALE' as const,
      price: 550000,
      currency: 'ZMW' as const,
      address: 'Plot 123, Main Street',
      city: 'Mumbwa Town',
      province: 'Central',
      bedrooms: 4,
      bathrooms: 3,
      floorArea: 280,
      landArea: 800,
      yearBuilt: 2021,
      amenities: JSON.stringify(['Borehole', 'Garden', 'Security Fence', 'Parking', 'Solar Backup']),
      status: 'APPROVED' as const,
      approvalStatus: 'APPROVED' as const,
      ownerId: agent.id,
    },
    {
      title: 'Commercial Building in Mumbwa Town Centre',
      slug: 'commercial-building-mumbwa-town-centre',
      description: 'Prime commercial property in Mumbwa Town center. Ground floor retail space with upper floor offices. High foot traffic area.',
      propertyType: 'COMMERCIAL' as const,
      listingType: 'SALE' as const,
      price: 1200000,
      currency: 'ZMW' as const,
      address: 'Plot 45, Market Road',
      city: 'Mumbwa Town',
      province: 'Central',
      floorArea: 400,
      landArea: 600,
      yearBuilt: 2018,
      amenities: JSON.stringify(['Parking', 'Security', 'Water Storage']),
      status: 'APPROVED' as const,
      approvalStatus: 'APPROVED' as const,
      ownerId: agent.id,
    },
    {
      title: '3 Bedroom House for Rent - Mumbwa Town',
      slug: '3-bedroom-house-rent-mumbwa-town',
      description: 'Comfortable 3 bedroom house available for rent in quiet neighborhood. Recently renovated with modern finishes.',
      propertyType: 'HOUSE' as const,
      listingType: 'RENT' as const,
      price: 4500,
      currency: 'ZMW' as const,
      address: 'Plot 78, Residential Area',
      city: 'Mumbwa Town',
      province: 'Central',
      bedrooms: 3,
      bathrooms: 2,
      floorArea: 180,
      landArea: 500,
      yearBuilt: 2019,
      amenities: JSON.stringify(['Parking', 'Garden', 'Borehole']),
      status: 'APPROVED' as const,
      approvalStatus: 'APPROVED' as const,
      ownerId: landlord.id,
    },
    {
      title: 'Farm Land Near Nangoma - 50 Hectares',
      slug: 'farm-land-nangoma-50-hectares',
      description: 'Prime agricultural land near Nangoma. Ideal for commercial farming with good water access and fertile soil.',
      propertyType: 'FARM' as const,
      listingType: 'SALE' as const,
      price: 2500000,
      currency: 'ZMW' as const,
      address: 'Nangoma Road, 15km from Mumbwa',
      city: 'Nangoma',
      province: 'Central',
      landArea: 500000,
      amenities: JSON.stringify(['Water Access', 'Road Access']),
      status: 'APPROVED' as const,
      approvalStatus: 'APPROVED' as const,
      ownerId: agent.id,
    },
    {
      title: 'Residential Plot in Mumbwa Town',
      slug: 'residential-plot-mumbwa-town',
      description: 'Well-located residential plot with title deed. Ready for development with all utilities available.',
      propertyType: 'LAND' as const,
      listingType: 'SALE' as const,
      price: 180000,
      currency: 'ZMW' as const,
      address: 'New Extension Area',
      city: 'Mumbwa Town',
      province: 'Central',
      landArea: 1000,
      amenities: JSON.stringify(['Electricity Nearby', 'Water Nearby', 'Road Access']),
      status: 'APPROVED' as const,
      approvalStatus: 'APPROVED' as const,
      ownerId: agent.id,
    },
    {
      title: 'Safari Lodge Near Kafue National Park',
      slug: 'safari-lodge-kafue-national-park',
      description: 'Stunning safari lodge with breathtaking views. Perfect for eco-tourism business. Established clientele and all permits in place.',
      propertyType: 'LODGE' as const,
      listingType: 'SALE' as const,
      price: 8500000,
      currency: 'ZMW' as const,
      address: 'Kafue National Park Border',
      city: 'Mumbwa',
      province: 'Central',
      bedrooms: 12,
      bathrooms: 12,
      floorArea: 800,
      landArea: 50000,
      yearBuilt: 2015,
      amenities: JSON.stringify(['Swimming Pool', 'Restaurant', 'Game Drives', 'Solar Power', 'Borehole']),
      status: 'APPROVED' as const,
      approvalStatus: 'APPROVED' as const,
      ownerId: agent.id,
    },
    {
      title: '2 Bedroom Apartment for Rent',
      slug: '2-bedroom-apartment-rent-mumbwa',
      description: 'Modern 2 bedroom apartment in secure complex. Perfect for young professionals or small families.',
      propertyType: 'APARTMENT' as const,
      listingType: 'RENT' as const,
      price: 3500,
      currency: 'ZMW' as const,
      address: 'Mumbwa Apartments, Block C',
      city: 'Mumbwa Town',
      province: 'Central',
      bedrooms: 2,
      bathrooms: 1,
      floorArea: 85,
      yearBuilt: 2022,
      amenities: JSON.stringify(['Security', 'Parking', 'Water Tank']),
      status: 'APPROVED' as const,
      approvalStatus: 'APPROVED' as const,
      ownerId: landlord.id,
    },
    {
      title: 'Executive 5 Bedroom House - Luxury',
      slug: 'executive-5-bedroom-house-luxury-mumbwa',
      description: 'Luxurious executive home with premium finishes. Features swimming pool, landscaped gardens, and modern smart home technology.',
      propertyType: 'HOUSE' as const,
      listingType: 'SALE' as const,
      price: 1800000,
      currency: 'ZMW' as const,
      address: 'Premium Estate, Plot 1',
      city: 'Mumbwa Town',
      province: 'Central',
      bedrooms: 5,
      bathrooms: 4,
      floorArea: 450,
      landArea: 2000,
      yearBuilt: 2023,
      amenities: JSON.stringify(['Swimming Pool', 'Smart Home', 'Solar Power', 'Borehole', 'Generator', 'CCTV', 'Electric Fence']),
      status: 'APPROVED' as const,
      approvalStatus: 'APPROVED' as const,
      ownerId: agent.id,
    },
    {
      title: 'Shop Space for Rent - Main Market',
      slug: 'shop-space-rent-main-market-mumbwa',
      description: 'Prime retail space in busy main market area. High foot traffic, perfect for any retail business.',
      propertyType: 'COMMERCIAL' as const,
      listingType: 'RENT' as const,
      price: 8000,
      currency: 'ZMW' as const,
      address: 'Main Market, Shop 23',
      city: 'Mumbwa Town',
      province: 'Central',
      floorArea: 50,
      amenities: JSON.stringify(['Electricity', 'Water', 'Security']),
      status: 'APPROVED' as const,
      approvalStatus: 'APPROVED' as const,
      ownerId: landlord.id,
    },
    {
      title: 'Cattle Ranch - 200 Hectares',
      slug: 'cattle-ranch-200-hectares-mumbwa',
      description: 'Well-established cattle ranch with grazing land, water points, and farm buildings. Currently running 500 head of cattle.',
      propertyType: 'FARM' as const,
      listingType: 'SALE' as const,
      price: 12000000,
      currency: 'ZMW' as const,
      address: '40km from Mumbwa Town',
      city: 'Mumbwa',
      province: 'Central',
      landArea: 2000000,
      amenities: JSON.stringify(['Borehole', 'Farm Buildings', 'Fenced', 'Dam']),
      status: 'APPROVED' as const,
      approvalStatus: 'APPROVED' as const,
      ownerId: agent.id,
    },
  ];

  for (const propertyData of propertiesData) {
    await prisma.property.upsert({
      where: { slug: propertyData.slug },
      update: {},
      create: propertyData,
    });
  }

  console.log(`✅ ${propertiesData.length} sample properties created`);

  console.log('');
  console.log('🎉 Seeding complete!');
  console.log('');
  console.log('📋 Test Accounts:');
  console.log('   Admin:    admin@zambiaproperty.com / admin123456');
  console.log('   Agent:    agent@example.com / admin123456');
  console.log('   Landlord: landlord@example.com / admin123456');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
