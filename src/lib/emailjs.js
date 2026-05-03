import emailjs from "@emailjs/browser";

export const EMAILJS_SERVICE_ID = "service_495lwzh";
export const EMAILJS_PUBLIC_KEY = "aWaqjDLnfg-2ENw50";
export const EMAILJS_WELCOME_TEMPLATE_ID = "template_auhxdl2";
export const EMAILJS_CONTACT_TEMPLATE_ID = "template_n7r4wv4";

export function sendEmail(templateId, params) {
  return emailjs.send(
    EMAILJS_SERVICE_ID,
    templateId,
    params,
    EMAILJS_PUBLIC_KEY
  );
}

export function sendWelcomeEmail({ name, email }) {
  return sendEmail(EMAILJS_WELCOME_TEMPLATE_ID, {
    name,
    user_name: name,
    to_name: name,
    email,
    user_email: email,
    to_email: email,
  });
}

export function sendContactEmail({ name, email, title, message }) {
  return sendEmail(EMAILJS_CONTACT_TEMPLATE_ID, {
    name,
    user_name: name,
    from_name: name,
    email,
    user_email: email,
    from_email: email,
    title,
    subject: title,
    message,
  });
}
