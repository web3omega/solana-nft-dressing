import trait_1 from '../img/test_trait_1.png';
import trait_2 from '../img/test_trait_2.png';
import icon_solscan from '../img/icon/solscan.png';
import empty_nft from '../img/empty.png';
import { Trait } from '../components/Trait';

export const Home: React.FC = () => {
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
                            <a href='https://solscan.io/token/HdW4nXnk3i5MxczuRphnKpZJVzyEojhutEHN3WwCDWEQ?cluster=devnet' target='_blank' rel='noreferrer'><img className='m-2 w-4' src={icon_solscan} alt='solscan' /></a>
                        </p>
                    </div>
                    <Trait imgURL='https://img.web3omega.dev/traits/trait_A_1.png' />
                    <div className='border m-2 p-2 flex rounded border-gray-800 bg-zinc-800 drop-shadow-lg'>
                        <img src={trait_1} />
                        <p className="p-1 absolute top-1 left-1/2 -translate-x-1/2">Trait A #2</p>
                        <button className="p-1 absolute bottom-1 border left-1/2 -translate-x-1/2 rounded">Enable trait</button>
                    </div>
                </div>
                <div className='w-1/3 flex rounded drop-shadow-lg flex-col m-1'>
                    <div className='p-1 flex'>
                        <p className="m-auto text-xl flex">
                            Trait B Collection
                            <a href='https://solscan.io/token/3R7v2nCTBEYUPyYxab2CsGck4E3PJfm8K3mqjs7nyT6L?cluster=devnet' target='_blank' rel='noreferrer'><img className='m-1 w-4' src={icon_solscan} alt='solscan' /></a>
                        </p>
                    </div>
                    <div className='border m-2 p-2 flex rounded border-gray-800 bg-zinc-800 drop-shadow-lg'>
                        <img src={trait_2} />
                        <p className="p-1 absolute top-1 left-1/2 -translate-x-1/2">Trait B #1</p>
                        <button className="p-1 absolute bottom-1 border left-1/2 -translate-x-1/2 rounded">Enable trait</button>
                    </div>
                </div>
                <div className='w-1/3 flex rounded drop-shadow-lg flex-col m-1'>
                    <div className='p-1 flex'>
                        <p className="m-auto text-xl flex">
                            Trait C Collection
                            <a href='https://solscan.io/token/8AxwMMEL5bx9zSfShiwGBWBKncZK5f977pKkb6Pph8NY?cluster=devnet' target='_blank' rel='noreferrer'><img className='m-1 w-4' src={icon_solscan} alt='solscan' /></a>
                            
                        </p>
                    </div>
                    <div className='border m-2 p-2 flex rounded border-gray-800 bg-zinc-800 drop-shadow-lg'>
                        <img src={trait_1} />
                        <p className="p-1 absolute top-1 left-1/2 -translate-x-1/2">Trait C #1</p>
                        <button className="p-1 absolute bottom-1 border left-1/2 -translate-x-1/2 rounded">Enable trait</button>
                    </div>
                    <div className='border m-2 p-2 flex rounded border-gray-800 bg-zinc-800 drop-shadow-lg'>
                        <img src={trait_1} />
                        <p className="p-1 absolute top-1 left-1/2 -translate-x-1/2">Trait C #2</p>
                        <button className="p-1 absolute bottom-1 border left-1/2 -translate-x-1/2 rounded">Enable trait</button>
                    </div>
                    <div className='border m-2 p-2 flex rounded border-gray-800 bg-zinc-800 drop-shadow-lg'>
                        <img src={trait_1} />
                        <p className="p-1 absolute top-1 left-1/2 -translate-x-1/2">Trait C #1923</p>
                        <button className="p-1 absolute bottom-1 border left-1/2 -translate-x-1/2 rounded">Enable trait</button>
                    </div>
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
