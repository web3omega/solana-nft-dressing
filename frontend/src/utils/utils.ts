import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Connection, Keypair, PublicKey, Signer, SystemProgram, GetProgramAccountsFilter, AccountInfo } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";

export const programId = new PublicKey('ASSYU7dde5y5nhpxhxuz76Q3QhMYATLGqND6J8FGhXL9');

export const getAssociatedTokenAddress = async (
  mint: PublicKey,
  owner: PublicKey,
  allowOwnerOffCurve = false,
  programId = TOKEN_PROGRAM_ID,
  associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID
): Promise<PublicKey> => {
  if (!allowOwnerOffCurve && !PublicKey.isOnCurve(owner.toBuffer())) throw new Error();

  const [address] = await PublicKey.findProgramAddress(
      [owner.toBuffer(), programId.toBuffer(), mint.toBuffer()],
      associatedTokenProgramId
  );

  return address;
};

export const getMasterAddress = async (mint: PublicKey): Promise<PublicKey> => {
  const [address] = await PublicKey.findProgramAddress(
    [
      Buffer.from('metadata', 'utf8'),
      new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s").toBuffer(),
      mint.toBuffer(),
      Buffer.from('edition', 'utf8'),
    ],
    new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"),
  );

  return address;
}

export const getTraitPDA = (assembledMint: PublicKey, traitCollectionMint: PublicKey) => 
{
  const [traitPda] = PublicKey.findProgramAddressSync(
    [
        Buffer.from(anchor.utils.bytes.utf8.encode('trait')),
        assembledMint.toBuffer(),
        traitCollectionMint.toBuffer(),
    ],
    programId
  );

  return traitPda;
}

