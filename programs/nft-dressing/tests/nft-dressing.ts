import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { NftDressing } from "../target/types/nft_dressing";
import { Connection, Keypair, PublicKey, Signer, SystemProgram, GetProgramAccountsFilter, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, Token, ASSOCIATED_TOKEN_PROGRAM_ID, AuthorityType } from "@solana/spl-token";
import { keypairIdentity, Metaplex, NftWithToken } from "@metaplex-foundation/js";
import { fetchNFTsInCollection, getAssociatedTokenAddress, getMasterAddress } from "./utils";


describe("nft-dressing", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const connection = anchor.getProvider().connection;

  const program = anchor.workspace.NftDressing as Program<NftDressing>;

  /// Collections
  let collectionAllTraits: NftWithToken;
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

  const metaplexProgramId = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

  it("Init mints", async () => {     
    await connection.confirmTransaction(
      await connection.requestAirdrop(payer.publicKey, 10000000000),
      "confirmed"
    );

    collectionAllTraits = (await metaplex.nfts().create({
      uri: "https://arweave.net/123",
      name: `TRAITS`,
      sellerFeeBasisPoints: 500, // Represents 5.00%.
    })).nft;

    for(let i = 0; i < amountOfTraitsPerCollection; i++){
      collectionTraits[i] = (await metaplex.nfts().create({
        uri: "https://arweave.net/123",
        name: `TRAIT COLL #${i}`,
        sellerFeeBasisPoints: 500, // Represents 5.00%.
        collection: collectionAllTraits.address
      })).nft;
      await metaplex.nfts().verifyCollection({
        mintAddress: collectionTraits[i].address,
        collectionMintAddress: collectionAllTraits.address,
        isSizedCollection: false
      })

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
      await metaplex.nfts().verifyCollection({
        mintAddress: assemblies[i].address,
        collectionMintAddress: collectionAssembled.address,
        isSizedCollection: false
      })
    }

    await Promise.all(collectionTraits.map(async (collection, index) => {
      for(let i = 0; i < amountOfTraitsToInit; i++){
        traits[i] = (await metaplex.nfts().create({
          uri: "https://arweave.net/123",
          name: `TRAIT #${index}.${i}`,
          sellerFeeBasisPoints: 500, // Represents 5.00%.
          collection: collection.address
        })).nft;

        await metaplex.nfts().verifyCollection({
          mintAddress: traits[i].address,
          collectionMintAddress: collection.address,
          isSizedCollection: false
        })
      }
    }))

    console.log(JSON.stringify(traits[0]))
    
    const output = await fetchNFTsInCollection(connection, traits[0].collection.address)
    console.log(`Amount found for: ${output.length}`)
    console.log(`NFT output: ${JSON.stringify(output[0])}`);
  });

  it("Transfer trait to assembled", async () => {    

    const assembledMint = assemblies[0].address;
    const assembledMetadataAddress = assemblies[0].metadataAddress;

    const assembledMintTokenAccount = await getAssociatedTokenAddress(
      assembledMint,
      payer.publicKey
    );

    const traitNFT = traits[0];
    const traitMint = traitNFT.mint.address;
    const traitMetadata = traitNFT.metadataAddress;
    const traitCollection = traitNFT.collection.address;
    const traitCollectionMetadata = collectionTraits.filter(collTrait => collTrait.address.toString() === traitCollection.toString())[0].metadataAddress;
    const traitCollMasterEdition = await getMasterAddress(traitCollection);

      console.log('traitCollection:', traitCollection.toString())

    const traitTokenAccount = await getAssociatedTokenAddress(
      traitMint,
      payer.publicKey
    );

    const [traitPda] = PublicKey.findProgramAddressSync(
        [
            Buffer.from(anchor.utils.bytes.utf8.encode('trait')),
            assembledMint.toBuffer(),
            traitCollection.toBuffer(),
        ],
        programId
    );

    const assembledMasterEdition = await getMasterAddress(assembledMint);

    const instruction = await program.methods.applyTrait()
    .accounts(
    {
      traitVault: traitPda,
      assembledMint,
      traitMetadata,
      traitMint,
      traitTokenAccount,
      traitCollection,
      assembledMintTokenAccount,
      owner: payer.publicKey,
      metadataProgram: metaplexProgramId,
      assembledMetadata: assembledMetadataAddress,
      assembledMasterEdition,
      traitCollectionMetadata,
      traitCollMasterEdition
    }).instruction();

    // Step 1 - Fetch Latest Blockhash
    let latestBlockhash = await connection.getLatestBlockhash('confirmed');

    //console.log(await connection.simulateTransaction(tx));
    const messageV0 = new TransactionMessage({
        payerKey: payer.publicKey,
        recentBlockhash: latestBlockhash.blockhash,
        instructions: [instruction]
    }).compileToV0Message();
    const transaction = new VersionedTransaction(messageV0);
    transaction.sign([payer]);

    console.log(await connection.simulateTransaction(transaction));
    const signature = await connection.sendTransaction(transaction);

    // Confirm Transaction 
    const confirmation = await connection.confirmTransaction({
        signature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
    })

    
    if (confirmation.value.err) { throw new Error("   ❌ - Transfer Trait Transaction not confirmed.") }
    console.log('🎉 Transfer Trait Transaction Succesfully Confirmed!');
  });

  it("Remove trait", async () => {  

    const assembledMint = assemblies[0].address;
    const assembledMetadataAddress = assemblies[0].metadataAddress;
    const assembledMintTokenAccount = await getAssociatedTokenAddress(
      assembledMint,
      payer.publicKey
    );

    const traitNFT = traits[0];
    const traitMint = traitNFT.mint.address;
    const traitMetadata = traitNFT.metadataAddress;
    const traitCollectionMint = traitNFT.collection.address; // TODO How to deterministic find this address??
    const traitCollectionMetadata = collectionTraits.filter(collTrait => collTrait.address.toString() === traitCollectionMint.toString())[0].metadataAddress;
    const traitCollMasterEdition = await getMasterAddress(traitCollectionMint);
    const assembledMasterEdition = await getMasterAddress(assembledMint);

    console.log('traitCollection:', traitCollectionMint.toString())

    const traitTokenAccount = await getAssociatedTokenAddress(
      traitMint,
      payer.publicKey
    );

    const [traitPda] = PublicKey.findProgramAddressSync(
        [
            Buffer.from(anchor.utils.bytes.utf8.encode('trait')),
            assembledMint.toBuffer(),
            traitCollectionMint.toBuffer(),
        ],
        programId
    );



    const instruction = await program.methods.removeTrait()
    .accounts(
    {
      traitVault: traitPda,
      assembledMint,
      traitMetadata,
      traitMint,
      traitTokenAccount,
      traitCollectionMint,
      assembledMintTokenAccount,
      owner: payer.publicKey,
      metadataProgram: metaplexProgramId,
      traitCollectionMetadata,
      traitCollMasterEdition,
      assembledMetadata: assembledMetadataAddress,
      assembledMasterEdition
    }).instruction();

    // Step 1 - Fetch Latest Blockhash
    let latestBlockhash = await connection.getLatestBlockhash('confirmed');

    //console.log(await connection.simulateTransaction(tx));
    const messageV0 = new TransactionMessage({
        payerKey: payer.publicKey,
        recentBlockhash: latestBlockhash.blockhash,
        instructions: [instruction]
    }).compileToV0Message();
    const transaction = new VersionedTransaction(messageV0);
    transaction.sign([payer]);

    console.log(await connection.simulateTransaction(transaction));
    const signature = await connection.sendTransaction(transaction);
  });

});
