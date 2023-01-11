import { Metaplex, Nft } from "@metaplex-foundation/js";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { Connection, Keypair, PublicKey, Signer, SystemProgram, GetProgramAccountsFilter, AccountInfo } from "@solana/web3.js";

export const fetchNFTsInCollection = async (connection: Connection, collectionAddress: PublicKey): Promise<Nft[]> => {
  //NOTE the offset 368 and datasize 679 only counts for these NFTs created. With different creators this value can differ!
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
