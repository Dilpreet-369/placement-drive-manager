import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const drives = await prisma.placementDrive.findMany({
      orderBy: {
        driveDate: 'asc',
      },
    });

    return NextResponse.json(drives, { status: 200 });
  } catch (error) {
    console.error('Error fetching drives:', error);
    return NextResponse.json(
      { error: 'Failed to fetch placement drives from the database.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { companyName, jobRole, driveDate, eligibleBranches } = body;

    // 1. Input Validation
    if (!companyName || typeof companyName !== 'string' || !companyName.trim()) {
      return NextResponse.json(
        { error: 'Company Name is required.' },
        { status: 400 }
      );
    }

    if (!jobRole || typeof jobRole !== 'string' || !jobRole.trim()) {
      return NextResponse.json(
        { error: 'Job Role is required.' },
        { status: 400 }
      );
    }

    if (!driveDate || isNaN(Date.parse(driveDate))) {
      return NextResponse.json(
        { error: 'A valid Drive Date is required.' },
        { status: 400 }
      );
    }

    if (!Array.isArray(eligibleBranches) || eligibleBranches.length === 0) {
      return NextResponse.json(
        { error: 'At least one eligible branch must be selected.' },
        { status: 400 }
      );
    }

    // 2. Insert Record into PostgreSQL via Prisma
    const newDrive = await prisma.placementDrive.create({
      data: {
        companyName: companyName.trim(),
        jobRole: jobRole.trim(),
        driveDate: new Date(driveDate),
        eligibleBranches: eligibleBranches,
      },
    });

    // 3. Return Created Object with HTTP 201 Created Status
    return NextResponse.json(newDrive, { status: 201 });
  } catch (error) {
    console.error('Error creating drive:', error);
    return NextResponse.json(
      { error: 'Failed to save placement drive to the database.' },
      { status: 500 }
    );
  }
}