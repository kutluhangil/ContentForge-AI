import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: conversion, error } = await supabase
      .from('conversions')
      .select('*, outputs(*)')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !conversion) {
      return NextResponse.json({ error: 'Conversion not found' }, { status: 404 });
    }

    return NextResponse.json(conversion);
  } catch (err) {
    console.error('[api/repurpose/[id]] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
