import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const fromEmail = process.env.SENDGRID_FROM_EMAIL;
const adminEmail = process.env.ADMIN_EMAIL;

export async function sendCriticalBugNotification(bug) {
  const msg = {
    to: adminEmail,
    from: fromEmail,
    subject: `[CRITICAL] New ${bug.priority} priority bug: ${bug.title}`,
    html: `
      <h2>New ${bug.priority} priority bug reported</h2>
      <p><strong>Title:</strong> ${bug.title}</p>
      <p><strong>Description:</strong> ${bug.description}</p>
      <p><strong>Priority:</strong> ${bug.priority}</p>
      <p><strong>Reporter:</strong> ${bug.reporterEmail}</p>
      <p><strong>Created:</strong> ${bug.createdAt}</p>
    `,
  };

  try {
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error('SendGrid error:', error);
    return { success: false, error };
  }
}

export async function sendStatusChangeNotification(bug, oldStatus, newStatus) {
  if (!bug.reporterEmail) return { success: false, error: 'No reporter email' };

  const msg = {
    to: bug.reporterEmail,
    from: fromEmail,
    subject: `Bug status updated: ${bug.title}`,
    html: `
      <h2>Bug Status Update</h2>
      <p><strong>Title:</strong> ${bug.title}</p>
      <p><strong>Status changed:</strong> ${oldStatus} → ${newStatus}</p>
      <p><strong>Priority:</strong> ${bug.priority}</p>
      <p><strong>Description:</strong> ${bug.description}</p>
    `,
  };

  try {
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error('SendGrid error:', error);
    return { success: false, error };
  }
}
