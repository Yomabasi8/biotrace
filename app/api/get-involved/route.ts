import nodemailer from "nodemailer";
import {
  AVAILABILITY,
  BACKGROUNDS,
  CV_MAX_BYTES,
  CV_TYPES,
  FOCUS_AREAS,
  INTERESTS,
  ORG_TYPES,
} from "@/lib/get-involved";

export const runtime = "nodejs";

const TO = "biotraceglobal@gmail.com";

/*
 * Receives the Get Involved form and emails it, CV attached, to BioTrace.
 * Sends through the BioTrace Gmail account over SMTP. Required environment variables
 * (set them in Vercel → Project → Settings → Environment Variables, and in .env.local to test locally):
 *   GMAIL_USER          biotraceglobal@gmail.com
 *   GMAIL_APP_PASSWORD  a 16-character Google "App password" (not the normal account password)
 */
export async function POST(request: Request) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    console.error("Get Involved form: GMAIL_USER / GMAIL_APP_PASSWORD are not set");
    return Response.json(
      { error: "The form isn't connected to email yet. Please write to us at biotraceglobal@gmail.com." },
      { status: 503 },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "We couldn't read your submission. Please try again." }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill this field
  if (String(form.get("company_website") ?? "").trim()) return Response.json({ ok: true });

  const text = (key: string, max = 300) => String(form.get(key) ?? "").trim().slice(0, max);
  const interest = text("interest");
  const name = text("name", 120);
  const email = text("email", 200);
  const phone = text("phone", 40);
  const location = text("location", 120);
  const background = text("background", 80);
  const organisation = text("organisation", 160);
  const orgType = text("orgType", 80);
  const role = text("role", 120);
  const availability = text("availability", 80);
  const link = text("link", 300);
  const message = text("message", 5000);
  const areas = form.getAll("areas").map(String).filter((a) => (FOCUS_AREAS as readonly string[]).includes(a));
  const consent = form.get("consent") === "on";

  const errors: string[] = [];
  const interestDef = INTERESTS.find((i) => i.id === interest);
  if (!interestDef) errors.push("Choose how you'd like to get involved.");
  if (name.length < 2) errors.push("Enter your full name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Enter a valid email address.");
  if (phone.replace(/\D/g, "").length < 7) errors.push("Enter a valid phone number.");
  if (!location) errors.push("Enter your country or city.");
  if (background && !(BACKGROUNDS as readonly string[]).includes(background)) errors.push("Choose a valid background.");
  if (interest === "partner" && !organisation) errors.push("Enter your organisation's name.");
  if (orgType && !(ORG_TYPES as readonly string[]).includes(orgType)) errors.push("Choose a valid organisation type.");
  if (availability && !(AVAILABILITY as readonly string[]).includes(availability)) errors.push("Choose a valid availability.");
  if (message.length < 20) errors.push("Tell us a little more in your message (at least 20 characters).");
  if (!consent) errors.push("Please agree to be contacted about your submission.");

  const cv = form.get("cv");
  let attachment: { filename: string; content: Buffer; contentType: string } | undefined;
  if (cv instanceof File && cv.size > 0) {
    if (cv.size > CV_MAX_BYTES) errors.push("Your CV must be 4 MB or smaller.");
    else if (!(cv.type in CV_TYPES)) errors.push("Your CV must be a PDF, DOC, or DOCX file.");
    else
      attachment = {
        filename: cv.name.replace(/[^\w.\- ]+/g, "_").slice(0, 120) || "cv",
        content: Buffer.from(await cv.arrayBuffer()),
        contentType: cv.type,
      };
  }

  if (errors.length) return Response.json({ error: errors[0], errors }, { status: 400 });

  const rows: [string, string][] = [
    ["Interested in", interestDef!.label],
    ["Name", name],
    ["Email", email],
    ["Phone", phone],
    ["Location", location],
    ["Background", background],
    ["Organisation", organisation],
    ["Organisation type", orgType],
    ["Role / title", role],
    ["Availability", availability],
    ["Areas of interest", areas.join(", ")],
    ["LinkedIn / website", link],
    ["CV", attachment ? `Attached (${attachment.filename})` : "Not provided"],
  ];
  const filled = rows.filter(([, v]) => v);

  const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;color:#060606;max-width:640px">
      <h2 style="margin:0 0 4px;color:#196180">New Get Involved submission</h2>
      <p style="margin:0 0 20px;color:#363636">${esc(interestDef!.label)} enquiry from <strong>${esc(name)}</strong></p>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        ${filled
          .map(
            ([k, v]) =>
              `<tr><td style="padding:8px 12px;background:#eef3f6;font-weight:600;width:170px;vertical-align:top">${esc(k)}</td><td style="padding:8px 12px;border-bottom:1px solid #eef3f6">${esc(v)}</td></tr>`,
          )
          .join("")}
      </table>
      <h3 style="margin:24px 0 8px;font-size:15px">Message</h3>
      <p style="white-space:pre-wrap;line-height:1.6;margin:0;padding:14px;background:#f7f9fa;border-radius:8px">${esc(message)}</p>
      <p style="margin-top:24px;font-size:12px;color:#888">Reply to this email to respond directly to ${esc(name)}.</p>
    </div>`;
  const plain = `${filled.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nMessage:\n${message}`;

  try {
    const transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
    await transporter.sendMail({
      from: `"BioTrace Website" <${user}>`,
      to: TO,
      replyTo: { name, address: email },
      subject: `[Get Involved] ${interestDef!.label}: ${name}${organisation ? ` (${organisation})` : ""}`,
      text: plain,
      html,
      attachments: attachment ? [attachment] : undefined,
    });
  } catch (err) {
    console.error("Get Involved form: sending failed", err);
    return Response.json(
      { error: "We couldn't send your submission just now. Please try again, or email biotraceglobal@gmail.com." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
