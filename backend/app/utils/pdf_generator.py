from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import BytesIO
from datetime import datetime

def generate_pdf(threats):
    """Generate a PDF report from a list of threats."""
    
    buffer = BytesIO()  # Create an in-memory buffer for the PDF
    pdf = canvas.Canvas(buffer, pagesize=letter)
    pdf.setTitle("Threat Report")

    # Title
    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawString(200, 750, "Threat Report")

    # Date of Report
    pdf.setFont("Helvetica", 10)
    pdf.drawString(400, 735, f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    # Column headers
    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawString(50, 700, "Title")
    pdf.drawString(200, 700, "Severity")
    pdf.drawString(300, 700, "Type")
    pdf.drawString(400, 700, "Location")

    y_position = 680  # Y position for first row
    pdf.setFont("Helvetica", 10)

    # Iterate over the threats and add them to the PDF
    for threat in threats:
        pdf.drawString(50, y_position, threat.get("title", "N/A")[:20])
        pdf.drawString(200, y_position, threat.get("severity", "N/A"))
        pdf.drawString(300, y_position, threat.get("type", "N/A"))
        pdf.drawString(400, y_position, threat.get("location", "N/A"))
        y_position -= 20  # Move to the next line

        # Prevent overlapping
        if y_position < 50:
            pdf.showPage()
            y_position = 750

    pdf.save()  # Save PDF
    buffer.seek(0)  # Move the buffer to the beginning

    return buffer
