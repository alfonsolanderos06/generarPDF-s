const express = require('express');
const mysql = require('mysql2');
// const pdfDocument = require('pdfkit');
const pdfPrinter = require('pdfmake');
const cors = require('cors');
const fs = require('fs');
const pdf = require('html-pdf');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1400712',
    database: 'modular-24b'
});

db.connect((err) => {
    if(err){
        console.error('Error de conexión a la bd: ', err);
        return;
    }
    console.log("Conexión a la bd éxitosa");
});

app.post('/generar-pdf', (req, res) => {
    const query = "SELECT Materia, Hora, Edificio, Salon, Profesor FROM horarios WHERE Hora LIKE '0700%'";

    db.query(query, (err, results) => {
        if(err){
            return res.status(500).json({error: 'Error en la consulta'});
        }

        let html = `
        <h1 style="text-align: center;">Lista de materias</h1>
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background-color: #CCCCCC;">
                    <th style="border: 1px solid black; padding: 8px;">Materia</th>
                    <th style="border: 1px solid black; padding: 8px;">Hora</th>
                    <th style="border: 1px solid black; padding: 8px;">Edificio</th>
                    <th style="border: 1px solid black; padding: 8px;">Salón</th>
                    <th style="border: 1px solid black; padding: 8px;">Profesor</th>
                    <th style="border: 1px solid black; padding: 8px;">Firma</th>
                </tr>
            </thead>
            <tbody>`;

        results.forEach(row => {
            html += `
            <tr>
                    <td style="border: 1px solid black; padding: 8px;">${row.Materia}</td>
                    <td style="border: 1px solid black; padding: 8px;">${row.Hora}</td>
                    <td style="border: 1px solid black; padding: 8px;">${row.Edificio}</td>
                    <td style="border: 1px solid black; padding: 8px;">${row.Salon}</td>
                    <td style="border: 1px solid black; padding: 8px;">${row.Profesor}</td>
                    <td style="border: 1px solid black; padding: 8px;">_________________________</td>
                </tr>`;
        });

        html += `
        </tbody>
        </table>`

        const options = {
            format: 'A4',
            orientation: 'landscape',
            border: {
                top: "10px",
                right: "10px",
                bottom: "10px",
                left: "10px"
            }
        };
   
        pdf.create(html, options).toFile('./archivo-generado.pdf', (err, result) => {
            if(err){
                return res.status(500).json({error: 'Error al generar el pdf'});
            }

            res.download(result.filename, 'reporte.pdf', (error) => {
                if(error){
                    res.status(500).json({error: 'Error al descargar el documento pdf'});
                }
                fs.unlinkSync(result.filename);
            });
        });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});