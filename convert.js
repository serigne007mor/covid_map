const csvToJson = require('convert-csv-to-json');

const input = './latest.csv';
const output = './public/covid.json';

csvToJson.fieldDelimiter(',')
    .formatValueByType()
    .generateJsonFileFromCsv(input, output);