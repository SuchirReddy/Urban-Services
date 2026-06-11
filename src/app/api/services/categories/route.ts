import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.service.findMany({
      distinct: ['category'],
      select: {
        category: true,
      },
    });
    return NextResponse.json(categories.map(c => c.category));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
