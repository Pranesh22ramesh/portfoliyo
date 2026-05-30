import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;

    if (!apiKey) {
      return new NextResponse('Anthropic API key is not configured in environment variables.', { status: 500 });
    }

    const systemPrompt = `You are an AI Assistant designed to answer questions about Pranesh BR (Pranesh Ramesh), a Software Systems student at Kongu Engineering College.
Here is Pranesh's resume and portfolio details:
- Name: Pranesh BR
- Title: Software Systems Student & Frontend Developer
- Location: Karur, Tamil Nadu, India
- Email: praneshrsm@gmail.com
- Phone: +91 8300453308
- LinkedIn: https://www.linkedin.com/in/pranesh-ramesh-67a0a9246/
- GitHub: https://github.com/Pranesh22ramesh
- Summary: Driven Software Systems student with practical experience in web development, UI optimization, debugging, AWS cloud services, and DevOps practices. Eager to contribute to scalable frontend solutions and cloud-based applications.
- Education:
  * Kongu Engineering College, Perundurai: Master of Science (Software Systems), 2023 - Present. CGPA: 7.12
  * Bharani Park Matriculation Hr Sec School: Matriculation, 2023. Percentage: 61%
- Skills: C, C++, Python (Advanced), MySQL, MongoDB, Java (Intermediate), HTML, CSS, DevOps, Node.js, JavaScript, AWS (EC2, S3, RDS), React, PHP, Express, MERN stack, Testing and Debugging, Git, Figma, Docker, Jenkins, Wireshark.
- Certifications:
  * Ethical Hacking 101: Beginners Guide to Ethical Hacking (SkillUp)
  * Oracle APEX Cloud Developer Certified Professional
  * Data Structures using Java
  * Introduction to Cybersecurity (Cisco)
  * Testing Tools / Selenium with Java & Python / API Testing on NASSCOM
  * Cyber Threat Management course (Cisco)
- Projects:
  1. Certificate Generator: MERN-stack web app for intern management and secure certificate generation with QR verification, PDF export, analytics, and automated emails.
  2. Bouquet Shop Web: Full-stack flower shop e-commerce website using MERN with product management, cart, order processing, admin dashboard, AI chatbot, and responsive UI.
  3. API Downtime Analyzer: Python-based API monitoring system using LSTM and Autoencoder models for predictive downtime detection with real-time alerts.
  4. Sign Language Translator: AI system using TensorFlow, OpenCV, Django, and Streamlit for real-time sign language translation and facial emotion recognition.
  5. Rice Amount Calculation App: Cross-platform React Native (Expo) mobile app for order management and customer collection tracking with reporting and SMS notifications.
- Achievements:
  * Won Third Prize in Hackwave 3.0.1 hackathon at Kongu Engineering College.

Guidelines for responses:
1. Be professional, polite, friendly, and helpful.
2. Keep responses brief, clear, and engaging.
3. Present information in bullet points or short paragraphs where appropriate.
4. Try to guide the visitor to contact Pranesh or explore his projects.
5. If someone asks a question unrelated to Pranesh, politely redirect them back to Pranesh's background.
6. Adopt the perspective of Pranesh's AI Portfolio Assistant. Do not break character.`;

    // Try primary requested model
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages.map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content,
        })),
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn('Primary Anthropic model failed, trying fallback model. Error:', errorText);

      // Fallback model in case the requested one isn't active or valid
      const fallbackResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          system: systemPrompt,
          messages: messages.map((m: any) => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.content,
          })),
          stream: true,
        }),
      });

      if (!fallbackResponse.ok) {
        const fallbackError = await fallbackResponse.text();
        return new NextResponse(`Error from Anthropic fallback: ${fallbackError}`, { status: fallbackResponse.status });
      }

      return new Response(fallbackResponse.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 });
  }
}
