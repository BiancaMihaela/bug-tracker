import sgMail from '@sendgrid/mail';

function getClient() {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  return sgMail;
}

export async function sendCriticalBugNotification(bug) {
  const client = getClient();
  const msg = {
    to: process.env.ADMIN_EMAIL,
    from: process.env.SENDGRID_FROM_EMAIL,
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
    console.log('[SendGrid] Sending critical bug notification to:', process.env.ADMIN_EMAIL);
    const response = await client.send(msg);
    console.log('[SendGrid] Critical bug email sent successfully. Status:', response[0].statusCode);
    return { success: true };
  } catch (error) {
    console.error('[SendGrid] Error sending critical bug email:', error?.response?.body || error.message || error);
    return { success: false, error };
  }
}

export async function sendStatusChangeNotification(bug, oldStatus, newStatus) {
  if (!bug.reporterEmail) return { success: false, error: 'No reporter email' };

  const client = getClient();
  const msg = {
    to: bug.reporterEmail,
    from: process.env.SENDGRID_FROM_EMAIL,
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
    console.log('[SendGrid] Sending status change notification to:', bug.reporterEmail);
    console.log('[SendGrid] Status change:', oldStatus, '→', newStatus);
    const response = await client.send(msg);
    console.log('[SendGrid] Status change email sent successfully. Status:', response[0].statusCode);
    return { success: true };
  } catch (error) {
    console.error('[SendGrid] Error sending status change email:', error?.response?.body || error.message || error);
    return { success: false, error };
  }
}
