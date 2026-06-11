import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const professionals = await prisma.professional.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return NextResponse.json(professionals);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch professionals' }, { status: 500 });
  }
}
