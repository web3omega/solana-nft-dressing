import { keypairIdentity, Metaplex, NftWithToken } from '@metaplex-foundation/js';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import wallet from './wallets/wallet.json'

/// Collections
/*let collectionAllTraits: NftWithToken = JSON.parse(`{"model":"nft","updateAuthorityAddress":"GFHtmdF9qaELYdjzDZpxzdwRH6bQkB7TfyFgXRq8YN4i","json":null,"jsonLoaded":true,"name":"TRAITS COLLECTION","symbol":"","uri":"https://img.web3omega.com/collections/traits.json","isMutable":true,"primarySaleHappened":false,"sellerFeeBasisPoints":500,"editionNonce":255,"creators":[{"address":"GFHtmdF9qaELYdjzDZpxzdwRH6bQkB7TfyFgXRq8YN4i","verified":true,"share":100}],"tokenStandard":0,"collection":null,"collectionDetails":null,"uses":null,"address":"5RVutwf5GNU5J5hjPeyqECozRzWawEZmAQt2Pn9pawyN","metadataAddress":"BoGyQGN1EQi9nfGcFY4iGiQWqAm1kd32uNKxMhBJgfN6","mint":{"model":"mint","address":"5RVutwf5GNU5J5hjPeyqECozRzWawEZmAQt2Pn9pawyN","mintAuthorityAddress":"2Y3vBozu3XPvecLG3mj3Ws8xAC4zzyEonfDsbi1Vnh15","freezeAuthorityAddress":"2Y3vBozu3XPvecLG3mj3Ws8xAC4zzyEonfDsbi1Vnh15","decimals":0,"supply":{"basisPoints":"01","currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"isWrappedSol":false,"currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"token":{"model":"token","address":"CA343z3mjVgfcRZWMGCGAhrwgHvbeZ8Tb3XRmqWVxGBV","isAssociatedToken":true,"mintAddress":"5RVutwf5GNU5J5hjPeyqECozRzWawEZmAQt2Pn9pawyN","ownerAddress":"GFHtmdF9qaELYdjzDZpxzdwRH6bQkB7TfyFgXRq8YN4i","amount":{"basisPoints":"01","currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"closeAuthorityAddress":null,"delegateAddress":null,"delegateAmount":{"basisPoints":"00","currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"state":1},"edition":{"model":"nftEdition","isOriginal":true,"address":"2Y3vBozu3XPvecLG3mj3Ws8xAC4zzyEonfDsbi1Vnh15","supply":"00","maxSupply":"00"}}`);

let collectionTraits = [new PublicKey('Hw5fwbC5NqL9dXGtqV1fvVSZbpR9UU9F6nwisHxWAMWG'), new PublicKey('aTvobr53j8xVj31nCG9CfLiaidfrUNhAaq2Jr8xDgNt'), new PublicKey('iV1kExRew61pWoR1ie6YobWTpjhoEXTEB644g4FLEcj')]
//let collectionTraits: NftWithToken[] = JSON.parse(`[{"model":"nft","updateAuthorityAddress":"GFHtmdF9qaELYdjzDZpxzdwRH6bQkB7TfyFgXRq8YN4i","json":null,"jsonLoaded":true,"name":"TRAIT COLL #A","symbol":"","uri":"https://img.web3omega.com/collections/traits_col_A.json","isMutable":true,"primarySaleHappened":false,"sellerFeeBasisPoints":500,"editionNonce":255,"creators":[{"address":"GFHtmdF9qaELYdjzDZpxzdwRH6bQkB7TfyFgXRq8YN4i","verified":true,"share":100}],"tokenStandard":0,"collection":{"verified":false,"key":"5RVutwf5GNU5J5hjPeyqECozRzWawEZmAQt2Pn9pawyN","address":"5RVutwf5GNU5J5hjPeyqECozRzWawEZmAQt2Pn9pawyN"},"collectionDetails":null,"uses":null,"address":"Hw5fwbC5NqL9dXGtqV1fvVSZbpR9UU9F6nwisHxWAMWG","metadataAddress":"GEzH9BCgPQKtQ4W3fvikazV5Cyjon8w9Lv8gAV2xLjFC","mint":{"model":"mint","address":"Hw5fwbC5NqL9dXGtqV1fvVSZbpR9UU9F6nwisHxWAMWG","mintAuthorityAddress":"9JG2uLFTc3DAxGe9qbKktvBEfeJhGubhCWgEzkto5t8T","freezeAuthorityAddress":"9JG2uLFTc3DAxGe9qbKktvBEfeJhGubhCWgEzkto5t8T","decimals":0,"supply":{"basisPoints":"01","currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"isWrappedSol":false,"currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"token":{"model":"token","address":"4jafc4ezEjenqyB4axEWWPBt7pjHbXNzYooVnCXW5yum","isAssociatedToken":true,"mintAddress":"Hw5fwbC5NqL9dXGtqV1fvVSZbpR9UU9F6nwisHxWAMWG","ownerAddress":"GFHtmdF9qaELYdjzDZpxzdwRH6bQkB7TfyFgXRq8YN4i","amount":{"basisPoints":"01","currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"closeAuthorityAddress":null,"delegateAddress":null,"delegateAmount":{"basisPoints":"00","currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"state":1},"edition":{"model":"nftEdition","isOriginal":true,"address":"9JG2uLFTc3DAxGe9qbKktvBEfeJhGubhCWgEzkto5t8T","supply":"00","maxSupply":"00"}},{"model":"nft","updateAuthorityAddress":"GFHtmdF9qaELYdjzDZpxzdwRH6bQkB7TfyFgXRq8YN4i","json":null,"jsonLoaded":true,"name":"TRAIT COLL #B","symbol":"","uri":"https://img.web3omega.com/collections/traits_col_B.json","isMutable":true,"primarySaleHappened":false,"sellerFeeBasisPoints":500,"editionNonce":254,"creators":[{"address":"GFHtmdF9qaELYdjzDZpxzdwRH6bQkB7TfyFgXRq8YN4i","verified":true,"share":100}],"tokenStandard":0,"collection":{"verified":false,"key":"5RVutwf5GNU5J5hjPeyqECozRzWawEZmAQt2Pn9pawyN","address":"5RVutwf5GNU5J5hjPeyqECozRzWawEZmAQt2Pn9pawyN"},"collectionDetails":null,"uses":null,"address":"aTvobr53j8xVj31nCG9CfLiaidfrUNhAaq2Jr8xDgNt","metadataAddress":"FuW4YSensr3wdRjC2WH4b7rvmmoTBmqR4x6gPsqEYv9J","mint":{"model":"mint","address":"aTvobr53j8xVj31nCG9CfLiaidfrUNhAaq2Jr8xDgNt","mintAuthorityAddress":"9gTVDXCmVWeJwHVB8JXReZBhicRXAbQE66RWBTEQygCP","freezeAuthorityAddress":"9gTVDXCmVWeJwHVB8JXReZBhicRXAbQE66RWBTEQygCP","decimals":0,"supply":{"basisPoints":"01","currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"isWrappedSol":false,"currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"token":{"model":"token","address":"9Re8EcWZj5DKNiyGPy2pvo1VKALgH8hJz7RjnpkETBzC","isAssociatedToken":true,"mintAddress":"aTvobr53j8xVj31nCG9CfLiaidfrUNhAaq2Jr8xDgNt","ownerAddress":"GFHtmdF9qaELYdjzDZpxzdwRH6bQkB7TfyFgXRq8YN4i","amount":{"basisPoints":"01","currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"closeAuthorityAddress":null,"delegateAddress":null,"delegateAmount":{"basisPoints":"00","currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"state":1},"edition":{"model":"nftEdition","isOriginal":true,"address":"9gTVDXCmVWeJwHVB8JXReZBhicRXAbQE66RWBTEQygCP","supply":"00","maxSupply":"00"}},{"model":"nft","updateAuthorityAddress":"GFHtmdF9qaELYdjzDZpxzdwRH6bQkB7TfyFgXRq8YN4i","json":null,"jsonLoaded":true,"name":"TRAIT COLL #C","symbol":"","uri":"https://img.web3omega.com/collections/traits_col_C.json","isMutable":true,"primarySaleHappened":false,"sellerFeeBasisPoints":500,"editionNonce":253,"creators":[{"address":"GFHtmdF9qaELYdjzDZpxzdwRH6bQkB7TfyFgXRq8YN4i","verified":true,"share":100}],"tokenStandard":0,"collection":{"verified":false,"key":"5RVutwf5GNU5J5hjPeyqECozRzWawEZmAQt2Pn9pawyN","address":"5RVutwf5GNU5J5hjPeyqECozRzWawEZmAQt2Pn9pawyN"},"collectionDetails":null,"uses":null,"address":"iV1kExRew61pWoR1ie6YobWTpjhoEXTEB644g4FLEcj","metadataAddress":"FE5a91RZwQAC7LLsU6ZsjL7LioBCGxQG3R29vhhWQMJy","mint":{"model":"mint","address":"iV1kExRew61pWoR1ie6YobWTpjhoEXTEB644g4FLEcj","mintAuthorityAddress":"8rJXsZAfDdiNXhqp3UQ2Bso1fWbpzLi4Mxrrhmg14Ph3","freezeAuthorityAddress":"8rJXsZAfDdiNXhqp3UQ2Bso1fWbpzLi4Mxrrhmg14Ph3","decimals":0,"supply":{"basisPoints":"01","currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"isWrappedSol":false,"currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"token":{"model":"token","address":"7avDtmBgWjUbRd37k83CAezZpS4CQK6ZtrpePW3TiMjD","isAssociatedToken":true,"mintAddress":"iV1kExRew61pWoR1ie6YobWTpjhoEXTEB644g4FLEcj","ownerAddress":"GFHtmdF9qaELYdjzDZpxzdwRH6bQkB7TfyFgXRq8YN4i","amount":{"basisPoints":"01","currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"closeAuthorityAddress":null,"delegateAddress":null,"delegateAmount":{"basisPoints":"00","currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"state":1},"edition":{"model":"nftEdition","isOriginal":true,"address":"8rJXsZAfDdiNXhqp3UQ2Bso1fWbpzLi4Mxrrhmg14Ph3","supply":"00","maxSupply":"00"}}]`)
let collectionAssembled: NftWithToken = JSON.parse(`{"model":"nft","updateAuthorityAddress":"GFHtmdF9qaELYdjzDZpxzdwRH6bQkB7TfyFgXRq8YN4i","json":null,"jsonLoaded":true,"name":"ASSEMBLED COLLECTION","symbol":"","uri":"https://img.web3omega.com/collections/assembled.json","isMutable":true,"primarySaleHappened":false,"sellerFeeBasisPoints":500,"editionNonce":252,"creators":[{"address":"GFHtmdF9qaELYdjzDZpxzdwRH6bQkB7TfyFgXRq8YN4i","verified":true,"share":100}],"tokenStandard":0,"collection":null,"collectionDetails":null,"uses":null,"address":"FuHDXiHEc2cnTAXrmSbkME5MsuABg5Ayst1d9D2EuMnB","metadataAddress":"B74g3KDKBJWPAkRRDQ4LSUuAMM3bzZFtcKFcWhNq7Eaw","mint":{"model":"mint","address":"FuHDXiHEc2cnTAXrmSbkME5MsuABg5Ayst1d9D2EuMnB","mintAuthorityAddress":"7diRcg2rskS8UVqigNU1QRtXAkTYq233MxsTzU8xDLH","freezeAuthorityAddress":"7diRcg2rskS8UVqigNU1QRtXAkTYq233MxsTzU8xDLH","decimals":0,"supply":{"basisPoints":"01","currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"isWrappedSol":false,"currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"token":{"model":"token","address":"9bpUuy6rY9Se5cUuRgM3nSdTdTEtV3nLKb3jVkbt87Ki","isAssociatedToken":true,"mintAddress":"FuHDXiHEc2cnTAXrmSbkME5MsuABg5Ayst1d9D2EuMnB","ownerAddress":"GFHtmdF9qaELYdjzDZpxzdwRH6bQkB7TfyFgXRq8YN4i","amount":{"basisPoints":"01","currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"closeAuthorityAddress":null,"delegateAddress":null,"delegateAmount":{"basisPoints":"00","currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"state":1},"edition":{"model":"nftEdition","isOriginal":true,"address":"7diRcg2rskS8UVqigNU1QRtXAkTYq233MxsTzU8xDLH","supply":"00","maxSupply":"00"}}`);


/// Traits
let traits: NftWithToken[] = [];
let assemblies: NftWithToken[] = JSON.parse(`[{"model":"nft","updateAuthorityAddress":"GFHtmdF9qaELYdjzDZpxzdwRH6bQkB7TfyFgXRq8YN4i","json":null,"jsonLoaded":true,"name":"ASSEMBLY #1","symbol":"","uri":"https://img.web3omega.com/assemblies/assembly_1.json","isMutable":true,"primarySaleHappened":false,"sellerFeeBasisPoints":500,"editionNonce":254,"creators":[{"address":"GFHtmdF9qaELYdjzDZpxzdwRH6bQkB7TfyFgXRq8YN4i","verified":true,"share":100}],"tokenStandard":0,"collection":{"verified":false,"key":"FuHDXiHEc2cnTAXrmSbkME5MsuABg5Ayst1d9D2EuMnB","address":"FuHDXiHEc2cnTAXrmSbkME5MsuABg5Ayst1d9D2EuMnB"},"collectionDetails":null,"uses":null,"address":"8hTWi1Q8ceYi2XDk4xsq9Y75pFBcsELWudg4p5eDukxb","metadataAddress":"5vmVH8AMKf6ttb6hcAtmBhYz4gjbeaTM6wg8GW3RNdnY","mint":{"model":"mint","address":"8hTWi1Q8ceYi2XDk4xsq9Y75pFBcsELWudg4p5eDukxb","mintAuthorityAddress":"9FNjUMx3sHdu7pDm15MSVFTxdLeqzWjntJ4iSLJjDpvT","freezeAuthorityAddress":"9FNjUMx3sHdu7pDm15MSVFTxdLeqzWjntJ4iSLJjDpvT","decimals":0,"supply":{"basisPoints":"01","currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"isWrappedSol":false,"currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"token":{"model":"token","address":"DQmzymWMAzXUcgZvJCifcVXBGgh6uUZ3JuhFvMk5BdQZ","isAssociatedToken":true,"mintAddress":"8hTWi1Q8ceYi2XDk4xsq9Y75pFBcsELWudg4p5eDukxb","ownerAddress":"GFHtmdF9qaELYdjzDZpxzdwRH6bQkB7TfyFgXRq8YN4i","amount":{"basisPoints":"01","currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"closeAuthorityAddress":null,"delegateAddress":null,"delegateAmount":{"basisPoints":"00","currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"state":1},"edition":{"model":"nftEdition","isOriginal":true,"address":"9FNjUMx3sHdu7pDm15MSVFTxdLeqzWjntJ4iSLJjDpvT","supply":"00","maxSupply":"00"}},{"model":"nft","updateAuthorityAddress":"GFHtmdF9qaELYdjzDZpxzdwRH6bQkB7TfyFgXRq8YN4i","json":null,"jsonLoaded":true,"name":"ASSEMBLY #2","symbol":"","uri":"https://img.web3omega.com/assemblies/assembly_2.json","isMutable":true,"primarySaleHappened":false,"sellerFeeBasisPoints":500,"editionNonce":253,"creators":[{"address":"GFHtmdF9qaELYdjzDZpxzdwRH6bQkB7TfyFgXRq8YN4i","verified":true,"share":100}],"tokenStandard":0,"collection":{"verified":false,"key":"FuHDXiHEc2cnTAXrmSbkME5MsuABg5Ayst1d9D2EuMnB","address":"FuHDXiHEc2cnTAXrmSbkME5MsuABg5Ayst1d9D2EuMnB"},"collectionDetails":null,"uses":null,"address":"6WhkrFGd9SnU3ewmzVmA3qRN1XqWqr6m1Ka36Hs4ZxsA","metadataAddress":"EtvsHRhVa3PZ51rGUaGepfXSuEZucStaEV1pdDhJQXg3","mint":{"model":"mint","address":"6WhkrFGd9SnU3ewmzVmA3qRN1XqWqr6m1Ka36Hs4ZxsA","mintAuthorityAddress":"3p5HfV6uhUvVUsbubZ7ji89qGopZV757GPw2Zykotfg5","freezeAuthorityAddress":"3p5HfV6uhUvVUsbubZ7ji89qGopZV757GPw2Zykotfg5","decimals":0,"supply":{"basisPoints":"01","currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"isWrappedSol":false,"currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"token":{"model":"token","address":"2xFnhpC6smbiXfvLxHeDPVu4JkQXzwDYf1EyFBXFqDy8","isAssociatedToken":true,"mintAddress":"6WhkrFGd9SnU3ewmzVmA3qRN1XqWqr6m1Ka36Hs4ZxsA","ownerAddress":"GFHtmdF9qaELYdjzDZpxzdwRH6bQkB7TfyFgXRq8YN4i","amount":{"basisPoints":"01","currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"closeAuthorityAddress":null,"delegateAddress":null,"delegateAmount":{"basisPoints":"00","currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"state":1},"edition":{"model":"nftEdition","isOriginal":true,"address":"3p5HfV6uhUvVUsbubZ7ji89qGopZV757GPw2Zykotfg5","supply":"00","maxSupply":"00"}},{"model":"nft","updateAuthorityAddress":"GFHtmdF9qaELYdjzDZpxzdwRH6bQkB7TfyFgXRq8YN4i","json":null,"jsonLoaded":true,"name":"ASSEMBLY #3","symbol":"","uri":"https://img.web3omega.com/assemblies/assembly_3.json","isMutable":true,"primarySaleHappened":false,"sellerFeeBasisPoints":500,"editionNonce":255,"creators":[{"address":"GFHtmdF9qaELYdjzDZpxzdwRH6bQkB7TfyFgXRq8YN4i","verified":true,"share":100}],"tokenStandard":0,"collection":{"verified":false,"key":"FuHDXiHEc2cnTAXrmSbkME5MsuABg5Ayst1d9D2EuMnB","address":"FuHDXiHEc2cnTAXrmSbkME5MsuABg5Ayst1d9D2EuMnB"},"collectionDetails":null,"uses":null,"address":"2iKLrqT19HZvChYY59mQ3KSCSX1chGhHDfKzGQFwCJSo","metadataAddress":"3pL7e1ZrV9Arhdm7Xxm4BoqZNYFGxgc3trohMtSLEL6c","mint":{"model":"mint","address":"2iKLrqT19HZvChYY59mQ3KSCSX1chGhHDfKzGQFwCJSo","mintAuthorityAddress":"7aHcSYWMJnfKePsuU7S77pMyQsD5ZCENnAZsmFZZUV2v","freezeAuthorityAddress":"7aHcSYWMJnfKePsuU7S77pMyQsD5ZCENnAZsmFZZUV2v","decimals":0,"supply":{"basisPoints":"01","currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"isWrappedSol":false,"currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"token":{"model":"token","address":"9mf6xcUHdGdNAdsegTkAFkGHsdMPc6QSNMXpb5mbQwR3","isAssociatedToken":true,"mintAddress":"2iKLrqT19HZvChYY59mQ3KSCSX1chGhHDfKzGQFwCJSo","ownerAddress":"GFHtmdF9qaELYdjzDZpxzdwRH6bQkB7TfyFgXRq8YN4i","amount":{"basisPoints":"01","currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"closeAuthorityAddress":null,"delegateAddress":null,"delegateAmount":{"basisPoints":"00","currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"state":1},"edition":{"model":"nftEdition","isOriginal":true,"address":"7aHcSYWMJnfKePsuU7S77pMyQsD5ZCENnAZsmFZZUV2v","supply":"00","maxSupply":"00"}},{"model":"nft","updateAuthorityAddress":"GFHtmdF9qaELYdjzDZpxzdwRH6bQkB7TfyFgXRq8YN4i","json":null,"jsonLoaded":true,"name":"ASSEMBLY #4","symbol":"","uri":"https://img.web3omega.com/assemblies/assembly_4.json","isMutable":true,"primarySaleHappened":false,"sellerFeeBasisPoints":500,"editionNonce":254,"creators":[{"address":"GFHtmdF9qaELYdjzDZpxzdwRH6bQkB7TfyFgXRq8YN4i","verified":true,"share":100}],"tokenStandard":0,"collection":{"verified":false,"key":"FuHDXiHEc2cnTAXrmSbkME5MsuABg5Ayst1d9D2EuMnB","address":"FuHDXiHEc2cnTAXrmSbkME5MsuABg5Ayst1d9D2EuMnB"},"collectionDetails":null,"uses":null,"address":"9GzAy48XRrnMNqq2LXyPfETVVmhbtWwLo1h6wnMD9TQQ","metadataAddress":"34pxzJYT1Cb4Y9dno4fC7JK65nniWXBKM7DreQAHoJcM","mint":{"model":"mint","address":"9GzAy48XRrnMNqq2LXyPfETVVmhbtWwLo1h6wnMD9TQQ","mintAuthorityAddress":"3ByKhGBG8ji43zVoa9XM891iKM4TL1Fr3YPAFbXb1jAy","freezeAuthorityAddress":"3ByKhGBG8ji43zVoa9XM891iKM4TL1Fr3YPAFbXb1jAy","decimals":0,"supply":{"basisPoints":"01","currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"isWrappedSol":false,"currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"token":{"model":"token","address":"2Th7mJ7NC2XkeGBwPycBBhZRuzR5i8G1S5gGzqHjT4FL","isAssociatedToken":true,"mintAddress":"9GzAy48XRrnMNqq2LXyPfETVVmhbtWwLo1h6wnMD9TQQ","ownerAddress":"GFHtmdF9qaELYdjzDZpxzdwRH6bQkB7TfyFgXRq8YN4i","amount":{"basisPoints":"01","currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"closeAuthorityAddress":null,"delegateAddress":null,"delegateAmount":{"basisPoints":"00","currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"state":1},"edition":{"model":"nftEdition","isOriginal":true,"address":"3ByKhGBG8ji43zVoa9XM891iKM4TL1Fr3YPAFbXb1jAy","supply":"00","maxSupply":"00"}},{"model":"nft","updateAuthorityAddress":"GFHtmdF9qaELYdjzDZpxzdwRH6bQkB7TfyFgXRq8YN4i","json":null,"jsonLoaded":true,"name":"ASSEMBLY #5","symbol":"","uri":"https://img.web3omega.com/assemblies/assembly_5.json","isMutable":true,"primarySaleHappened":false,"sellerFeeBasisPoints":500,"editionNonce":254,"creators":[{"address":"GFHtmdF9qaELYdjzDZpxzdwRH6bQkB7TfyFgXRq8YN4i","verified":true,"share":100}],"tokenStandard":0,"collection":{"verified":false,"key":"FuHDXiHEc2cnTAXrmSbkME5MsuABg5Ayst1d9D2EuMnB","address":"FuHDXiHEc2cnTAXrmSbkME5MsuABg5Ayst1d9D2EuMnB"},"collectionDetails":null,"uses":null,"address":"6e8xnL6LA3VLLxvJHrMMkBLMzTpZ2x6geYxdNFYJt4dx","metadataAddress":"AabD6FcxbXoeCaMhrUS2fvVzeFbhoLJA41imPEDFw4uj","mint":{"model":"mint","address":"6e8xnL6LA3VLLxvJHrMMkBLMzTpZ2x6geYxdNFYJt4dx","mintAuthorityAddress":"515iPgiEGisNs1XQYmYkvGZcX7BvJCSC2Z6CfToMdUQ3","freezeAuthorityAddress":"515iPgiEGisNs1XQYmYkvGZcX7BvJCSC2Z6CfToMdUQ3","decimals":0,"supply":{"basisPoints":"01","currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"isWrappedSol":false,"currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"token":{"model":"token","address":"Beawwe5yHF7AwYupF7gx4HwmKPtEvx635qy2jXqNncKc","isAssociatedToken":true,"mintAddress":"6e8xnL6LA3VLLxvJHrMMkBLMzTpZ2x6geYxdNFYJt4dx","ownerAddress":"GFHtmdF9qaELYdjzDZpxzdwRH6bQkB7TfyFgXRq8YN4i","amount":{"basisPoints":"01","currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"closeAuthorityAddress":null,"delegateAddress":null,"delegateAmount":{"basisPoints":"00","currency":{"symbol":"Token","decimals":0,"namespace":"spl-token"}},"state":1},"edition":{"model":"nftEdition","isOriginal":true,"address":"515iPgiEGisNs1XQYmYkvGZcX7BvJCSC2Z6CfToMdUQ3","supply":"00","maxSupply":"00"}}]`);
*/

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

