'use server';

export async function sendContactEmail(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  // Real production apps would use Resend, SendGrid, or nodemailer here.
  // We'll mock the delay to show the loading states in the premium UI.
  
  console.log('--- New Contact Form Submission ---');
  console.log('Name:', name);
  console.log('Email:', email);
  console.log('Message:', message);
  console.log('-----------------------------------');

  await new Promise((resolve) => setTimeout(resolve, 2000));

  return {
    success: true,
    message: "Thank you! Pranesh will get back to you soon.",
  };
}
