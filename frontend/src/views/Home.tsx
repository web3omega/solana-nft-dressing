import trait_1 from '../img/test_trait_1.png';
import trait_2 from '../img/test_trait_2.png';
import icon_solscan from '../img/icon/solscan.png';
import empty_nft from '../img/empty.png';
import { Trait } from '../components/Trait';
import { Connection, GetProgramAccountsFilter, PublicKey } from '@solana/web3.js';
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { useEffect, useState } from 'react';


export const Home: React.FC = () => {

    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    const coll_trait_A = new PublicKey('6EmeCycSPwbxVphxRaW2rLH1xprvJrRNkbckMNSETT3G')
    const coll_trait_B = new PublicKey('GEkndwpLQ9xHaoPRenfad5jybgwBCZo1Ue86MXJKYAd8')
    const coll_trait_C = new PublicKey('GAu921sZx1a2gfJrVajsMKppazBpq77QhanEgCCjBjUZ')

    const [traitsA, setTraitsA] = useState<PublicKey[]>([])
    const [traitsB, setTraitsB] = useState<PublicKey[]>([])
    const [traitsC, setTraitsC] = useState<PublicKey[]>([])

    //const coll_assembly_collection = new PublicKey('')

    const fetchAllCollections = async () => {
        const fetchNFTsInCollection = async (connection: Connection, collectionAddress: PublicKey): Promise<PublicKey[]> => {
            console.log("Fetching all")
            //NOTE the offset 368 and datasize 679 only counts for these NFTs created. With different creators this value can differ!
            // TODO this is not checking if the collection is verified yet!!! (need to add 33th byte boolean true (2))
            const collectionFilter: GetProgramAccountsFilter[] = [{ memcmp: { bytes: collectionAddress.toBase58(), offset: 368 } }, {dataSize: 679 }]
            const metadataAccounts = await connection.getProgramAccounts(new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'), {commitment: 'confirmed', filters: collectionFilter})
            
            const mints: PublicKey[] = metadataAccounts.map(metadataAccount => {
              return Metadata.fromAccountInfo(metadataAccount.account)[0].mint;
            })

            console.log(JSON.stringify(mints))
            return mints;
            
        }

        setTraitsA(await fetchNFTsInCollection(connection, coll_trait_A));
        setTraitsB(await fetchNFTsInCollection(connection, coll_trait_B));
        setTraitsC(await fetchNFTsInCollection(connection, coll_trait_C));
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
                </div>
            </div>
            <div className='w-2/5 m-2 flex justify-center border rounded-lg border-zinc-900 bg-zinc-900'>
                <div className='flex rounded drop-shadow-lg flex-col m-1'>
                    <div className='p-1 flex rounded drop-shadow-lg'>
                        <p className="m-auto text-2xl">Assembled NFTs</p>
                    </div>
                    <div className='border m-2 p-2 flex rounded border-gray-800 bg-zinc-800 drop-shadow-lg justify-center'>
                        <img src={empty_nft} />
                        <p className="p-1 absolute top-1 left-1/2 -translate-x-1/2">NFT Assembly #1</p>
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
