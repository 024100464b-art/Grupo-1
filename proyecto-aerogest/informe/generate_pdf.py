import markdown
from fpdf import FPDF
import re

with open('informe/report.md', 'r', encoding='utf-8') as f:
    md = f.read()

html = markdown.markdown(md, extensions=['tables', 'fenced_code', 'codehilite'])

pdf = FPDF()
pdf.add_page()
pdf.set_auto_page_break(auto=True, margin=20)

pdf.add_font('Arial', '', 'C:\\Windows\\Fonts\\arial.ttf')
pdf.add_font('Arial', 'B', 'C:\\Windows\\Fonts\\arialbd.ttf')
pdf.add_font('Arial', 'I', 'C:\\Windows\\Fonts\\ariali.ttf')
pdf.set_font('Arial', '', 10)

def write_html(pdf, html):
    pdf.set_font('Arial', 'B', 16)
    pdf.cell(0, 10, 'AeroGest Cusco - AOCC Strategic Terminal', new_x='LMARGIN', new_y='NEXT')
    pdf.ln(4)
    pdf.set_font('Arial', '', 9)
    pdf.multi_cell(0, 5, 'Sistema de gestion aeroportuaria integral para el Aeropuerto Internacional Alejandro Velasco Astete en Cusco.')
    pdf.ln(8)
    
    chunks = html.split('<hr />')
    for chunk in chunks:
        chunk = chunk.strip()
        if not chunk:
            continue
        
        lines = chunk.split('\n')
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            if line.startswith('<h2>'):
                text = re.sub(r'<[^>]+>', '', line)
                pdf.set_font('Arial', 'B', 13)
                pdf.ln(4)
                pdf.cell(0, 8, text, new_x='LMARGIN', new_y='NEXT')
                pdf.ln(2)
            elif line.startswith('<h3>'):
                text = re.sub(r'<[^>]+>', '', line)
                pdf.set_font('Arial', 'B', 11)
                pdf.ln(2)
                pdf.cell(0, 7, text, new_x='LMARGIN', new_y='NEXT')
                pdf.ln(1)
            elif line.startswith('<table>'):
                rows = re.findall(r'<tr>(.*?)</tr>', line, re.DOTALL)
                col_widths = [60, 80]
                for ri, row in enumerate(rows):
                    cells = re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', row, re.DOTALL)
                    for ci, cell in enumerate(cells):
                        text = re.sub(r'<[^>]+>', '', cell).strip()
                        if ri == 0:
                            pdf.set_font('Arial', 'B', 8)
                        else:
                            pdf.set_font('Arial', '', 8)
                        w = col_widths[ci] if ci < len(col_widths) else 60
                        pdf.cell(w, 6, text, border=1)
                    pdf.ln()
                pdf.ln(3)
            elif line.startswith('<pre>'):
                code = re.sub(r'<[^>]+>', '', line)
                pdf.set_font('Courier', '', 7)
                pdf.multi_cell(0, 4, code)
                pdf.set_font('Arial', '', 10)
                pdf.ln(2)
            elif line.startswith('<ul>') or line.startswith('<ol>'):
                items = re.findall(r'<li>(.*?)</li>', line, re.DOTALL)
                for item in items:
                    text = re.sub(r'<[^>]+>', '', item).strip()
                    pdf.set_font('Arial', '', 9)
                    pdf.cell(5)
                    pdf.multi_cell(0, 5, f'- {text}')
                pdf.ln(2)
            elif line.startswith('<p>'):
                text = re.sub(r'<[^>]+>', '', line)
                if text.strip():
                    pdf.set_font('Arial', '', 9)
                    pdf.multi_cell(0, 5, text.strip())
                    pdf.ln(2)
            elif line.startswith('<h1>'):
                pass

write_html(pdf, html)

pdf.output('informe/AeroGest_Cusco_Informe.pdf')
print("PDF generated successfully!")
