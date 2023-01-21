import trait_1 from '../img/test_trait_1.png';
import trait_2 from '../img/test_trait_2.png';
import icon_solscan from '../img/icon/solscan.png';
import empty_nft from '../img/empty.png';
import { Trait } from '../components/Trait';
import { Connection, GetProgramAccountsFilter, Keypair, PublicKey } from '@solana/web3.js';
import { Metadata, keypairIdentity, Metaplex, Nft } from "@metaplex-foundation/js";
import { useEffect, useState } from 'react';
import hashlist from '../hashlist.json';
import { IDL, NftDressing } from '../idl/nft_dressing';
import { AnchorProvider, Program, Wallet, web3 } from '@project-serum/anchor';
import { getTraitPDA, programId } from '../utils/utils';


export const Home: React.FC = () => {
    const connection = new Connection('https://rpc.ankr.com/solana_devnet', 'finalized');
    
    // Fixed pubkeys for the collections
    const coll_trait_A = new PublicKey('6EmeCycSPwbxVphxRaW2rLH1xprvJrRNkbckMNSETT3G')
    const coll_trait_B = new PublicKey('GEkndwpLQ9xHaoPRenfad5jybgwBCZo1Ue86MXJKYAd8')
    const coll_trait_C = new PublicKey('GAu921sZx1a2gfJrVajsMKppazBpq77QhanEgCCjBjUZ')
    const coll_assemblies = new PublicKey('6TPns9NVYBNSBE41WiRfVTek3VXCZgGdr64nXMk14YLV')

    const [fetched, setFetched] = useState(false);

    const [traitsA, setTraitsA] = useState<Nft[]>([])
    const [traitsB, setTraitsB] = useState<Nft[]>([])
    const [traitsC, setTraitsC] = useState<Nft[]>([])
    const [assemblies, setAssembled] = useState<Nft[]>([])

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
    const metaplexFetcher = Metaplex.make(connection, {cluster: 'devnet'})
    .use(keypairIdentity(newKeypair)) // Mandatory to use a wallet otherwise any find calls fail (why metaplex????)

    //const coll_assembly_collection = new PublicKey('')

    const fetchTraitsInAssembly = async (assembly: PublicKey) => {
        const traitAPDA = getTraitPDA(assembly, coll_trait_A);
        const traitAPDB = getTraitPDA(assembly, coll_trait_B);
        const traitAPDC = getTraitPDA(assembly, coll_trait_C);

        const token_A = await metaplexFetcher.nfts().findByToken({token: traitAPDA})
        console.log(token_A)
    }

    const fetchAllNFTs = async (): Promise<Nft[]> => {
        console.log("Fetching all")


        const mints = hashlist.map(hash => {return new PublicKey(hash)});
        const output = await metaplexFetcher.nfts().findAllByMintList({mints}) ;

        console.log(JSON.stringify(output))

        const allNfts = await Promise.all(output.map(async nft => {
            return await metaplexFetcher.nfts().load({metadata: nft as Metadata});
        }))

        return allNfts as Nft[];
    }

    const fetchAllCollections = async () => {
        const allNfts = await fetchAllNFTs();

        setTraitsA(allNfts.filter(nft => nft.collection?.address.toString() === coll_trait_A.toString()))
        setTraitsB(allNfts.filter(nft => nft.collection?.address.toString() === coll_trait_B.toString()))
        setTraitsC(allNfts.filter(nft => nft.collection?.address.toString() === coll_trait_C.toString()))
        const newAssemblies = allNfts.filter(nft => nft.collection?.address.toString() === coll_assemblies.toString())

        console.log(newAssemblies)
        setAssembled(newAssemblies) 

        fetchTraitsInAssembly(newAssemblies[0].address);
        
        setFetched(true);
    }

    useEffect( () => {
        fetchAllCollections();
    }, []);

    return <div className='w-full min-h-screen text-slate-100  body-font font-eczar p-8 '>
        <div className="w-full flex pt-8 text-2xl">
            <p className="m-auto">NFT Assembling Demo</p>
        </div>
        <div className='w-full flex justify-center'>        
            <div className='w-2/5 m-2 flex border rounded-lg border-zinc-900 bg-zinc-900'>
                <div className='w-1/3 flex rounded drop-shadow-lg flex-col m-1 '>
                    <div className='p-1 flex'>
                        <p className="m-auto text-xl flex">
                            Trait A Collection
                            <a href={`https://solscan.io/token/${coll_trait_A}?cluster=devnet`} target='_blank' rel='noreferrer'><img className='m-2 w-4' src={icon_solscan} alt='solscan' /></a>
                        </p>
                    </div>
                    {traitsA.map(trait => {
                        return <Trait nft={trait} />
                    })}
                    {!fetched && 'Loading...'}
                    {fetched && traitsA.length === 0 && 'Found none'}
                </div>
                <div className='w-1/3 flex rounded drop-shadow-lg flex-col m-1'>
                    <div className='p-1 flex'>
                        <p className="m-auto text-xl flex">
                            Trait B Collection
                            <a href={`https://solscan.io/token/${coll_trait_B}?cluster=devnet`} target='_blank' rel='noreferrer'><img className='m-1 w-4' src={icon_solscan} alt='solscan' /></a>
                        </p>
                    </div>
                    {traitsB.map(trait => {
                        return <Trait nft={trait} />
                    })}
                    {!fetched && 'Loading...'}
                    {fetched && traitsB.length === 0 && 'Found none'}
                </div>
                <div className='w-1/3 flex rounded drop-shadow-lg flex-col m-1'>
                    <div className='p-1 flex'>
                        <p className="m-auto text-xl flex">
                            Trait C Collection
                            <a href={`https://solscan.io/token/${coll_trait_C}?cluster=devnet`} target='_blank' rel='noreferrer'><img className='m-1 w-4' src={icon_solscan} alt='solscan' /></a>
                            
                        </p>
                    </div>
                    {traitsC.map(trait => {
                        return <Trait nft={trait} />
                    })}
                    {!fetched && 'Loading...'}
                    {fetched && traitsC.length === 0 && 'Found none'}
                </div>
            </div>
            <div className='w-2/5 m-2 flex justify-center border rounded-lg border-zinc-900 bg-zinc-900'>
                <div className='flex rounded drop-shadow-lg flex-col m-1'>
                    <div className='p-1 flex rounded drop-shadow-lg'>
                        <p className="m-auto text-2xl">Assembled NFTs</p>
                    </div>
                    <div className='border m-2 p-2 flex rounded border-gray-800 bg-zinc-800 drop-shadow-lg justify-center'>
                        {assemblies.length > 0 && <>
                            <img className='w-48 h-48' src={assemblies[0].json?.image} alt='assembly'/>
                            <p className="p-1 absolute top-1 left-1/2 -translate-x-1/2">{assemblies[0].name}</p>
                        </>}
                    </div>
                    <div className='flex'>
                        <div className='border m-2 p-2 flex rounded border-gray-800 bg-zinc-800 drop-shadow-lg w-1/3'>
                            <img src={trait_1} />
                            <p className="p-1 absolute top-1 left-1/2 -translate-x-1/2">Trait A</p>
                            <button className="p-1 absolute bottom-1 border left-1/2 -translate-x-1/2 rounded">Remove trait</button>
                        </div>
                        <div className='border m-2 p-2 flex rounded border-gray-800 bg-zinc-800 drop-shadow-lg w-1/3'>
                            <img src={trait_2} />
                            <p className="p-1 absolute top-1 left-1/2 -translate-x-1/2">Trait B</p>
                            <button className="p-1 absolute bottom-1 border left-1/2 -translate-x-1/2 rounded">Remove trait</button>
                        </div>
                        <div className='border m-2 p-2 flex rounded border-gray-800 bg-zinc-800 drop-shadow-lg w-1/3'>
                            <img className='opacity-25' src={trait_1} />
                            <p className="p-1 absolute top-1 left-1/2 -translate-x-1/2">Trait C</p>
                            <p className="p-1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded">No Trait active</p>
                            <button className="p-1 absolute bottom-1 border left-1/2 -translate-x-1/2 rounded">Remove trait</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

}
