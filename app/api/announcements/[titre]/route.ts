import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { titre: string } }
) {
  try {
    const titre = decodeURIComponent(params.titre);
    
    // Convert URL slug back to title format for search
    const searchTitle = titre.replace(/-/g, ' ');
    
    const missions = await sql`
      SELECT 
        m.id,
        m.title,
        m.specialty_required as specialty,
        m.location,
        m.description,
        m.created_at as posted_date,
        m.start_date,
        m.end_date,
        m.mission_type,
        'offer' as type,
        'medium' as urgency
      FROM missions m
      WHERE LOWER(m.title) LIKE LOWER(${`%${searchTitle}%`})
      AND m.status = 'open'
      LIMIT 1
    `;

    if (missions.length === 0) {
      return NextResponse.json(
        { error: 'Announcement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      announcement: missions[0],
      success: true
    });
  } catch (error) {
    console.error('Error fetching announcement:', error);
    return NextResponse.json(
      { error: 'Failed to fetch announcement' },
      { status: 500 }
    );
  }
}
