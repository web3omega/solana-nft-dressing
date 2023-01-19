import { Connection, Keypair } from '@solana/web3.js';
import wallet from './wallets/wallet.json'

const run = async () => {

    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    
    const payer: Keypair = Keypair.fromSecretKey(Uint8Array.from(wallet));

    console.log("Public Key: " + payer.publicKey.toString());

    
    console.log('Start minting!');
    await connection.confirmTransaction(
        await connection.requestAirdrop(payer.publicKey, 1000000000),
        "confirmed"
    );
/*
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
    }))*/
}

run ();