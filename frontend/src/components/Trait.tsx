
import { Nft } from "@metaplex-foundation/js"
import { PublicKey } from "@solana/web3.js"
import { useEffect } from "react"

export const Trait: React.FC<{ nft: Nft }> = ({ nft }) => {


  return <div className='border m-2 p-2 flex rounded border-gray-800 bg-zinc-800 drop-shadow-lg'>
    <img src={nft.json?.image} alt='trait' />
    <p className="p-1 absolute top-1 left-1/2 -translate-x-1/2">Trait A #1</p>
    <button className="p-1 absolute bottom-1 border left-1/2 -translate-x-1/2 rounded">Enable trait</button>
  </div>
}