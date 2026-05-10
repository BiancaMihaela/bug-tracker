import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { sendCriticalBugNotification } from '@/lib/sendgrid';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const priority = searchParams.get('priority');
  const status = searchParams.get('status');

  const filter = {};
  if (priority) filter.priority = priority;
  if (status) filter.status = status;

  const bugs = await getCollection('bugs');
  const all = await bugs.find(filter).sort({ createdAt: -1 }).toArray();
  return NextResponse.json(all);
}

export async function POST(request) {
  const body = await request.json();

  const bug = {
    title: body.title,
    description: body.description,
    priority: body.priority || 'medium',
    status: 'open',
    reporterEmail: body.reporterEmail,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const bugs = await getCollection('bugs');
  const { insertedId } = await bugs.insertOne(bug);

  const createdBug = { _id: insertedId, ...bug };

  if (bug.priority === 'critical' || bug.priority === 'high') {
    await sendCriticalBugNotification(createdBug);
  }

  return NextResponse.json(createdBug, { status: 201 });
}
