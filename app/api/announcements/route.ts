import { NextResponse } from 'next/server'; 
import { sql } from '@/lib/database';

export async function GET() {
  try {
    const missions = await sql`
      SELECT 
        m.id,
        m.title,
        m.specialty_required as specialty,
        m.location,
        m.description,
        m.created_at as posted_date,
        m.mission_type,
        'offer' as type, 
        'medium' as urgency
      FROM missions m
      WHERE m.status = 'in_progress' 
      ORDER BY m.created_at DESC
    `;

    return NextResponse.json({
      announcements: missions,
      success: true
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
}

// POST: create a new mission (public submission)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      specialty, // frontend will send specialty -> maps to specialty_required
      location,
      start_date,
      end_date,
      mission_type
    } = body;

    // Basic validation
    if (!title || !description || !specialty || !location || !start_date || !end_date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert into missions (employer_id left NULL for public submissions)
    const inserted = await sql`
      INSERT INTO missions (employer_id, title, description, specialty_required, location, start_date, end_date, mission_type, status)
      VALUES (NULL, ${title}, ${description}, ${specialty}, ${location}, ${start_date}, ${end_date}, ${mission_type ?? 'replacement'}, 'open')
      RETURNING id, title, specialty_required as specialty, location, description, start_date, end_date, mission_type, status, created_at as posted_date
    `;

    if (!inserted || inserted.length === 0) {
      return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 });
    }

    return NextResponse.json({ announcement: inserted[0], success: true }, { status: 201 });
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 });
  }
}
