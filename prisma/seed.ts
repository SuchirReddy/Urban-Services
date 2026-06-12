import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create 5 users
  const users = await Promise.all([
    prisma.user.create({ data: { name: 'Ravi', email: 'ravi@example.com', phone: '9999999991' } }),
    prisma.user.create({ data: { name: 'Anjali', email: 'anjali@example.com', phone: '9999999992' } }),
    prisma.user.create({ data: { name: 'Kiran', email: 'kiran@example.com', phone: '9999999993' } }),
    prisma.user.create({ data: { name: 'Vikram', email: 'vikram@example.com', phone: '9999999994' } }),
    prisma.user.create({ data: { name: 'Pooja', email: 'pooja@example.com', phone: '9999999995' } }),
  ]);

  // Create 3 Categories of Services with 2 services each
  const cleaning1 = await prisma.service.create({ data: { name: 'Home Cleaning', category: 'Cleaning', description: 'Full home deep cleaning', price: 1499, duration: 180, imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop' } });
  const cleaning2 = await prisma.service.create({ data: { name: 'Bathroom Cleaning', category: 'Cleaning', description: 'Deep bathroom cleaning', price: 499, duration: 60, imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop' } });
  
  const plumbing1 = await prisma.service.create({ data: { name: 'Tap Repair', category: 'Plumbing', description: 'Fix leaking taps', price: 299, duration: 30, imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=2070&auto=format&fit=crop' } });
  const plumbing2 = await prisma.service.create({ data: { name: 'Pipe Installation', category: 'Plumbing', description: 'New pipe setup', price: 999, duration: 120, imageUrl: 'https://images.unsplash.com/photo-1607400201889-565314e0046b?q=80&w=2070&auto=format&fit=crop' } });
  
  const beauty1 = await prisma.service.create({ data: { name: 'Haircut for Men', category: 'Beauty', description: 'Stylish haircut', price: 249, duration: 30, imageUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=2070&auto=format&fit=crop' } });
  const beauty2 = await prisma.service.create({ data: { name: 'Facial & Cleanup', category: 'Beauty', description: 'Glow facial package', price: 899, duration: 60, imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop' } });

  const appliance1 = await prisma.service.create({ data: { name: 'AC Service & Repair', category: 'Appliance Repair', description: 'Complete AC cooling fix and service', price: 599, duration: 60, imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop' } });
  const appliance2 = await prisma.service.create({ data: { name: 'Washing Machine Repair', category: 'Appliance Repair', description: 'Fix drum and motor issues', price: 499, duration: 60, imageUrl: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=2070&auto=format&fit=crop' } });

  const electric1 = await prisma.service.create({ data: { name: 'Fan Installation', category: 'Electrician', description: 'Ceiling or wall fan fitting', price: 199, duration: 30, imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2070&auto=format&fit=crop' } });
  const electric2 = await prisma.service.create({ data: { name: 'Switchboard Repair', category: 'Electrician', description: 'Fix short circuits and replace switches', price: 149, duration: 30, imageUrl: 'https://images.unsplash.com/photo-1558522195-e1201b090344?q=80&w=2070&auto=format&fit=crop' } });

  const paint1 = await prisma.service.create({ data: { name: 'Interior Wall Painting', category: 'Painting', description: 'Premium plastic paint for 1 room', price: 4999, duration: 480, imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2070&auto=format&fit=crop' } });
  const paint2 = await prisma.service.create({ data: { name: 'Waterproofing', category: 'Painting', description: 'Roof or exterior wall waterproofing', price: 2999, duration: 240, imageUrl: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?q=80&w=2070&auto=format&fit=crop' } });

  const carpentry1 = await prisma.service.create({ data: { name: 'Furniture Assembly', category: 'Carpentry', description: 'Bed, wardrobe, and cabinet assembly', price: 999, duration: 120, imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop' } });
  const carpentry2 = await prisma.service.create({ data: { name: 'Door Lock Repair', category: 'Carpentry', description: 'Fix or replace door locks and handles', price: 499, duration: 60, imageUrl: '/images/door_lock.png' } });

  const services = [cleaning1, cleaning2, plumbing1, plumbing2, beauty1, beauty2, appliance1, appliance2, electric1, electric2, paint1, paint2, carpentry1, carpentry2];

  // Add-ons for some services
  await prisma.addOn.create({ data: { name: 'Extra Bathroom', price: 299, serviceId: cleaning1.id } });
  await prisma.addOn.create({ data: { name: 'Balcony Wash', price: 199, serviceId: cleaning1.id } });
  await prisma.addOn.create({ data: { name: 'Premium Material', price: 149, serviceId: plumbing1.id } });

  // Create 9 professionals
  const pros = await Promise.all([
    prisma.professional.create({ data: { name: 'Amit Kumar', email: 'amit@pro.com', phone: '8888888881', serviceAreas: 'South Delhi, Gurgaon', services: { connect: [{ id: cleaning1.id }, { id: cleaning2.id }] } } }),
    prisma.professional.create({ data: { name: 'Suresh Singh', email: 'suresh@pro.com', phone: '8888888882', serviceAreas: 'Noida, East Delhi', services: { connect: [{ id: plumbing1.id }, { id: plumbing2.id }] } } }),
    prisma.professional.create({ data: { name: 'Neha Sharma', email: 'neha@pro.com', phone: '8888888883', serviceAreas: 'Gurgaon, Vasant Kunj', services: { connect: [{ id: beauty1.id }, { id: beauty2.id }] } } }),
    prisma.professional.create({ data: { name: 'Rahul Verma', email: 'rahul@pro.com', phone: '8888888884', serviceAreas: 'Central Delhi', services: { connect: [{ id: cleaning1.id }, { id: plumbing1.id }] } } }),
    prisma.professional.create({ data: { name: 'Sunita Devi', email: 'sunita@pro.com', phone: '8888888885', serviceAreas: 'South Delhi', services: { connect: [{ id: beauty2.id }, { id: cleaning2.id }] } } }),
    prisma.professional.create({ data: { name: 'Rakesh Yadav', email: 'rakesh@pro.com', phone: '8888888886', serviceAreas: 'Dwarka, West Delhi', services: { connect: [{ id: appliance1.id }, { id: appliance2.id }] } } }),
    prisma.professional.create({ data: { name: 'Vikash Rao', email: 'vikash@pro.com', phone: '8888888887', serviceAreas: 'North Delhi', services: { connect: [{ id: electric1.id }, { id: electric2.id }] } } }),
    prisma.professional.create({ data: { name: 'Kishore Paintwala', email: 'kishore@pro.com', phone: '8888888888', serviceAreas: 'All Delhi NCR', services: { connect: [{ id: paint1.id }, { id: paint2.id }] } } }),
    prisma.professional.create({ data: { name: 'Ramu Carpenter', email: 'ramu@pro.com', phone: '8888888889', serviceAreas: 'East Delhi', services: { connect: [{ id: carpentry1.id }, { id: carpentry2.id }] } } }),
  ]);

  // Create Addresses
  const address1 = await prisma.address.create({ data: { userId: users[0].id, label: 'Home', full: '123 MG Road, Delhi', lat: 28.6139, lng: 77.2090 } });
  const address2 = await prisma.address.create({ data: { userId: users[1].id, label: 'Work', full: 'Cyber City, Gurgaon', lat: 28.4595, lng: 77.0266 } });

  // Create Documents
  await prisma.document.create({ data: { professionalId: pros[0].id, type: 'Aadhar', url: 'https://example.com/doc1' } });
  await prisma.document.create({ data: { professionalId: pros[1].id, type: 'Aadhar', url: 'https://example.com/doc2' } });

  // Create 20 Bookings
  const statuses = ['PENDING', 'ACCEPTED', 'PRO_ON_THE_WAY', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
  
  for (let i = 0; i < 20; i++) {
    const user = users[i % users.length];
    const pro = pros[i % pros.length];
    const service = services[i % services.length];
    
    // Ensure the pro provides this service, or just let it be random for seed purposes
    
    const status = statuses[i % statuses.length];
    
    await prisma.booking.create({
      data: {
        userId: user.id,
        professionalId: pro.id,
        serviceId: service.id,
        address: 'Random Address ' + i,
        date: new Date(new Date().getTime() + i * 24 * 60 * 60 * 1000), // Next few days
        timeSlot: '10:00-11:00',
        status: status,
        total: service.price + 50, // Just adding random extra
        commission: (service.price + 50) * 0.1,
        addOns: JSON.stringify([{ name: 'Extra', price: 50 }]),
      }
    });
  }

  // Create a few reviews and chats for completed bookings
  const completedBookings = await prisma.booking.findMany({ where: { status: 'COMPLETED' } });
  for (let i = 0; i < completedBookings.length; i++) {
    const b = completedBookings[i];
    await prisma.review.create({
      data: {
        userId: b.userId,
        bookingId: b.id,
        rating: 4 + (i % 2), // 4 or 5
        comment: 'Great service, highly recommended!',
      }
    });

    await prisma.chatMessage.create({
      data: {
        bookingId: b.id,
        senderId: b.userId,
        senderType: 'USER',
        content: 'Are you reaching soon?',
      }
    });
    
    if (b.professionalId) {
      await prisma.chatMessage.create({
        data: {
          bookingId: b.id,
          senderId: b.professionalId,
          senderType: 'PROFESSIONAL',
          content: 'Yes, I will be there in 10 minutes.',
        }
      });
    }
  }

  console.log('Seed completed successfully!');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => { 
    console.error(e); 
    await prisma.$disconnect(); 
    process.exit(1); 
  });
