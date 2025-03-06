import nodemailer from "nodemailer";

// Configuration du transporteur d'email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
  secure: process.env.EMAIL_SERVER_SECURE === "true",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

// Interface pour les options d'email
interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Fonction pour envoyer un email
export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || "Immo App"}" <${
        process.env.EMAIL_FROM || "noreply@immoapp.com"
      }>`,
      to,
      subject,
      html,
    });

    console.log(`Email envoyé: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    return { success: false, error };
  }
}

// Fonction pour générer un token de vérification
export function generateVerificationToken(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// Fonction pour créer un email de vérification
export function createVerificationEmail(
  email: string,
  token: string
): SendEmailOptions {
  const verificationUrl = `${
    process.env.NEXTAUTH_URL
  }/auth/verify?token=${token}&email=${encodeURIComponent(email)}`;

  return {
    to: email,
    subject: "Vérification de votre adresse email",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Vérification de votre adresse email</h2>
        <p>Bonjour,</p>
        <p>Merci de vous être inscrit sur notre plateforme. Pour activer votre compte, veuillez cliquer sur le lien ci-dessous :</p>
        <p style="margin: 20px 0;">
          <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Vérifier mon adresse email
          </a>
        </p>
        <p>Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.</p>
        <p>Cordialement,<br>L'équipe Immo App</p>
      </div>
    `,
  };
}

// Fonction pour créer un email de changement d'adresse email
export function createEmailChangeVerification(
  newEmail: string,
  token: string
): SendEmailOptions {
  const verificationUrl = `${
    process.env.NEXTAUTH_URL
  }/auth/verify-email-change?token=${token}&email=${encodeURIComponent(
    newEmail
  )}`;

  return {
    to: newEmail,
    subject: "Confirmation de changement d'adresse email",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Confirmation de changement d'adresse email</h2>
        <p>Bonjour,</p>
        <p>Vous avez demandé à changer votre adresse email. Pour confirmer ce changement, veuillez cliquer sur le lien ci-dessous :</p>
        <p style="margin: 20px 0;">
          <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Confirmer le changement d'adresse email
          </a>
        </p>
        <p>Si vous n'avez pas demandé ce changement, vous pouvez ignorer cet email.</p>
        <p>Cordialement,<br>L'équipe Immo App</p>
      </div>
    `,
  };
}
