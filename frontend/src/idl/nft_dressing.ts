export type NftDressing = {
    version: '0.1.0';
    name: 'nft_dressing';
    instructions: [
        {
            name: 'applyTrait';
            accounts: [
                {
                    name: 'traitVault';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'traitMetadata';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'traitMint';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'traitTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'traitCollectionMetadata';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'traitCollection';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'traitCollMasterEdition';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'assembledMetadata';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'assembledMint';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'assembledMasterEdition';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'assembledMintTokenAccount';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'updateAuthority';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'rent';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'tokenProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'metadataProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [];
        },
        {
            name: 'removeTrait';
            accounts: [
                {
                    name: 'traitVault';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'traitMetadata';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'traitMint';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'traitTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'traitCollectionMetadata';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'traitCollectionMint';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'traitCollMasterEdition';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'assembledMetadata';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'assembledMint';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'assembledMasterEdition';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'assembledMintTokenAccount';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'updateAuthority';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'tokenProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'metadataProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [];
        }
    ];
    errors: [
        {
            code: 6000;
            name: 'OwnerDoesNotOwnNFT';
            msg: 'Owner does not own this NFT';
        }
    ];
};

export const IDL: NftDressing = {
    version: '0.1.0',
    name: 'nft_dressing',
    instructions: [
        {
            name: 'applyTrait',
            accounts: [
                {
                    name: 'traitVault',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'traitMetadata',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'traitMint',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'traitTokenAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'traitCollectionMetadata',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'traitCollection',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'traitCollMasterEdition',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'assembledMetadata',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'assembledMint',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'assembledMasterEdition',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'assembledMintTokenAccount',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'updateAuthority',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'owner',
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: 'rent',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'tokenProgram',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'systemProgram',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'metadataProgram',
                    isMut: false,
                    isSigner: false,
                },
            ],
            args: [],
        },
        {
            name: 'removeTrait',
            accounts: [
                {
                    name: 'traitVault',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'traitMetadata',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'traitMint',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'traitTokenAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'traitCollectionMetadata',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'traitCollectionMint',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'traitCollMasterEdition',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'assembledMetadata',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'assembledMint',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'assembledMasterEdition',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'assembledMintTokenAccount',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'updateAuthority',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'owner',
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: 'tokenProgram',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'systemProgram',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'metadataProgram',
                    isMut: false,
                    isSigner: false,
                },
            ],
            args: [],
        },
    ],
    errors: [
        {
            code: 6000,
            name: 'OwnerDoesNotOwnNFT',
            msg: 'Owner does not own this NFT',
        },
    ],
};
