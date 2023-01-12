import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token';

import { Metaplex, Nft } from "@metaplex-foundation/js";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { Connection, Keypair, PublicKey, Signer, SystemProgram, GetProgramAccountsFilter, AccountInfo } from "@solana/web3.js";

export const fetchNFTsInCollection = async (connection: Connection, collectionAddress: PublicKey): Promise<Nft[]> => {
  //NOTE the offset 368 and datasize 679 only counts for these NFTs created. With different creators this value can differ!
  // TODO this is not checking if the collection is verified yet!!! (need to add 33th byte boolean true (2))
  const collectionFilter: GetProgramAccountsFilter[] = [{ memcmp: { bytes: collectionAddress.toBase58(), offset: 368 } }, {dataSize: 679 }]
  const metadataAccounts = await connection.getProgramAccounts(new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'), {commitment: 'confirmed', filters: collectionFilter})
  
  const metaplexFetcher = Metaplex.make(connection)
  
  const mints: PublicKey[] = metadataAccounts.map(metadataAccount => {
    return Metadata.fromAccountInfo(metadataAccount.account)[0].mint;
  })
  
  const output = metaplexFetcher.nfts().findAllByMintList({mints});

  //Force convert to NFT
  return output as unknown as Nft[];
}

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