const fs = require('fs');
const path = require('path');
const https = require('https');

const diagrams = [
    'website_class_diagram.puml',
    'website_use_case.puml',
    'add_to_cart_sequence.puml'
];

const plantUmlServer = 'http://www.plantuml.com/plantuml/png/';

function encodePlantUml(content) {
    return Buffer.from(content).toString('base64');
}

function downloadDiagram(encodedContent, filename) {
    const outputPath = path.join(__dirname, filename.replace('.puml', '.png'));
    const file = fs.createWriteStream(outputPath);

    https.get(`${plantUmlServer}${encodedContent}`, (response) => {
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log(`Generated ${filename.replace('.puml', '.png')}`);
        });
    }).on('error', (err) => {
        console.error(`Error generating ${filename}:`, err);
    });
}

diagrams.forEach(diagram => {
    const content = fs.readFileSync(path.join(__dirname, diagram), 'utf8');
    const encoded = encodePlantUml(content);
    downloadDiagram(encoded, diagram);
}); 