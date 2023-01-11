import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { NftDressing } from "../target/types/nft_dressing";
import { Connection, Keypair, PublicKey, Signer, SystemProgram, GetProgramAccountsFilter } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, Token, ASSOCIATED_TOKEN_PROGRAM_ID, AuthorityType } from "@solana/spl-token";
import { keypairIdentity, Metaplex, NftWithToken } from "@metaplex-foundation/js";
import { fetchNFTsInCollection, getAssociatedTokenAddress } from "./utils";


describe("nft-dressing", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const connection = anchor.getProvider().connection;

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

  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(payer));

  const programId = new PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS');

  it("Init mints", async () => {     
    await connection.confirmTransaction(
      await connection.requestAirdrop(payer.publicKey, 10000000000),
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
    
    const output = await fetchNFTsInCollection(connection, traits[0].collection.address)
    console.log(`Amount found for: ${output.length}`)
    console.log(`NFT output: ${JSON.stringify(output[0])}`);

  });


  it("Transfer trait", async () => {    

    const assembledMint = assemblies[0].address;
    const assembledMintTokenAccount = await getAssociatedTokenAddress(
      assembledMint,
      payer.publicKey
    );
    const traitNFT = traits[0];
    const traitMint = traitNFT.mint.address;
    const traitMetadata = traitNFT.metadataAddress;
    const traitCollection = traitNFT.collection.address;

    const [traitPda] = PublicKey.findProgramAddressSync(
        [
            Buffer.from(anchor.utils.bytes.utf8.encode('trait')),
            assembledMint.toBuffer(),
            traitCollection.toBuffer(),
        ],
        programId
    );

    const tx = await program.methods.applyTrait()
    .accounts(
    {
      traitPda,
      assembledMint,
      traitMetadata,
      traitMint,
      traitCollection,
      assembledMintTokenAccount,
      owner: payer.publicKey,
    }).transaction();

    tx.feePayer = payer.publicKey;

    console.log(await connection.simulateTransaction(tx));
    //.rpc();
    console.log(tx);

  });

});
