import trait_1 from '../img/test_trait_1.png';
import trait_2 from '../img/test_trait_2.png';
import trait_3 from '../img/test_trait_3.png';
import img_head from '../img/head.png';
import icon_solscan from '../img/icon/solscan.png';
import empty_nft from '../img/empty.png';
import { Trait } from '../components/Trait';
import { Connection, Keypair, PublicKey, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import { Metadata, keypairIdentity, Metaplex, Nft } from '@metaplex-foundation/js';
import { useEffect, useState } from 'react';
import hashlist from '../hashlist.json';
import { IDL, NftDressing } from '../idl/nft_dressing';
import { AnchorProvider, Program, Wallet, web3 } from '@project-serum/anchor';
import { getAssociatedTokenAddress, getMasterAddress, getTraitPDA, programId } from '../utils/utils';
import { useWallet } from '@solana/wallet-adapter-react';
import * as anchor from '@project-serum/anchor';

export const Home: React.FC = () => {
    const wallet = useWallet();

    const metaplexProgramId = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

    // Fixed pubkeys for the collections
    const collectionTraitA = new PublicKey('6EmeCycSPwbxVphxRaW2rLH1xprvJrRNkbckMNSETT3G');
    const collectionTraitB = new PublicKey('GEkndwpLQ9xHaoPRenfad5jybgwBCZo1Ue86MXJKYAd8');
    const collectionTraitC = new PublicKey('GAu921sZx1a2gfJrVajsMKppazBpq77QhanEgCCjBjUZ');
    const coll_assemblies = new PublicKey('6TPns9NVYBNSBE41WiRfVTek3VXCZgGdr64nXMk14YLV');

    const [fetched, setFetched] = useState(false);

    const [allNfts, setAllNfts] = useState<Nft[]>([]);
    const [traitsA, setTraitsA] = useState<Nft[]>([]);
    const [traitsB, setTraitsB] = useState<Nft[]>([]);
    const [traitsC, setTraitsC] = useState<Nft[]>([]);
    const [assemblies, setAssembled] = useState<Nft[]>([]);

    const [selectedTraitA, setSelectedTraitA] = useState<Nft>();
    const [selectedTraitB, setSelectedTraitB] = useState<Nft>();
    const [selectedTraitC, setSelectedTraitC] = useState<Nft>();

    const newKeypair = Keypair.generate();

    const w: Wallet = {
        payer: newKeypair,
        // eslint-disable-next-line no-unused-vars
        signTransaction: function (_tx: web3.Transaction): Promise<web3.Transaction> {
            throw new Error('Function not implemented.');
        },
        // eslint-disable-next-line no-unused-vars
        signAllTransactions: function (_txs: web3.Transaction[]): Promise<web3.Transaction[]> {
            throw new Error('Function not implemented.');
        },
        publicKey: newKeypair.publicKey,
    };

    const provider = new AnchorProvider(connection, w, {
        preflightCommitment: 'confirmed',
        commitment: 'processed',
    });

    const program = new Program<NftDressing>(IDL, programId, provider);
    const metaplexFetcher = Metaplex.make(connection, { cluster: 'devnet' }).use(keypairIdentity(newKeypair)); // Mandatory to use a wallet otherwise any find calls fail (why metaplex????)

    const [updateAuthorityPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from(anchor.utils.bytes.utf8.encode('update'))],
        program.programId
    );

    const fetchTraitsInAssembly = async (assembly: PublicKey) => {
        const traitAPDA = getTraitPDA(assembly, collectionTraitA);
        const traitAPDB = getTraitPDA(assembly, collectionTraitB);
        const traitAPDC = getTraitPDA(assembly, collectionTraitC);

        setSelectedTraitA(
            (await metaplexFetcher
                .nfts()
                .findByToken({ token: traitAPDA })
                .catch((_err) => {
                    return undefined;
                })) as Nft
        );
        setSelectedTraitB(
            (await metaplexFetcher
                .nfts()
                .findByToken({ token: traitAPDB })
                .catch((_err) => {
                    return undefined;
                })) as Nft
        );
        setSelectedTraitC(
            (await metaplexFetcher
                .nfts()
                .findByToken({ token: traitAPDC })
                .catch((_err) => {
                    return undefined;
                })) as Nft
        );
    };

    const removeTrait = async (traitNFT: Nft, assembledNFT: Nft, traitCollectionMint: PublicKey) => {
        if (!wallet.publicKey) return;

        const assembledMint = assembledNFT.address;
        const assembledMintTokenAccount = await getAssociatedTokenAddress(assembledMint, wallet.publicKey);

        const traitMint = traitNFT.mint.address;
        const traitCollection = traitCollectionMint;
        if (!traitCollection) return;

        const traitCollectionMetadata = allNfts.filter(
            (collTrait) => collTrait.address.toString() === traitCollection.toString()
        )[0].metadataAddress;

        const traitTokenAccount = await getAssociatedTokenAddress(traitMint, wallet.publicKey);

        const [traitPda] = PublicKey.findProgramAddressSync(
            [
                Buffer.from(anchor.utils.bytes.utf8.encode('trait')),
                assembledMint.toBuffer(),
                traitCollection.toBuffer(),
            ],
            programId
        );

        const accounts = {
            traitVault: traitPda,
            assembledMint,
            traitMetadata: traitNFT.metadataAddress,
            traitMint,
            traitTokenAccount,
            traitCollectionMint: traitCollection,
            assembledMintTokenAccount,
            owner: wallet.publicKey,
            metadataProgram: metaplexProgramId,
            traitCollectionMetadata,
            traitCollMasterEdition: await getMasterAddress(traitCollection),
            assembledMetadata: assembledNFT.metadataAddress,
            assembledMasterEdition: await getMasterAddress(assembledMint),
            updateAuthority: updateAuthorityPDA,
        };

        console.log(JSON.stringify(accounts));
        const instruction = await program.methods.removeTrait().accounts(accounts).instruction();

        // Step 1 - Fetch Latest Blockhash
        let latestBlockhash = await connection.getLatestBlockhash('confirmed');

        //console.log(await connection.simulateTransaction(tx));
        const messageV0 = new TransactionMessage({
            payerKey: wallet.publicKey,
            recentBlockhash: latestBlockhash.blockhash,
            instructions: [instruction],
        }).compileToV0Message();
        const transaction = new VersionedTransaction(messageV0);

        console.log(await connection.simulateTransaction(transaction));
        const signature = await wallet.sendTransaction(transaction, connection);

        const confirmation = await connection.confirmTransaction({
            signature,
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        });

        console.log(confirmation);
    };

    const applyTrait = async (traitNFT: Nft) => {
        if (!wallet.publicKey) return;

        const assembledMint = assemblies[0].address;
        const assembledMetadataAddress = assemblies[0].metadataAddress;

        const assembledMintTokenAccount = await getAssociatedTokenAddress(assembledMint, wallet.publicKey);

        const traitMint = traitNFT.mint.address;
        const traitMetadata = traitNFT.metadataAddress;
        const traitCollection = traitNFT.collection?.address;
        if (!traitCollection) return;

        const traitCollectionMetadata = allNfts.filter(
            (collTrait) => collTrait.address.toString() === traitCollection.toString()
        )[0].metadataAddress;
        const traitCollMasterEdition = await getMasterAddress(traitCollection);

        const traitTokenAccount = await getAssociatedTokenAddress(traitMint, wallet.publicKey);

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
            owner: wallet.publicKey,
            metadataProgram: metaplexProgramId,
            assembledMetadata: assembledMetadataAddress,
            assembledMasterEdition,
            traitCollectionMetadata,
            traitCollMasterEdition,
            updateAuthority: updateAuthorityPDA,
        };

        const instruction = await program.methods.applyTrait().accounts(accounts).instruction();

        // Step 1 - Fetch Latest Blockhash
        let latestBlockhash = await connection.getLatestBlockhash('finalized');

        //console.log(await connection.simulateTransaction(tx));
        const messageV0 = new TransactionMessage({
            payerKey: wallet.publicKey,
            recentBlockhash: latestBlockhash.blockhash,
            instructions: [instruction],
        }).compileToV0Message();
        const transaction = new VersionedTransaction(messageV0);

        console.log(await connection.simulateTransaction(transaction));
        const signature = await wallet.sendTransaction(transaction, connection);

        console.log('TX sig:', signature);
        // Confirm Transaction
        const confirmation = await connection.confirmTransaction({
            signature,
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        });
        console.log('TX confirmation:', confirmation);
    };

    const fetchAllNFTs = async (): Promise<Nft[]> => {
        console.log('Fetching all');

        const mints = hashlist.map((hash) => {
            return new PublicKey(hash);
        });
        const output = await metaplexFetcher.nfts().findAllByMintList({ mints });

        console.log(JSON.stringify(output));

        return (await Promise.all(
            output.map(async (nft) => {
                return await metaplexFetcher.nfts().load({ metadata: nft as Metadata });
            })
        )) as Nft[];
    };

    const fetchAllCollections = async () => {
        const allNfts = await fetchAllNFTs();
        setAllNfts(allNfts);

        setTraitsA(allNfts.filter((nft) => nft.collection?.address.toString() === collectionTraitA.toString()));
        setTraitsB(allNfts.filter((nft) => nft.collection?.address.toString() === collectionTraitB.toString()));
        setTraitsC(allNfts.filter((nft) => nft.collection?.address.toString() === collectionTraitC.toString()));

        // Assembled
        const newAssemblies = allNfts.filter(
            (nft) => nft.collection?.address.toString() === coll_assemblies.toString()
        );
        setAssembled(newAssemblies);

        // Fixed value for demo: Fetch the first NFT
        await fetchTraitsInAssembly(newAssemblies[0].address);

        setFetched(true);
    };

    useEffect(() => {
        fetchAllCollections();
    }, []);

    return (
        <div className="w-full min-h-screen text-slate-100  body-font font-eczar p-8 ">
            <div className="w-full flex pt-8 text-2xl">
                <p className="m-auto">NFT Assembling Demo on Solana Devnet</p>
            </div>
            <div className="w-full flex justify-center">
                <div className="w-2/5 m-2 flex border rounded-lg border-zinc-900 bg-zinc-900">
                    <div className="w-1/3 flex rounded drop-shadow-lg flex-col m-1 ">
                        <div className="p-1 flex">
                            <p className="m-auto text-xl flex">
                                Trait A Collection
                                <a
                                    href={`https://solscan.io/token/${collectionTraitA}?cluster=devnet`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <img className="m-1 w-4" src={icon_solscan} alt="solscan" />
                                </a>
                            </p>
                        </div>
                        {traitsA.map((trait) => {
                            return <Trait nft={trait} onClick={() => applyTrait(trait)} apply={true} />;
                        })}
                        {!fetched && traitsA.length === 0 && 'Loading...'}
                        {fetched && traitsA.length === 0 && 'Found none'}
                    </div>
                    <div className="w-1/3 flex rounded drop-shadow-lg flex-col m-1">
                        <div className="p-1 flex">
                            <p className="m-auto text-xl flex">
                                Trait B Collection
                                <a
                                    href={`https://solscan.io/token/${collectionTraitB}?cluster=devnet`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <img className="m-1 w-4" src={icon_solscan} alt="solscan" />
                                </a>
                            </p>
                        </div>
                        {traitsB.map((trait) => {
                            return <Trait nft={trait} onClick={() => applyTrait(trait)} apply={true} />;
                        })}
                        {!fetched && traitsB.length === 0 && 'Loading...'}
                        {fetched && traitsB.length === 0 && 'Found none'}
                    </div>
                    <div className="w-1/3 flex rounded drop-shadow-lg flex-col m-1">
                        <div className="p-1 flex">
                            <p className="m-auto text-xl flex">
                                Trait C Collection
                                <a
                                    href={`https://solscan.io/token/${collectionTraitC}?cluster=devnet`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <img className="m-1 w-4" src={icon_solscan} alt="solscan" />
                                </a>
                            </p>
                        </div>
                        {traitsC.map((trait) => {
                            return <Trait nft={trait} onClick={() => applyTrait(trait)} apply={true} />;
                        })}
                        {!fetched && traitsC.length === 0 && 'Loading...'}
                        {fetched && traitsC.length === 0 && 'Found none'}
                    </div>
                </div>
                <div className="w-2/5 m-2 flex justify-center border rounded-lg border-zinc-900 bg-zinc-900">
                    <div className="flex rounded drop-shadow-lg flex-col m-1">
                        <div className="p-1 flex rounded drop-shadow-lg">
                            <p className="m-auto text-2xl">Assembled NFTs</p>
                        </div>
                        <div className="border m-2 p-2 flex rounded border-gray-800 bg-zinc-800 drop-shadow-lg justify-center">
                            {assemblies.length > 0 && fetched ? (
                                <div>
                                    <div className="w-96 h-96">
                                        <img className="w-96 h-96 absolute" src={empty_nft} alt="assembly" />
                                        {selectedTraitC && (
                                            <img
                                                className="w-96 h-96 absolute"
                                                src={selectedTraitC.json?.image + '_real.png'}
                                                alt="assembly"
                                            />
                                        )}
                                        {selectedTraitA && (
                                            <img
                                                className="w-96 h-96 absolute"
                                                src={selectedTraitA.json?.image + '_real.png'}
                                                alt="assembly"
                                            />
                                        )}
                                        {selectedTraitB && (
                                            <img
                                                className="w-96 h-96 absolute"
                                                src={selectedTraitB.json?.image + '_real.png'}
                                                alt="assembly"
                                            />
                                        )}
                                        <img className="w-96 h-96 absolute" src={img_head} alt="assembly" />
                                    </div>
                                    <p className="p-1 absolute top-1 left-1/2 -translate-x-1/2 flex">
                                        {assemblies[0].name}
                                        <a
                                            href={`https://solscan.io/token/${assemblies[0].address}?cluster=devnet`}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <img className="m-1 w-4" src={icon_solscan} alt="solscan" />
                                        </a>
                                    </p>
                                </div>
                            ) : (
                                <div className="w-96 h-96">
                                    <p className="p-1 absolute top-1 left-1/2 -translate-x-1/2 flex text-2xl">
                                        Loading Assembled NFT...
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="flex">
                            <div className="w-1/3">
                                {selectedTraitA ? (
                                    <Trait
                                        nft={selectedTraitA}
                                        onClick={() => removeTrait(selectedTraitA, assemblies[0], collectionTraitA)}
                                        apply={false}
                                    />
                                ) : (
                                    <div className="border m-2 p-2 flex rounded border-gray-800 bg-zinc-800 drop-shadow-lg">
                                        <img className="opacity-25" src={trait_2} alt="no trait" />
                                        <p className="p-1 absolute top-1 left-1/2 -translate-x-1/2">Trait A</p>
                                        <p className="p-1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                            {!fetched ? 'Loading...' : 'No Trait active'}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="w-1/3">
                                {selectedTraitB ? (
                                    <Trait
                                        nft={selectedTraitB}
                                        onClick={() => removeTrait(selectedTraitB, assemblies[0], collectionTraitB)}
                                        apply={false}
                                    />
                                ) : (
                                    <div className="border m-2 p-2 flex rounded border-gray-800 bg-zinc-800 drop-shadow-lg">
                                        <img className="opacity-25" src={trait_3} alt="no trait" />
                                        <p className="p-1 absolute top-1 left-1/2 -translate-x-1/2">Trait B</p>
                                        <p className="p-1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                            {!fetched ? 'Loading...' : 'No Trait active'}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="w-1/3">
                                {selectedTraitC ? (
                                    <Trait
                                        nft={selectedTraitC}
                                        onClick={() => removeTrait(selectedTraitC, assemblies[0], collectionTraitC)}
                                        apply={false}
                                    />
                                ) : (
                                    <div className="border m-2 p-2 flex rounded border-gray-800 bg-zinc-800 drop-shadow-lg">
                                        <img className="opacity-25" src={trait_1} alt="no trait" />
                                        <p className="p-1 absolute top-1 left-1/2 -translate-x-1/2">Trait C</p>
                                        <p className="p-1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                            {!fetched ? 'Loading...' : 'No Trait active'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
