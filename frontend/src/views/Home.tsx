export const Home: React.FC = () => {
    return <div className='w-full min-h-screen text-slate-100'>
        <div className="w-full flex pt-8 text-2xl">
            <p className="m-auto">NFT Assembling demo</p>
        </div>
        <div className='w-full flex'>        
            <div className='w-3/5 border m-2 flex'>
                <div className='w-1/3 border m-1 flex'>
                    <p className="m-auto">Trait 1 Collection</p>
                </div>
                <div  className='w-1/3 border m-1 flex'>
                    <p className="m-auto">Trait 2 Collection</p>
                </div>
                <div  className='w-1/3 border m-1 flex'>
                    <p className="m-auto">Trait 3 Collection</p>
                </div>
            </div>
            <div className='w-2/5 border m-2 flex'>
                ...
            </div>
        </div>
    </div>

}
