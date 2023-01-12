use anchor_lang::prelude::*;
use anchor_spl::{token::{Mint, Token, TokenAccount}, metadata::{set_and_verify_collection, SetAndVerifyCollection}};


declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

const TRAIT_PDA_SEED: &[u8] = b"trait";

#[program]
pub mod nft_dressing {

    

    use super::*;

    pub fn apply_trait(ctx: Context<ApplyTrait>) -> Result<()> {
        if ctx.accounts.assembled_mint_token_account.amount == 0 {
            return Err(ErrorCode::OwnerDoesNotOwnNFT.into()) 
        }

        /// STEP 1 set the collection
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            SetAndVerifyCollection {
                metadata: ctx.accounts.trait_metadata.to_account_info(),
                collection_authority: ctx.accounts.owner.to_account_info(), //TODO authority should be the PDA
                payer: ctx.accounts.owner.to_account_info(),
                update_authority: ctx.accounts.owner.to_account_info(), //TODO authority should be the PDA
                collection_mint: ctx.accounts.assembled_mint.to_account_info(),
                collection_metadata: ctx.accounts.assembled_metadata.to_account_info(),
                collection_master_edition: ctx.accounts.assembled_master_edition.to_account_info(), 
            }
        );
        
        set_and_verify_collection(cpi_ctx, None)?;

        /// STEP 2 transfer to the vault 

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
    /// CHECK: 
    pub assembled_metadata: UncheckedAccount<'info>,
    pub assembled_mint: Account<'info, Mint>, 
    /// CHECK: 
    pub assembled_master_edition: UncheckedAccount<'info>,
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