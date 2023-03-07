#!/usr/bin/env node
const fs = require('fs');
const https = require('https');

function get_indep_hash() {
  const options = {
    hostname: 'arweave.net',
    path: '/block/current',
    method: 'GET'
  };

  const req = https.request(options, res => {
    let data = '';

    res.on('data', chunk => {
      data += chunk;
    });

    res.on('end', () => {
      const json = JSON.parse(data);
      const indepHash = json.indep_hash;
      console.log(indepHash);
      get_reward_history(indepHash);
    });
  });

  req.on('error', error => {
    console.error(error);
  });

  req.end();
}

function get_reward_history(indepHash) {
  const options = {
    hostname: 'arweave.net',
    path: `/reward_history/${indepHash}`,
    method: 'GET',
    responseType: 'arraybuffer'
  };

  const req = https.request(options, res => {
    const chunks = [];

    res.on('data', chunk => {
      chunks.push(chunk);
    });

    res.on('end', () => {
      const binaryData = Buffer.concat(chunks);
      console.log(binaryData);
      fs.writeFileSync("dl.bin", binaryData);
    });
  });


  req.on('error', error => {
    console.error(error);
  });

  req.end();

}

get_indep_hash();