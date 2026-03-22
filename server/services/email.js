const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const CONFIRM_SECRET = process.env.JWT_CONFIRM_SECRET || 'confirm-secret-change-me';
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3001';

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function generateConfirmToken(crewId, projectId) {
  return jwt.sign({ crewId, projectId }, CONFIRM_SECRET, { expiresIn: '7d' });
}

function verifyConfirmToken(token) {
  return jwt.verify(token, CONFIRM_SECRET);
}

async function sendCrewAssignmentEmail({ crew, project, assignment }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('[Email skipped] SMTP not configured');
    return;
  }
  const transport = createTransport();
  const token = generateConfirmToken(crew.id, project.id);
  const confirmUrl = `${SERVER_URL}/api/portal/confirm/${token}?action=confirm`;
  const declineUrl = `${SERVER_URL}/api/portal/confirm/${token}?action=decline`;

  const locationLine = project.is_shoot && project.shoot_location
    ? `<p><strong>Location:</strong> ${project.shoot_location}${project.shoot_address ? ', ' + project.shoot_address : ''}</p>`
    : '';

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
      <h2>You've been booked for a project</h2>
      <p>Hi ${crew.name},</p>
      <p>You've been assigned to the following project:</p>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:6px 0"><strong>Project:</strong></td><td>${project.name}</td></tr>
        <tr><td style="padding:6px 0"><strong>Role:</strong></td><td>${assignment.role_on_project || '—'}</td></tr>
        <tr><td style="padding:6px 0"><strong>Dates:</strong></td><td>${project.start_date || '—'} ${project.end_date ? '→ ' + project.end_date : ''}</td></tr>
        ${project.is_shoot ? `<tr><td style="padding:6px 0"><strong>Shoot location:</strong></td><td>${project.shoot_location || '—'}${project.shoot_address ? '<br>' + project.shoot_address : ''}</td></tr>` : ''}
        <tr><td style="padding:6px 0"><strong>Day rate:</strong></td><td>$${assignment.day_rate || 0}</td></tr>
      </table>
      <br>
      <p>Please confirm your availability:</p>
      <p>
        <a href="${confirmUrl}" style="background:#16a34a;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;margin-right:12px">✓ Confirm</a>
        <a href="${declineUrl}" style="background:#dc2626;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none">✗ Decline</a>
      </p>
      <p style="color:#666;font-size:13px;margin-top:24px">This link expires in 7 days.</p>
    </div>
  `;

  await transport.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: crew.email,
    subject: `Booking: ${project.name}`,
    html,
  });
}

async function sendEventAssignmentEmail({ crew, event }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('[Email skipped] SMTP not configured');
    return;
  }
  const transport = createTransport();
  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
      <h2>You've been added to an event</h2>
      <p>Hi ${crew.name},</p>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:6px 0"><strong>Event:</strong></td><td>${event.title}</td></tr>
        <tr><td style="padding:6px 0"><strong>Date/Time:</strong></td><td>${event.start_datetime}</td></tr>
        ${event.call_time ? `<tr><td style="padding:6px 0"><strong>Call time:</strong></td><td>${event.call_time}</td></tr>` : ''}
        ${event.location ? `<tr><td style="padding:6px 0"><strong>Location:</strong></td><td>${event.location}${event.address ? ', ' + event.address : ''}</td></tr>` : ''}
        ${event.parking_notes ? `<tr><td style="padding:6px 0"><strong>Parking:</strong></td><td>${event.parking_notes}</td></tr>` : ''}
      </table>
      <p style="color:#666;font-size:13px;margin-top:24px">Log into the crew portal for more details.</p>
    </div>
  `;
  await transport.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: crew.email,
    subject: `Event: ${event.title}`,
    html,
  });
}

async function sendInvoiceEmail({ client, invoice, project }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('[Email skipped] SMTP not configured');
    return;
  }
  const transport = createTransport();
  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
      <h2>Invoice ${invoice.invoice_number}</h2>
      <p>Hi ${client.name},</p>
      <p>Please find your invoice details below:</p>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:6px 0"><strong>Invoice #:</strong></td><td>${invoice.invoice_number}</td></tr>
        ${project ? `<tr><td style="padding:6px 0"><strong>Project:</strong></td><td>${project.name}</td></tr>` : ''}
        <tr><td style="padding:6px 0"><strong>Amount:</strong></td><td>$${invoice.amount}</td></tr>
        <tr><td style="padding:6px 0"><strong>Due date:</strong></td><td>${invoice.due_date || '—'}</td></tr>
      </table>
      ${invoice.notes ? `<p>${invoice.notes}</p>` : ''}
    </div>
  `;
  await transport.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: client.email,
    subject: `Invoice ${invoice.invoice_number}`,
    html,
  });
}

module.exports = {
  sendCrewAssignmentEmail,
  sendEventAssignmentEmail,
  sendInvoiceEmail,
  generateConfirmToken,
  verifyConfirmToken,
};
