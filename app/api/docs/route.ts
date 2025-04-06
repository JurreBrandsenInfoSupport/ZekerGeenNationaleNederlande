import { NextResponse } from 'next/server';
import { getApiDocs } from '@/lib/openapi';

// GET: Return the OpenAPI documentation
export async function GET() {
  const spec = getApiDocs();
  return NextResponse.json(spec);
}
