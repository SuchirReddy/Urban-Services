const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const user = await prisma.user.findFirst();
  const service = await prisma.service.findFirst();
  
  if (!user || !service) {
    console.log("Missing user or service");
    return;
  }
  
  console.log(`User: ${user.id}`);
  console.log(`Service: ${service.id}`);
  
  const payload = {
    userId: user.id,
    serviceId: service.id,
    address: "123 Test",
    date: "2026-06-12",
    timeSlot: "09:00 AM",
    total: 500,
    addOns: []
  };
  
  console.log("Sending payload:", payload);
  
  const fetch = (await import('node-fetch')).default;
  const res = await fetch('http://localhost:3000/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Response:", text);
}
run();
