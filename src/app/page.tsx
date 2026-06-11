import { prisma } from '@/lib/prisma';
import HomePageClient from '@/components/HomePageClient';

export default async function Home() {
  const [servicesData, professionals, categoriesData] = await Promise.all([
    prisma.service.findMany({
      take: 6,
      include: {
        bookings: { include: { review: true } }
      }
    }),
    prisma.professional.findMany({
      take: 4,
      orderBy: { rating: 'desc' },
    }),
    prisma.service.findMany({
      distinct: ['category'],
      select: { category: true }
    })
  ]);

  const services = servicesData.map(s => {
    const reviews = s.bookings.map(b => b.review).filter(Boolean);
    const rating = reviews.length ? reviews.reduce((acc, r) => acc + (r?.rating || 0), 0) / reviews.length : 0;
    const { bookings, ...rest } = s;
    return { ...rest, rating };
  });

  const categories = categoriesData.map(c => c.category);

  return <HomePageClient services={services} professionals={professionals} categories={categories} />;
}
