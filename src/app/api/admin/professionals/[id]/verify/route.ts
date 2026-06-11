import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { isVerified } = await request.json();

    if (typeof isVerified !== 'boolean') {
      return NextResponse.json({ error: 'Missing isVerified field' }, { status: 400 });
    }

    const professional = await prisma.professional.update({
      where: { id: params.id },
      data: { isVerified }
    });

    return NextResponse.json({ isVerified: professional.isVerified });
  } catch (error) {
    console.error('Failed to verify professional:', error);
    return NextResponse.json({ error: 'Failed to verify professional' }, { status: 500 });
  }
}
