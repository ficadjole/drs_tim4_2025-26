import base64
import io
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from workers.celery_client import notify_report_generated


class ReportService:
    @staticmethod
    def generate_and_send(flights, tab_name, admin_email):
        
        if not flights:
            return False, f"No flights in category {tab_name}."
        
        pdf_b64 = ReportService.generate_flights_pdf_base64(flights, tab_name)
        notify_report_generated(admin_email, tab_name, pdf_b64)

        return True, "Report successfully sent!"
    
    @staticmethod
    def generate_flights_pdf_base64(flights, tab_name):

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize = letter)
        styles = getSampleStyleSheet()
        elements = []

        title_text = f"Izveštaj o letovima - {tab_name.replace('_', ' ')}"
        title = Paragraph(title_text, styles['Title'])
        elements.append(title)
        elements.append(Spacer(1, 12))

        data = [["Name", "Company", "From", "To", "Departure", "Price"]]

        for f in flights:
            row = [
                f.get('name', 'N/A'),
                f.get('id', 'N/A'),
                f.get('departureAirport', 'N/A'),
                f.get('arrivalAirport', 'N/A'),
                str(f.get('departureTime', 'N/A'))[:16],
                f"{f.get('ticketPrice', '0')}EUR"
            ]
            data.append(row)
        
        table = Table(data, colWidths=[100,70,70,70,110,60])

        style = TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#2196F3")), 
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 11),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor("#F5F5F5")), 
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ])
        table.setStyle(style)
        elements.append(table)

        doc.build(elements) #sluzi za generisanje pdf-a
        buffer.seek(0)
        pdf_bytes = buffer.read()

        return base64.b64encode(pdf_bytes).decode('utf-8')

