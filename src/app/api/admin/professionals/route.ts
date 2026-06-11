import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const professionals = await prisma.professional.findMany({
      include: {
        services: { select: { name: true } },
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(professionals);
  } catch (error) {
    console.error('Failed to fetch admin professionals:', error);
    return NextResponse.json({ error: 'Failed to fetch admin professionals' }, { status: 500 });
  }
}
