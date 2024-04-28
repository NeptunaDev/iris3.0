// Import dependences
import { NextResponse } from "next/server";

export async function POST() {
  try {
    return NextResponse.json({ data: 'results' }, { status: 201 });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
