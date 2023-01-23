import { Nft } from '@metaplex-foundation/js';
import icon_solscan from '../img/icon/solscan.png';

export const Trait: React.FC<{ nft: Nft; onClick: any; apply: boolean }> = ({ nft, onClick, apply }) => {
    return (
        <div className="border m-2 p-2 flex rounded border-gray-800 bg-zinc-800 drop-shadow-lg h-56">
            <img className="w-48 h-48 m-auto" src={nft.json?.image} alt="trait" />
            <p className="p-1 absolute top-1 left-1/2 -translate-x-1/2 w-full flex justify-center">
                {nft.name}
                <a href={`https://solscan.io/token/${nft.address}?cluster=devnet`} target="_blank" rel="noreferrer">
                    <img className="mx-2 my-1 w-4" src={icon_solscan} alt="solscan" />
                </a>
            </p>
            <button
                className="p-1 absolute bottom-1 border left-1/2 -translate-x-1/2 rounded"
                onClick={() => onClick()}
            >
                {apply ? 'Enable Trait' : 'Remove Trait'}
            </button>
        </div>
    );
};
