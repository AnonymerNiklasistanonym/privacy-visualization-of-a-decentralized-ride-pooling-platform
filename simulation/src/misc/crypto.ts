import {createHash, generateKeyPair} from 'crypto';

export interface GeneratePublicKey {
  publicKey: string;
  privateKey: string;
}

export const generatePublicKey = (
  passphrase: string
): Promise<GeneratePublicKey> =>
  new Promise((resolve, reject) => {
    generateKeyPair(
      'rsa',
      {
        modulusLength: 1024, // 4096
        privateKeyEncoding: {
          cipher: 'aes-256-cbc',
          format: 'pem',
          passphrase,
          type: 'pkcs8',
        },
        publicKeyEncoding: {
          format: 'pem',
          type: 'spki',
        },
      },
      (err, publicKey, privateKey) => {
        if (err) {
          return reject(err);
        }
        return resolve({
          privateKey,
          publicKey,
        });
      }
    );
  });

export const generateMd5Hash = (content: number | string | object) =>
  createHash('md5')
    .update(typeof content === 'string' ? content : JSON.stringify(content))
    .digest('hex');
