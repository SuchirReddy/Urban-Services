import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, category, description, price, duration, imageUrl } = data;

    if (!name || !category || !description || !price || !duration || !imageUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const service = await prisma.service.create({
      data: {
        name,
        category,
        description,
        price: parseFloat(price),
        duration: parseInt(duration, 10),
        imageUrl
      }
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
