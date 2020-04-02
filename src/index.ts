/**
 * dependencias:
 * npm install fast-csv @fast-csv/parse @fast-csv/format
 */

import * as csv from 'fast-csv';
import * as fs from 'fs';
import * as https from 'https';

async function crawler() {
  const linhas: any = [];

  const origem =
    'https://dados.anvisa.gov.br/dados/TA_PRECO_MEDICAMENTO_GOV.csv';
  const destino = 'TA_PRECO_MEDICAMENTO_GOV.csv';
  const arquivo = fs.createWriteStream(destino);

  console.clear();
  console.log('conectado...');

  https
    .get(origem, resposta => {
      console.log('salvando destino...');
      resposta.pipe(arquivo);
    })
    .on('error', error => console.error(error))
    .on('close', () => {
      fs.createReadStream(destino, {
        encoding: 'latin1'
      })
        .pipe(csv.parse({ delimiter: ';', headers: true }))
        .on('error', error => console.error(error))
        .on('data', row => {
          linhas.push(row);
        })
        .on('end', (rowCount: number) => {
          console.log(linhas[0], linhas[1]);
          console.log(`Total ${rowCount} linhas`);
        });
    });
}

(async function () {
  try {
    crawler();
  } catch (error) {
    console.log(error);
  }
})();
