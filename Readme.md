# Arweave Reward History Downloader and Parser
This project provides a set of JavaScript tools for downloading and parsing reward history data from the Arweave blockchain.

## Usage
To use this project, you can clone the repository and run the following command to download the reward history data:
```
./download.js
```

This will download the current block from the Arweave network and save it to a local file called `dl.bin`.

To parse the binary data, you can run the following command:

```
./parser.js
```
This will read the binary data from the `dl.bin` file and parse it according to the Erlang format specification. The parsed data will be logged to the console as a JavaScript object.

Note that this project does not use any external NPM packages.
