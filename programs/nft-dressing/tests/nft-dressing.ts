import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { NftDressing } from "../target/types/nft_dressing";
import { Connection, Keypair, PublicKey, Signer, SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, Token, ASSOCIATED_TOKEN_PROGRAM_ID, AuthorityType } from "@solana/spl-token";
import { keypairIdentity, Metaplex, NftWithToken } from "@metaplex-foundation/js";

describe("nft-dressing", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.NftDressing as Program<NftDressing>;

  /// Collections
  let collectionTraits: NftWithToken[] = [];
  let collectionAssembled: NftWithToken;

  /// Traits
  let traits: NftWithToken[] = [];
  let assemblies: NftWithToken[] = [];

  //Some settings
  const amountOfTraitsPerCollection = 4;
  const amountOfTraitsToInit = 3;
  const amountOfAssembliesToInit = 3;

  const payer = new Keypair();

  const metaplex = Metaplex.make(anchor.getProvider().connection)
    .use(keypairIdentity(payer));

  it("Init mints", async () => {     
    await anchor.getProvider().connection.confirmTransaction(
      await anchor.getProvider().connection.requestAirdrop(payer.publicKey, 10000000000),
      "confirmed"
    );

    for(let i = 0; i < amountOfTraitsPerCollection; i++){
      collectionTraits[i] = (await metaplex.nfts().create({
        uri: "https://arweave.net/123",
        name: `TRAIT COLL #${i}`,
        sellerFeeBasisPoints: 500, // Represents 5.00%.
      })).nft;
    }

    collectionAssembled = (await metaplex.nfts().create({
      uri: "https://arweave.net/123",
      name: "ASSEMBLED COLLECTION",
      sellerFeeBasisPoints: 500, // Represents 5.00%.
    })).nft;

    for(let i = 0; i < amountOfAssembliesToInit; i++){
      assemblies[i] = (await metaplex.nfts().create({
        uri: "https://arweave.net/123",
        name: `ASSEMBLY #${i}`,
        sellerFeeBasisPoints: 500, // Represents 5.00%.
        collection: collectionAssembled.address
      })).nft;
    }

    await Promise.all(collectionTraits.map(async (collection, index) => {
      for(let i = 0; i < amountOfTraitsToInit; i++){
        traits[i] = (await metaplex.nfts().create({
          uri: "https://arweave.net/123",
          name: `TRAIT #${index}.${i}`,
          sellerFeeBasisPoints: 500, // Represents 5.00%.
          collection: collection.address
        })).nft;
      }
    }))
    
    console.log(JSON.stringify(traits[0]))
  });

});
