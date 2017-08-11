pragma solidity ^0.4.4;

import "../contracts/Broker.sol";
import "truffle/Assert.sol";

contract TestBroker {

  function test_isStateUpdateSigValid() {
      Broker broker = new Broker(1);
      Assert.equal(broker.isStateUpdateSigValid(
          0x00d192fcfbcb9b3130db9fd757bdb6a1d5b11bff02, // sender's address
          1,               // chain ID
          0xc0,            // contract ID (chosen arbitrarily)
          sha3(uint32(0)), // channel ID,
          14159,           // payment
          27,                                                                 // SigV
          0xc11db8af0ec78ea647677e7b61bd75ee25867608e3ab358efc7bfd09791dae24, // SigR
          0x5c73345869dfc0ae023b8a8b877300a6f379f367270bf10506810aa29f6ef089  // SigS
      ), true, "testCanClaim returned false: hash or sig is invalid");
  }

}

/*
For the Python examples:

    $ pip install pysha3

See also: https://kobl.one/blog/create-full-ethereum-keypair-and-address/
Pubkey: a22900450e88734cec4e11d6bd76161c52a63cad3fce40df59e5ded76e8b6efa9d996d7605e75da33036063e37f4f05c913361ce2d4981ddf88d418e350143ea
Privkey: beb2cc1fb15a27efcc2104858749c5ba5718c717dcf44c34f641822878c9a1ff
Address: d192fcfbcb9b3130db9fd757bdb6a1d5b11bff02

    import sha3
    address = sha3.keccak_256('... pubkey ...'.decode('hex')).hexdigest()[-40:]
    print "Address:", address
    # Address: d192fcfbcb9b3130db9fd757bdb6a1d5b11bff02


hash: 8a8da4805a4c9e076b3d33eb87a1959bfabc83f8e80bb4870762a40c9e37595a

    import sha3
    import struct
    import hashlib
    pack_int = lambda x: struct.pack('>I', x)
    msg = "".join([
        pack_int(1), # chain id
        '\x00' * 19 + '\xc0', # contract id
        sha3.keccak_256(pack_int(0)).digest(), # channel id
        '\x00' * 28 + pack_int(14159)
    ])
    print "Hash:", hashlib.sha256(msg).hexdigest()
    # Hash: 940c7c30bd8e3cb323b51f9556fc542999ce59ffe5e7e4765f9570234e68fae4


SigV: 27 // because SigR is even; 28 if SigR was odd
SigR: c11db8af0ec78ea647677e7b61bd75ee25867608e3ab358efc7bfd09791dae24
SigS: 5c73345869dfc0ae023b8a8b877300a6f379f367270bf10506810aa29f6ef089

    select encode(ecdsa_sign_raw(
        '\xbeb2cc1fb15a27efcc2104858749c5ba5718c717dcf44c34f641822878c9a1ff', // private key
        '\x940c7c30bd8e3cb323b51f9556fc542999ce59ffe5e7e4765f9570234e68fae4', // hash
        'secp256k1'
    ), 'hex')

    c11db8af0ec78ea647677e7b61bd75ee25867608e3ab358efc7bfd09791dae245c73345869dfc0ae023b8a8b877300a6f379f367270bf10506810aa29f6ef089
*/
