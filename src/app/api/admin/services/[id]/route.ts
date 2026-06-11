import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const body = await request.json();
    const { name, description, price, duration, category } = body;

    const service = await prisma.service.update({
      where: { id: params.id },
      data: {
        name,
        description,
        price: Number(price),
        duration: Number(duration),
        category
      }
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error('Failed to update service:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}
