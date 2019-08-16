import {encodePrivateKey, decodePrivateKey, keyFromMnemonic, encodePublicKey} from '../src/Keys';

const privKey = Uint8Array.of(
    -37, 72, 75, -126, -114, 100, -78, -40, -15, 44, -29, -64, -96, -23, 58, 11, -116, -50,
    122, -15, -69, -113, 57, -55, 119, 50, 57, 68, -126, 83, -114, 16);

const privKeyStr = '302e020100300506032b657004220420db484b828e64b2d8f12ce3c0a0e93a0b8cce7af1bb8f39c97732394482538e10';

const pubKey = Uint8Array.of(
    -32, -56, -20, 39, 88, -91, -121, -97, -6, -62, 38, -95, 60, 12, 81, 107, 121, -98, 114,
    -29, 81, 65, -96, -35, -126, -113, -108, -45, 121, -120, -92, -73);

const pubKeyStr = '302a300506032b6570032100e0c8ec2758a5879ffac226a13c0c516b799e72e35141a0dd828f94d37988a4b7';

test('encodePrivateKey produces correctly encoded string', () => {
    expect(encodePrivateKey(privKey)).toEqual(privKeyStr);
});

test('encodePublicKey produces correctly encoded string', () => {
    expect(encodePublicKey(pubKey)).toEqual(pubKeyStr);
});

test('decodePrivateKey returns correct value', () => {
    expect(decodePrivateKey(privKeyStr)).toEqual(privKey);
});

// generated by hedera-keygen-java, not used anywhere
const mnemonic = 'inmate flip alley wear offer often piece magnet surge toddler submit right radio absent pear floor belt raven price stove replace reduce plate home';
const mnemonicKey = '302e020100300506032b6570042204203988e39bb91007f3bedcb47b0d9384463ba7d922d74d1306f7a4c8a2881fac9e';
const decodedKey = decodePrivateKey(mnemonicKey);

test('recoverFromMnemonic generates correct private key', () => {
     return expect(keyFromMnemonic(mnemonic))
         .resolves.toEqual(decodedKey);
});