let plzContinue = false;

const run = async () => {

    const urlPrefix = 'https://img.web3omega.dev';

    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    
    const payer: Keypair = Keypair.fromSecretKey(Uint8Array.from(wallet));

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
  
    await new Promise(resolve => setTimeout(resolve, 30000));
  
    for(let i = 0; i < amountOfTraitsCollections; i++){
      console.log('Create collectionTrait', i)
  
        collectionTraits[i] = (await metaplex.nfts().create({
          uri: `${urlPrefix}/collections/traits_col_${traitCollectionNames[i]}.json`,
          name: `TRAIT COLL #${traitCollectionNames[i]}`,
          sellerFeeBasisPoints: 500, // Represents 5.00%.
          collection: collectionAllTraits.address
        })).nft;
  
        plzContinue = false;
        while(!plzContinue)
        {
            await new Promise(resolve => setTimeout(resolve, 5000));
        
            try {
                const gotAccount = await connection.getAccountInfo(collectionTraits[i].address);
                plzContinue = true;
            } catch(err) {
                //retry
            }
        }

        await new Promise(resolve => setTimeout(resolve, 30000));
  
        await metaplex.nfts().verifyCollection({
          mintAddress: collectionTraits[i].address,
          collectionMintAddress: collectionAllTraits.address,
          isSizedCollection: false
        })
  
    }

    console.log(`collectionTraits: ${JSON.stringify(collectionTraits)}`)

  
    await new Promise(resolve => setTimeout(resolve, 30000));
  
    collectionAssembled = (await metaplex.nfts().create({
    uri: `${urlPrefix}/collections/assembled.json`,
    name: "ASSEMBLED COLLECTION",
    sellerFeeBasisPoints: 500, // Represents 5.00%.
    })).nft;

    console.log(`collectionAssembled: ${JSON.stringify(collectionAssembled)}`)
  
    plzContinue = false;
        while(!plzContinue)
        {
            await new Promise(resolve => setTimeout(resolve, 5000));
        
            try {
                const gotAccount = await connection.getAccountInfo(collectionAssembled.address);
                plzContinue = true;
            } catch(err) {
                //retry
            }
        }
        await new Promise(resolve => setTimeout(resolve, 30000));
  
    for(let i = 0; i < amountOfAssembliesToInit; i++){
  
      console.log('Create assemblies', i)
        assemblies[i] = (await metaplex.nfts().create({
            uri: `${urlPrefix}/assemblies/assembly_${i + 1}.json`,
            name: `ASSEMBLY #${i + 1}`,
            sellerFeeBasisPoints: 500, // Represents 5.00%.
            collection: collectionAssembled.address
        })).nft;
    
        plzContinue = false;
        while(!plzContinue)
        {
            await new Promise(resolve => setTimeout(resolve, 5000));
        
            try {
                const gotAccount = await connection.getAccountInfo(assemblies[i].address);
                plzContinue = true;
            } catch(err) {
                //retry
            }
        }

        await new Promise(resolve => setTimeout(resolve, 30000));

        await metaplex.nfts().verifyCollection({
            mintAddress: assemblies[i].address,
            collectionMintAddress: collectionAssembled.address,
            isSizedCollection: false
        })
    }

    console.log(`assemblies: ${JSON.stringify(assemblies)}`)

    await new Promise(resolve => setTimeout(resolve, 2500));

    await Promise.all(collectionTraits.map(async (collection, index) => {
  
      await new Promise(resolve => setTimeout(resolve, index * 2000));
  
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
  
        plzContinue = false;
        while(!plzContinue)
        {
            await new Promise(resolve => setTimeout(resolve, 6000));
        
            try {
                const gotAccount = await connection.getAccountInfo(traits[traitId].address);
                plzContinue = true;
            } catch(err) {
                //retry
            }
        }

        await new Promise(resolve => setTimeout(resolve, 120000));
  
        await metaplex.nfts().verifyCollection({
        mintAddress: traits[traitId].address,
        collectionMintAddress: collection.address,
        isSizedCollection: false
        })

        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    console.log(`traits: ${JSON.stringify(traits)}`)
    }))

    console.log("DONE")
    console.log(`collectionAllTraits: ${JSON.stringify(collectionAllTraits)}`)
    console.log(`collectionTraits: ${JSON.stringify(collectionTraits)}`)
    console.log(`collectionAssembled: ${JSON.stringify(collectionAssembled)}`)

    console.log(`traits: ${JSON.stringify(traits)}`)
    console.log(`assemblies: ${JSON.stringify(assemblies)}`)
}

run ();