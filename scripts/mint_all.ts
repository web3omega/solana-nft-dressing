import { keypairIdentity, Metaplex, NftWithToken } from '@metaplex-foundation/js';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { AnchorProvider, BN, Program, utils, Wallet, web3 } from '@project-serum/anchor';
import wallet from './wallets/wallet.json'
import * as anchor from "@project-serum/anchor";

/// Collections

/// Collections
let collectionAllTraits: NftWithToken;
let collectionTraits: NftWithToken[] = [];
let collectionAssembled: NftWithToken;


/// Traits
let traits: NftWithToken[] = [];
let assemblies: NftWithToken[] = [];

//Some settings
const amountOfTraitsCollections = 3;
const amountOfTraitsToInit = 5;
const amountOfAssembliesToInit = 5;

const programId = new PublicKey('ASSYU7dde5y5nhpxhxuz76Q3QhMYATLGqND6J8FGhXL9');

const connection = new Connection('https://api.devnet.solana.com', 'finalized');
    
const payer: Keypair = Keypair.fromSecretKey(Uint8Array.from(wallet));

const [updateAuthorityPDA] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode('update')),
    ],
    programId
);

const run = async () => {
    const urlPrefix = 'https://img.web3omega.dev';

    const traitCollectionNames = ['A', 'B', 'C', 'D'];

    console.log("Public Key: " + payer.publicKey.toString());

    const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(payer));
    
    console.log('Start minting!');
    await connection.confirmTransaction(
        await connection.requestAirdrop(payer.publicKey, 1000000000),
        "confirmed"
    );

    collectionAllTraits = (await metaplex.nfts().create({
        uri: `${urlPrefix}/collections/traits.json`,
        name: `TRAITS COLLECTION`,
        sellerFeeBasisPoints: 500, // Represents 5.00%.
    })).nft;

    console.log(`collectionAllTraits: ${JSON.stringify(collectionAllTraits)}`)

      //Change update authority to PDA updateAuthority
    await metaplex.nfts().update({nftOrSft: collectionAllTraits, newUpdateAuthority: updateAuthorityPDA});
  
    await new Promise(resolve => setTimeout(resolve, 30000));
  
    for(let i = 0; i < amountOfTraitsCollections; i++){
      console.log('Create collectionTrait', i)
  
        collectionTraits[i] = (await metaplex.nfts().create({
          uri: `${urlPrefix}/collections/traits_col_${traitCollectionNames[i]}.json`,
          name: `TRAIT COLL #${traitCollectionNames[i]}`,
          sellerFeeBasisPoints: 500, // Represents 5.00%.
          collection: collectionAllTraits.address
        })).nft;
  
        await new Promise(resolve => setTimeout(resolve, 30000));
  
        //Transfer authority
        await metaplex.nfts().update({nftOrSft: collectionTraits[i], newUpdateAuthority: updateAuthorityPDA});
    }

    console.log(`collectionTraits: ${JSON.stringify(collectionTraits)}`)

    await new Promise(resolve => setTimeout(resolve, 30000));
  
    collectionAssembled = (await metaplex.nfts().create({
    uri: `${urlPrefix}/collections/assembled.json`,
    name: "ASSEMBLED COLLECTION",
    sellerFeeBasisPoints: 500, // Represents 5.00%.
    })).nft;

    console.log(`collectionAssembled: ${JSON.stringify(collectionAssembled)}`)
  
    await metaplex.nfts().update({nftOrSft: collectionAssembled, newUpdateAuthority: updateAuthorityPDA});

    await new Promise(resolve => setTimeout(resolve, 30000));
  
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

    console.log(`assemblies: ${JSON.stringify(assemblies)}`)

    await new Promise(resolve => setTimeout(resolve, 30000));

    await Promise.all(collectionTraits.map(async (collection, index) => {
  
        await new Promise(resolve => setTimeout(resolve, index * 45000));
    
        console.log('Create traits', index)
      
        for(let i = 0; i < amountOfTraitsToInit; i++){
            const traitId = i + amountOfTraitsToInit * index;
    
            console.log('Create trait id', i)

            traits[traitId] = (await metaplex.nfts().create({
            uri: `${urlPrefix}/traits/trait_${traitCollectionNames[index]}_${i + 1}.json`,
            name: `TRAIT ${traitCollectionNames[index]} #${i + 1}`,
            sellerFeeBasisPoints: 500, // Represents 5.00%.
            collection: collection.address
            })).nft;
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

        console.log("Verifying")
        await new Promise(resolve => setTimeout(resolve, 60000));

        for(let i = 0; i < amountOfTraitsToInit; i++){
            const traitId = i + amountOfTraitsToInit * index;

            await metaplex.nfts().update({nftOrSft: traits[traitId], newUpdateAuthority: updateAuthorityPDA});

            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }))

    console.log("DONE")
    console.log(`collectionAllTraits: ${JSON.stringify(collectionAllTraits)}`)
    console.log(`collectionTraits: ${JSON.stringify(collectionTraits)}`)
    console.log(`collectionAssembled: ${JSON.stringify(collectionAssembled)}`)

    console.log(`traits: ${JSON.stringify(traits)}`)
    console.log(`assemblies: ${JSON.stringify(assemblies)}`)

    // TODO set all verified by the program
}

run ();