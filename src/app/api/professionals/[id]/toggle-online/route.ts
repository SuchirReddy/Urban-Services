import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { isOnline } = await request.json();

    if (typeof isOnline !== 'boolean') {
      return NextResponse.json({ error: 'Missing or invalid isOnline field' }, { status: 400 });
    }

    const professional = await prisma.professional.update({
      where: { id: params.id },
      data: { isOnline }
    });

    return NextResponse.json({ isOnline: professional.isOnline });
  } catch (error) {
    console.error('Failed to toggle professional online status:', error);
    return NextResponse.json({ error: 'Failed to update online status' }, { status: 500 });
  }
}
