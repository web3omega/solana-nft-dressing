import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { NftDressing } from "../target/types/nft_dressing";
import { Keypair, PublicKey, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { keypairIdentity, Metaplex, NftWithToken } from "@metaplex-foundation/js";
import { fetchNFTsInCollection, getAssociatedTokenAddress, getMasterAddress } from "./utils";


describe("NFT Assembling", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const connection = anchor.getProvider().connection;

  const program = anchor.workspace.NftDressing as Program<NftDressing>;

  const urlPrefix = 'https://img.web3omega.com';

  const traitCollectionNames = ['A', 'B', 'C', 'D'];

  /// Collections
  let collectionAllTraits: NftWithToken;
  let collectionTraits: NftWithToken[] = [];
  let collectionAssembled: NftWithToken;
  

  /// Traits
  let traits: NftWithToken[] = [];
  let assemblies: NftWithToken[] = [];

  //Some settings
  const amountOfTraitsCollections = 3;
  const amountOfTraitsToInit = 3;
  const amountOfAssembliesToInit = 3;

  const payer = new Keypair();

  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(payer));

  const programId = new PublicKey('ASSYU7dde5y5nhpxhxuz76Q3QhMYATLGqND6J8FGhXL9');

  const metaplexProgramId = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

  const [updateAuthorityPDA] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode('update')),
    ],
    program.programId
  );

  it("Init mints", async () => {     
    await connection.confirmTransaction(
      await connection.requestAirdrop(payer.publicKey, 10000000000),
      "confirmed"
    );

    collectionAllTraits = (await metaplex.nfts().create({
      uri: `${urlPrefix}/collections/traits.json`,
      name: `TRAITS COLLECTION`,
      sellerFeeBasisPoints: 500, // Represents 5.00%.
  })).nft;

  //Change update authority to PDA updateAuthority
  await metaplex.nfts().update({nftOrSft: collectionAllTraits, newUpdateAuthority: updateAuthorityPDA});

  for(let i = 0; i < amountOfTraitsCollections; i++){
    console.log('Create collectionTrait', i)

      collectionTraits[i] = (await metaplex.nfts().create({
        uri: `${urlPrefix}/collections/traits_col_${traitCollectionNames[i]}.json`,
        name: `TRAIT COLL #${traitCollectionNames[i]}`,
        sellerFeeBasisPoints: 500, // Represents 5.00%.
        collection: collectionAllTraits.address
      })).nft;

      //Transfer authority
      await metaplex.nfts().update({nftOrSft: collectionTraits[i], newUpdateAuthority: updateAuthorityPDA});
  }

  collectionAssembled = (await metaplex.nfts().create({
  uri: `${urlPrefix}/collections/assembled.json`,
  name: "ASSEMBLED COLLECTION",
  sellerFeeBasisPoints: 500, // Represents 5.00%.
  })).nft;

  
  //Change update authority to PDA updateAuthority
  await metaplex.nfts().update({nftOrSft: collectionAssembled, newUpdateAuthority: updateAuthorityPDA});

  for(let i = 0; i < amountOfAssembliesToInit; i++){

    console.log('Create assemblies', i)
    assemblies[i] = (await metaplex.nfts().create({
        uri: `${urlPrefix}/assemblies/assembly_${i + 1}.json`,
        name: `ASSEMBLY #${i + 1}`,
        sellerFeeBasisPoints: 500, // Represents 5.00%.
        collection: collectionAssembled.address
    })).nft;

    //Transfer authority
    await metaplex.nfts().update({nftOrSft: assemblies[i], newUpdateAuthority: updateAuthorityPDA});
  }

  await Promise.all(collectionTraits.map(async (collection, index) => {

    console.log('Create traits', index)

    
    for(let i = 0; i < amountOfTraitsToInit; i++){
        const traitId = i + amountOfTraitsToInit * index;

        traits[traitId] = (await metaplex.nfts().create({
        uri: `${urlPrefix}/trait/trait_${traitCollectionNames[index]}_${i + 1}.json`,
        name: `TRAIT ${traitCollectionNames[index]} #${i + 1}`,
        sellerFeeBasisPoints: 500, // Represents 5.00%.
        collection: collection.address
        })).nft;

        //Transfer authority
        await metaplex.nfts().update({nftOrSft: traits[traitId], newUpdateAuthority: updateAuthorityPDA});
    }
    
  }))
  
    //console.log(JSON.stringify(traits[0]))
    
    const output = await fetchNFTsInCollection(connection, traits[0].collection.address)
    //console.log(`Amount found for: ${output.length}`)
    console.log(`    🎉 Succesfully created all collections and mints!`);
    //console.log(`NFT output: ${JSON.stringify(output)}`);
    /*console.log(`collectionAllTraits: ${JSON.stringify(collectionAllTraits)}`)
    console.log(`collectionTraits: ${JSON.stringify(collectionTraits)}`)
    console.log(`collectionAssembled: ${JSON.stringify(collectionAssembled)}`)

    console.log(`traits: ${JSON.stringify(traits)}`)
    console.log(`assemblies: ${JSON.stringify(assemblies)}`)*/
  });

  it("Transfer trait to assembled NFT", async () => {    

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

      //console.log('traitCollection:', traitCollection.toString())

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

        const accounts = {
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
            traitCollMasterEdition,
            updateAuthority: updateAuthorityPDA
          
        }

        console.log(JSON.stringify(accounts));

    const instruction = await program.methods.applyTrait()
    .accounts(accounts).instruction();

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

    //console.log(await connection.simulateTransaction(transaction));
    const signature = await connection.sendTransaction(transaction);

    // Confirm Transaction 
    const confirmation = await connection.confirmTransaction({
        signature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
    })

    
    if (confirmation.value.err) { throw new Error("   ❌ - Transfer Trait Transaction not confirmed.") }
    console.log('    🎉 Transfer Trait Transaction Succesfully Confirmed!');
  });

  it("Remove trait from assembled NFT", async () => {  

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

    //console.log('traitCollection:', traitCollectionMint.toString())

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
      assembledMasterEdition,
      updateAuthority: updateAuthorityPDA
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

    //console.log(await connection.simulateTransaction(transaction));
    const signature = await connection.sendTransaction(transaction);

    const confirmation = await connection.confirmTransaction({
      signature,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
  })

    if (confirmation.value.err) { throw new Error("   ❌ - Remove Trait Transaction not confirmed.") }
    console.log('    🎉 Remove Trait Transaction Succesfully Confirmed!');
  });

});
