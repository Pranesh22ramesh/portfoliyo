"""Generate the public Resume from the supplied Resume and portfolio records."""
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "public" / "resume.pdf"
INK = colors.HexColor("#152831")
MUTED = colors.HexColor("#3e555d")
ACCENT = colors.HexColor("#286655")

title = ParagraphStyle("Name", fontName="Helvetica-Bold", fontSize=29, leading=34, textColor=INK)
subtitle = ParagraphStyle("Subtitle", fontName="Helvetica", fontSize=11, leading=16, textColor=MUTED)
section = ParagraphStyle("Section", fontName="Helvetica-Bold", fontSize=10, leading=14, textColor=ACCENT, spaceBefore=13, spaceAfter=3)
body = ParagraphStyle("Body", fontName="Helvetica", fontSize=10, leading=15, textColor=INK, spaceAfter=5)

items = [
    Paragraph("Pranesh B R", title),
    Paragraph("Full Stack Developer | MERN | AI/ML | Cloud &amp; DevOps", subtitle),
    Paragraph('Karur, Tamil Nadu, India · <link href="mailto:praneshrsm@gmail.com">praneshrsm@gmail.com</link> · '
              '<link href="https://github.com/Pranesh22ramesh">GitHub</link> · '
              '<link href="https://www.linkedin.com/in/pranesh-ramesh-67a0a9246/">LinkedIn</link> · '
              '<link href="https://praneshportfolio.vercel.app/">Portfolio</link>', subtitle),
    Spacer(1, 5),
]
groups = {
    "SUMMARY": [
        "Full stack developer and M.Sc. Software Systems student with more than two years of experience building web applications, machine learning systems and cloud software. Focused on MERN, Python and REST APIs, with working knowledge of AWS, Docker and CI/CD.",
    ],
    "EXPERIENCE": [
        "<b>IGBC Domain Expert &amp; Sustainability Assessor and AI Knowledge Engineer</b> · Current. Work in sustainability assessment for the Indian Green Building Council (IGBC) and in AI knowledge engineering.",
        "<b>Past internships:</b> Full Stack Developer Intern, JAC MediaLand (2026). Software Developer Intern, Twincord.",
    ],
    "TECHNICAL SKILLS": [
        "<b>Languages:</b> Python, JavaScript, TypeScript, Java, C, C++, PHP.",
        "<b>Frontend and mobile:</b> React, Next.js, React Native, Expo, Tailwind CSS, Bootstrap, HTML5, CSS3.",
        "<b>Backend and data:</b> Node.js, Express, Django, REST, JWT, MongoDB, MySQL, Firebase.",
        "<b>Cloud and DevOps:</b> AWS EC2, S3, RDS, Docker, Jenkins, GitHub Actions, CI/CD.",
        "<b>AI/ML:</b> TensorFlow, OpenCV, LSTM, Autoencoders, Random Forest, XGBoost, GraphCodeBERT, SHAP, Gemini API, Streamlit.",
        "<b>Testing and tools:</b> Selenium, API testing, Postman, Wireshark, Git, GitHub, VS Code, Figma, Jira, Oracle APEX, Agile/Scrum.",
    ],
    "SELECTED PROJECTS": [
        "<b>ForensIQ</b> · Smart India Hackathon 2025 MVP for DVR/NVR forensic analysis. Covers more than 12 stages and supports eight vendors. Uses React, TypeScript, Node.js and Gemini, with evidence integrity checks, synchronized timelines and PDF/DOCX exports.",
        "<b>Bouquet Shop</b> · MERN storefront with catalog, checkout and order tracking. Added a GPT-powered support chatbot and a dashboard for inventory, orders and sales.",
        "<b>Certificate Generator</b> · MERN platform for intern records, QR verification and PDF certificates. Automated email with Nodemailer, with an estimated 80% reduction in processing time.",
    ],
    "ADDITIONAL PROJECTS": [
        "<b>API Downtime Analyzer</b> · Python monitoring with LSTM and autoencoders, plus real-time alerts. Reported prediction accuracy was approximately 90%.",
        "<b>Rice Amount Calculation App</b> · Expo mobile app with JWT, SMS codes and PDF reports. Reported outcomes include 95% fewer manual calculation errors and over two hours saved per day.",
        "<b>Sign Language Translator</b> · Live recognition for more than 20 gestures and emotion detection with TensorFlow, OpenCV, Django REST and Streamlit.",
        "<b>Explainable Software Defect Prediction</b> · Ongoing M.Sc. final project evaluating GraphCodeBERT against CNN and BiLSTM baselines with SHAP on Java, Python and C/C++ datasets.",
    ],
    "RESEARCH": [
        "<b>Multi-Version Package Risk Aggregation with Heterogeneous Ensemble Learning for Malicious npm and PyPI Package Detection</b> · IEEE-format manuscript using Random Forest and XGBoost ensembles.",
    ],
    "EDUCATION": [
        "<b>M.Sc. Software Systems</b> · Kongu Engineering College, Perundurai · 2023-Present · CGPA 7.12/10. Coursework includes data structures, cloud computing, machine learning, web technologies, software testing and database management.",
        "<b>Higher Secondary Certificate</b> · Bharani Park Matriculation Higher Secondary School, Karur · 2023.",
    ],
    "CERTIFICATIONS AND TRAINING": [
        "Oracle APEX Cloud Developer Certified Professional and Java Certified Foundations Associate. Cisco Cyber Threat Management and Introduction to Cybersecurity. Simplilearn Ethical Hacking 101.",
        "NASSCOM FutureSkills training in testing tools, Selenium and API testing. Data Structures Using Java. NPTEL AI in Human Resource Management and Infosys Springboard JavaScript.",
    ],
    "ACHIEVEMENTS AND LEADERSHIP": [
        "Third place at Hackwave 3.0.1 among more than 50 teams. Participated in Smart India Hackathon 2025 with ForensIQ. Received industry panel recognition for a practical AI/ML project. Second place in paper presentation at Adithya Institute of Technology (2024).",
        "Department association executive head, Freelancer and ISTE club executive member, and group project lead.",
    ],
    "LANGUAGES AND AVAILABILITY": [
        "Tamil (native), English (professional proficiency). Available immediately for on-site roles in Tamil Nadu or remote and hybrid roles across India.",
    ],
}
for label, paragraphs in groups.items():
    if label == "ADDITIONAL PROJECTS":
        items.append(PageBreak())
    items.append(Paragraph(label, section))
    items.extend(Paragraph(p, body) for p in paragraphs)
SimpleDocTemplate(str(TARGET), pagesize=A4, leftMargin=46, rightMargin=46,
                  topMargin=41, bottomMargin=41, title="Pranesh B R | Resume",
                  author="Pranesh B R").build(items)
