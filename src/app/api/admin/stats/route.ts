import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [bookingsCount, usersCount, prosCount, completedBookings] = await Promise.all([
      prisma.booking.count(),
      prisma.user.count(),
      prisma.professional.count({ where: { isVerified: true } }),
      prisma.booking.findMany({ where: { status: 'COMPLETED' }, select: { total: true } })
    ]);

    const totalRevenue = completedBookings.reduce((sum, b) => sum + b.total, 0);

    return NextResponse.json({
      totalBookings: bookingsCount,
      totalCustomers: usersCount,
      activeProfessionals: prosCount,
      totalRevenue
    });
  } catch (error) {
    console.error('Failed to fetch admin stats:', error);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
