import { Operations } from 'src/constants/enums.constants';
import { TOKENS } from 'src/constants/tokens.constants';
import axios from 'axios';
const jsSHA = require('jssha');

export async function urlToBuffer(url: string) {
  try {
    const res = await axios.get(url, {
      responseType: 'arraybuffer',
    });

    return Buffer.from(res.data, 'binary');
  } catch (error) {
    return null;
  }
}

export function isVerified(
  secret: string,
  identifier: string,
  name: string,
  fileName: string,
  signature: string,
) {
  const signatureBody = secret.concat(name, identifier, fileName);
  let sha256 = new jsSHA('SHA-256', 'TEXT');
  sha256.update(signatureBody);
  const hashedSignature = sha256.getHash('HEX');

  return signature == hashedSignature;
}

export function createSignature(
  secret: string,
  name: string,
  identifier: string,
  fileName: string,
) {
  const signatureBody = secret.concat(name, identifier, fileName);
  let sha256 = new jsSHA('SHA-256', 'TEXT');
  sha256.update(signatureBody);

  return sha256.getHash('HEX');
}

export function identifyFile(file: string, operation: Operations) {
  const extName = file.match(/\.[0-9a-z]+$/i)[0].toLowerCase();
  const tokenObject = TOKENS[operation].find((token) =>
    token.types.includes(extName),
  );
  if (!tokenObject) return null;
  return {
    token: tokenObject.token,
    extName,
  };
}
