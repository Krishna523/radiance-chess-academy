// /api/hiring-application.js
//
// Vercel serverless function. Receives the Coach Hiring form data from the
// React app and sends it via Zoho ZeptoMail. All ZeptoMail credentials come
// from environment variables set in the Vercel dashboard -- NEVER hardcode
// the token here, and never call ZeptoMail from the browser directly.

import { SendMailClient } from 'zeptomail';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const {
        firstName,
        lastName,
        phone,
        email,
        fideProfile,
        address,
        city,
        state,
        country,
        coachProfile
    } = req.body || {};

    // Basic required-field validation (mirrors the `required` attributes on the form)
    const required = { firstName, lastName, phone, email, address, city, state, country, coachProfile };
    const missing = Object.entries(required)
        .filter(([, value]) => !value || !String(value).trim())
        .map(([key]) => key);

    if (missing.length > 0) {
        return res.status(400).json({ error: `Missing required field(s): ${missing.join(', ')}` });
    }

    const {
        ZEPTOMAIL_URL,
        ZEPTOMAIL_TOKEN,
        ZEPTOMAIL_TEMPLATE_KEY,
        ZEPTOMAIL_FROM_EMAIL,
        ZEPTOMAIL_FROM_NAME,
        HIRING_NOTIFY_EMAIL,
        HIRING_NOTIFY_NAME
    } = process.env;

    if (!ZEPTOMAIL_URL || !ZEPTOMAIL_TOKEN || !ZEPTOMAIL_TEMPLATE_KEY || !ZEPTOMAIL_FROM_EMAIL || !HIRING_NOTIFY_EMAIL) {
        console.error('Missing ZeptoMail environment configuration');
        return res.status(500).json({ error: 'Email service is not configured' });
    }

    try {
        const client = new SendMailClient({ url: ZEPTOMAIL_URL, token: ZEPTOMAIL_TOKEN });

        await client.sendMailWithTemplate({
            template_key: ZEPTOMAIL_TEMPLATE_KEY,
            from: {
                address: ZEPTOMAIL_FROM_EMAIL,
                name: ZEPTOMAIL_FROM_NAME || 'Radiance Chess Academy'
            },
            to: [
                {
                    email_address: {
                        address: HIRING_NOTIFY_EMAIL,
                        name: HIRING_NOTIFY_NAME || 'Radiance Admin'
                    }
                }
            ],
            merge_info: {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                phone: phone.trim(),
                email: email.trim(),
                fideProfile: (fideProfile && fideProfile.trim()) || 'Not provided',
                address: address.trim(),
                city: city.trim(),
                state: state.trim(),
                country: country.trim(),
                coachProfile: coachProfile.trim()
            }
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('ZeptoMail send failed:', error);
        return res.status(502).json({ error: 'Failed to send application email' });
    }
};