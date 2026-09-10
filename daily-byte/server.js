import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL || SMTP_USER;
const DEFAULT_TO = process.env.NEWSLETTER_TO || 'Ayushsinghramola02@gmail.com';
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || FROM_EMAIL || 'onboarding@resend.dev';
const subscribers = new Map();

const normalizeEmail = (value) => String(value || '').trim().toLowerCase();

const getSubscribers = () =>
  Array.from(subscribers.values()).sort(
    (a, b) => new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime(),
  );

const getRecipientList = (input, fallback = []) => {
  const rawList = Array.isArray(input)
    ? input
    : typeof input === 'string' && input.trim()
      ? [input]
      : [];

  const normalized = [...new Set(rawList.map(normalizeEmail).filter(Boolean))];
  return normalized.length ? normalized : fallback;
};

const buildHtmlBody = (preview, subject) => `
  <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; padding: 24px; color: #141210; background: #F7F5EF; border: 1px solid #D6D1C7;">
    <div style="font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: #8A8375; margin-bottom: 16px;">The Daily Byte</div>
    <h1 style="font-family: Georgia, serif; font-size: 34px; line-height: 1.1; margin: 0;">${subject}</h1>
    <p style="font-size: 16px; line-height: 1.6; color: #4A4640; margin-top: 18px;">${preview}</p>
    <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid #D6D1C7;">
      <p style="margin: 0; font-size: 14px; color: #8A8375;">Sent from the Daily Byte newsletter demo.</p>
    </div>
  </div>
`;

const buildConfirmationHtml = (email) => `
  <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; padding: 24px; color: #141210; background: #F7F5EF; border: 1px solid #D6D1C7;">
    <div style="font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: #8A8375; margin-bottom: 16px;">The Daily Byte</div>
    <h1 style="font-family: Georgia, serif; font-size: 34px; line-height: 1.1; margin: 0;">Welcome aboard</h1>
    <p style="font-size: 16px; line-height: 1.6; color: #4A4640; margin-top: 18px;">
      Thanks for subscribing, <strong>${email}</strong>.
    </p>
    <p style="font-size: 16px; line-height: 1.6; color: #4A4640; margin-top: 12px;">
      Your next edition will arrive in your inbox with the latest tech ideas, startup news, and thoughtful commentary.
    </p>
    <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid #D6D1C7;">
      <p style="margin: 0; font-size: 14px; color: #8A8375;">This email was sent from The Daily Byte.</p>
    </div>
  </div>
`;

const sendEmail = async ({ to, subject, text, html, fromEmail = RESEND_FROM_EMAIL }) => {
  const recipients = getRecipientList(to, []);

  if (!recipients.length) {
    throw new Error('No recipients were provided for this email.');
  }

  if (RESEND_API_KEY) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: recipients,
        subject,
        text,
        html,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data?.message || 'Failed to send email via Resend.');
    }

    return {
      provider: 'resend',
      recipients,
      data,
    };
  }

  if (SMTP_USER && SMTP_PASS) {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: FROM_EMAIL || SMTP_USER,
      to: recipients.join(', '),
      subject,
      text,
      html,
    });

    return {
      provider: 'smtp',
      recipients,
    };
  }

  console.log(`\n[demo-email] Email ready to send to ${recipients.join(', ')}`);
  console.log(`[demo-email] Subject: ${subject}`);
  console.log(`[demo-email] Preview: ${text || html}`);

  return {
    provider: 'demo',
    recipients,
  };
};

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'Daily Byte newsletter API is running.' });
});

app.get('/api/subscribers', (_req, res) => {
  const rows = getSubscribers();
  const active = rows.filter((subscriber) => subscriber.status === 'Active').length;
  const pending = rows.filter((subscriber) => subscriber.status === 'Pending').length;

  res.json({
    subscribers: rows,
    stats: {
      total: rows.length,
      active,
      pending,
    },
  });
});

app.post('/api/subscribe', async (req, res) => {
  const email = normalizeEmail(req.body?.email);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      error: 'Please provide a valid email address.',
    });
  }

  const existing = subscribers.get(email);
  if (existing) {
    return res.json({
      ok: true,
      message: `${email} is already subscribed.`,
      subscriber: existing,
    });
  }

  const subscriber = {
    email,
    status: 'Active',
    subscribedAt: new Date().toISOString(),
  };

  subscribers.set(email, subscriber);

  let emailDelivery = { provider: 'demo', recipients: [email] };

  try {
    emailDelivery = await sendEmail({
      to: [email],
      subject: 'Welcome to The Daily Byte',
      text: `Thanks for subscribing to The Daily Byte, ${email}. Your next issue will arrive in your inbox soon.`,
      html: buildConfirmationHtml(email),
    });
  } catch (emailError) {
    console.error('Subscription confirmation email failed:', emailError);
    emailDelivery = {
      provider: 'failed',
      recipients: [email],
      error: emailError.message,
    };
  }

  return res.json({
    ok: true,
    message: `${email} subscribed successfully.`,
    subscriber,
    emailDelivery,
  });
});

app.post('/api/send-newsletter', async (req, res) => {
  const { subject = 'Daily Byte Issue #043', preview = 'A test newsletter from Daily Byte.', html, to } = req.body || {};
  const recipients = getRecipientList(
    to,
    getSubscribers().map((subscriber) => subscriber.email),
  );

  const targetRecipients = recipients.length ? recipients : [DEFAULT_TO];

  try {
    const htmlBody = html || buildHtmlBody(preview, subject);
    const result = await sendEmail({
      to: targetRecipients,
      subject,
      text: preview,
      html: htmlBody,
    });

    return res.json({
      success: true,
      message: result.provider === 'demo'
        ? `Newsletter queued in demo mode for ${targetRecipients.join(', ')}.`
        : `Newsletter sent successfully to ${targetRecipients.join(', ')} via ${result.provider}.`,
      recipients: targetRecipients,
      emailDelivery: result,
    });
  } catch (error) {
    console.error('Newsletter send failed:', error);
    return res.status(500).json({
      error: error.message || 'Failed to send newsletter.',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Newsletter API running on http://localhost:${PORT}`);
});
