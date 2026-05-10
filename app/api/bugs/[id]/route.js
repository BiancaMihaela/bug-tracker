import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getCollection } from '@/lib/mongodb';
import { sendStatusChangeNotification } from '@/lib/sendgrid';

function toObjectId(id) {
  if (!ObjectId.isValid(id)) return null;
  return new ObjectId(id);
}

export async function GET(request, { params }) {
  const { id } = await params;
  const _id = toObjectId(id);
  if (!_id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const bugs = await getCollection('bugs');
  const doc = await bugs.findOne({ _id });
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(doc);
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const _id = toObjectId(id);
  if (!_id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const body = await request.json();
  delete body._id;
  body.updatedAt = new Date().toISOString();

  const bugs = await getCollection('bugs');
  const existing = await bugs.findOne({ _id });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const oldStatus = existing.status;
  const newStatus = body.status || oldStatus;

  const updated = await bugs.findOneAndUpdate(
    { _id },
    { $set: body },
    { returnDocument: 'after' }
  );

  if (oldStatus !== newStatus) {
    await sendStatusChangeNotification(updated, oldStatus, newStatus);
  }

  return NextResponse.json(updated);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const _id = toObjectId(id);
  if (!_id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const bugs = await getCollection('bugs');
  const { deletedCount } = await bugs.deleteOne({ _id });
  if (deletedCount === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ deleted: id });
}
