#!/usr/bin/env node
const fs = require('fs');

const filePath = 'dl.bin';

const binaryData = fs.readFileSync(filePath);

// Define the number of entities in the binary data
// Iterate over the binary data buffer to extract each entity in the list
let parsedData = [];
let offset = 0;
while(offset < binaryData.length) {
  const addrPosition = offset;
  const addrSize = 32;
  const hashRateSizePosition = addrPosition + addrSize;
  const hashRateSize = binaryData.readUInt8(hashRateSizePosition);
  const hashRatePosition = hashRateSizePosition + 1;
  const hashRateSizeBytes = hashRateSize;
  const hashRate = binaryData.slice(hashRatePosition, hashRatePosition + hashRateSizeBytes);
  const rewardSizePosition = hashRatePosition + hashRateSizeBytes;
  const rewardSize = binaryData.readUInt8(rewardSizePosition);
  const rewardPosition = rewardSizePosition + 1;
  const rewardSizeBytes = rewardSize;
  const reward = binaryData.slice(rewardPosition, rewardPosition + rewardSizeBytes);
  const denominationPosition = rewardPosition + rewardSizeBytes;
  const denominationSize = 3;
  const denomination = binaryData.readUIntBE(denominationPosition, denominationSize);
  offset = denominationPosition + denominationSize;

  const Addr = binaryData.slice(addrPosition, addrPosition + addrSize);
  const addrBase64url = Addr.toString("base64").replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  const buffer = Buffer.from(reward, 'hex');

  // Parse the buffer as a bigint
  const rewardBigint = BigInt(`0x${buffer.toString('hex')}`);
  
  // Create an object with the extracted fields
  const entity = {
    Addr: addrBase64url,
    HashRateSize: hashRateSize,
    HashRate: hashRate,
    RewardSize: rewardSize,
    Reward: rewardBigint,
    Denomination: denomination
  };

  parsedData.push(entity);
}

// after 2.8 only part of history represents pending rewards
const addrHash = {};
const pendingHistoryLength = 21600;
parsedData = parsedData.slice(parsedData.length - pendingHistoryLength)

for(const entity of parsedData) {
  const Addr  = entity.Addr;
  const Reward= entity.Reward;
  if (addrHash[Addr] == null)
    addrHash[Addr] = 0n;
  addrHash[Addr] += Reward;
}

const sortedArray = Object.entries(addrHash).sort((a, b) => +(b[1] - a[1]).toString());

const sortedAddrHash = Object.fromEntries(sortedArray);

// console.log(parsedData);
const bigIntToJSON = (key, value) => {
  if (typeof value === 'bigint') {
    return value.toString()/1e12;
  }
  return value;
};
console.log(JSON.stringify(sortedAddrHash, bigIntToJSON, 2));

