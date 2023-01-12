use anchor_lang::prelude::*;
use anchor_spl::{token::{Mint, Token, TokenAccount}, metadata::{set_and_verify_collection, SetAndVerifyCollection, update_metadata_accounts_v2, UpdateMetadataAccountsV2}};
use mpl_token_metadata::state::TokenMetadataAccount;
use mpl_token_metadata::state::{DataV2, Collection};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

const TRAIT_PDA_SEED: &[u8] = b"trait";

#[program]
pub mod nft_dressing {

    

    use super::*;

    pub fn apply_trait(ctx: Context<ApplyTrait>) -> Result<()> {
        if ctx.accounts.assembled_mint_token_account.amount == 0 {
            return Err(ErrorCode::OwnerDoesNotOwnNFT.into()) 
        }

        let metadata = mpl_token_metadata::state::Metadata::from_account_info(&ctx.accounts.trait_metadata.to_account_info())?;
        //anchor_spl::metadata::set_and_verify_collection();

        msg!("TEST {:?}", metadata.mint);

        ///
        /// Step 1 Update the metadata
        /// 
         
       // let mut newCollection = metadata.collection.unwrap();
       // newCollection.key = ctx.accounts.assembled_mint.key();

        let new_data = DataV2 {
            name: metadata.data.name,
            uri: metadata.data.uri,
            symbol: metadata.data.symbol,
            seller_fee_basis_points: metadata.data.seller_fee_basis_points,
            creators: metadata.data.creators,
            collection: Some(Collection { 
                verified: false,
                key: ctx.accounts.assembled_mint.key()
            }),
            uses: metadata.uses
        };
        //newData.collection
        /*let newColl = Collection::new(
            key: ctx.accounts.assembled_mint.key(),
        );*/

        //newData.collection = metadata.collection;
        //newData.collection.unwrap().key = ctx.accounts.assembled_mint.key();

        let metadata_update_cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            UpdateMetadataAccountsV2 {
                metadata: ctx.accounts.trait_metadata.to_account_info(),
                update_authority: ctx.accounts.owner.to_account_info(),//TODO authority should be the PDA
            }
        );

        update_metadata_accounts_v2(
            metadata_update_cpi_ctx, 
            None, 
            Some(new_data),
            None,
            None
        )?;
        

        ///
        /// Step 2 Set and Verify the collection
        /// 

        /*let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            SetAndVerifyCollection {
                metadata: ctx.accounts..to_account_info(),
                collection_authority: ctx.account.owner.to_account_info(), //TODO authority should be the PDA
                payer: ctx.account.owner.to_account_info(),
                update_authority: ctx.account.owner.to_account_info(), //TODO authority should be the PDA
                collection_mint: ctx.account.assembled_mint.to_account_info(),
                collection_metadata: 
                collection_master_edition: 
            }
        );
        
        set_and_verify_collection()*/
        //ctx.accounts.assembled_mint.to_account_info()

        Ok(())
    }

    pub fn remove_trait(ctx: Context<RemoveTrait>) -> Result<()> {
        if ctx.accounts.assembled_mint_token_account.amount == 0 {
            return Err(ErrorCode::OwnerDoesNotOwnNFT.into()) 
        }

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction()]
pub struct ApplyTrait<'info> {
    #[account(
        init,
        seeds = [TRAIT_PDA_SEED, assembled_mint.to_account_info().key().as_ref(), trait_collection.to_account_info().key().as_ref()], // This way only 1 trait of 1 trait collection can be added
        bump,
        payer = owner,
        token::mint = trait_mint,
        token::authority = trait_pda)] //TODO check if this is possible? The ownership to the program/PDA to allow traded NFTs to disassemble
    pub trait_pda: Account<'info, TokenAccount>,
    #[account(
        mut
    )]
    /// CHECK: 
    pub trait_metadata: UncheckedAccount<'info>,
    pub trait_mint: Account<'info, Mint>, 
    pub trait_collection: Account<'info, Mint>, 
    pub assembled_mint: Account<'info, Mint>, 
    #[account(
        token::mint = assembled_mint,
        token::authority = owner)] 
    pub assembled_mint_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub rent: Sysvar<'info, Rent>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    /// CHECK: //TODO need to ensure its the metadata program
    pub metadata_program: UncheckedAccount<'info>,
}

#[derive(Accounts)]
#[instruction()]
pub struct RemoveTrait<'info> {
    #[account(
        mut,
        seeds = [TRAIT_PDA_SEED, assembled_mint.to_account_info().key().as_ref(), trait_collection.to_account_info().key().as_ref()],
        bump,
        close = owner,
        token::mint = trait_mint,
        token::authority = trait_pda)]
    pub trait_pda: Account<'info, TokenAccount>,
    pub trait_mint: Account<'info, Mint>, 
    pub trait_collection: Account<'info, Mint>, 
    pub assembled_mint: Account<'info, Mint>, 
    #[account(
        token::mint = assembled_mint,
        token::authority = owner)] 
    pub assembled_mint_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Owner does not own this NFT")]
    OwnerDoesNotOwnNFT
}