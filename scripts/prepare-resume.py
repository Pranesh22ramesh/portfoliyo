"""Generate the public résumé from confirmed portfolio information."""
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer

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
    Paragraph("Pranesh Ramesh", title),
    Paragraph("Software Systems · Full Stack Development", subtitle),
    Paragraph('<link href="mailto:praneshrsm@gmail.com">praneshrsm@gmail.com</link> · '
              '<link href="https://github.com/Pranesh22ramesh">GitHub</link> · '
              '<link href="https://www.linkedin.com/in/pranesh-ramesh-67a0a9246/">LinkedIn</link> · '
              '<link href="https://praneshportfolio.vercel.app/">Portfolio</link>', subtitle),
    Spacer(1, 5),
]
groups = {
    "EDUCATION": [
        "<b>M.Sc. Software Systems</b> · Kongu Engineering College, Perundurai · CGPA 7.18/10",
        "<b>Higher Secondary</b> · Bharani Park Matric Higher Secondary School · 2023",
    ],
    "EXPERIENCE": [
        "<b>Full Stack Developer Intern</b> · JAC MediaLand",
        "<b>Software Developer Intern</b> · Twincord",
    ],
    "SELECTED PROJECTS": [
        "<b>Certificate Generator</b> · Internship records, PDF certificate issuance and QR verification.",
        "<b>Bouquet Shop</b> · React storefront with catalog, cart and order management.",
        "<b>Rice Shop Notebook</b> · Mobile workflow for quantity calculations and collections.",
        "<b>Applied ML prototypes</b> · API anomaly detection and real time sign language recognition.",
    ],
    "TECHNICAL SKILLS": [
        "React, TypeScript, JavaScript, React Native, Expo, Node.js, Express, Python, Java, Django, MongoDB, SQL, Git, Docker, AWS, TensorFlow, OpenCV.",
    ],
    "CREDENTIALS &amp; LEADERSHIP": [
        "Oracle APEX Cloud Developer Certified Professional and Java Certified Foundations Associate. Cisco Cyber Threat Management and Introduction to Cybersecurity. Simplilearn Ethical Hacking 101.",
        "Department Association executive head and executive member in the Freelancer and ISTE clubs.",
        "Second place in paper presentation, Adithya Institute of Technology (2024). Third place at a Kongu Engineering College department hackathon.",
    ],
}
for label, paragraphs in groups.items():
    items.append(Paragraph(label, section))
    items.extend(Paragraph(p, body) for p in paragraphs)
SimpleDocTemplate(str(TARGET), pagesize=A4, leftMargin=46, rightMargin=46,
                  topMargin=41, bottomMargin=41, title="Pranesh Ramesh | Resume",
                  author="Pranesh Ramesh").build(items)
