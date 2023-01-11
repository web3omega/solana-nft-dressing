use anchor_lang::prelude::*;
use anchor_spl::{token::{self, Mint, Token, TokenAccount}};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

const TRAIT_PDA_SEED: &[u8] = b"trait";

#[program]
pub mod nft_dressing {
    use super::*;

    pub fn apply_trait(ctx: Context<ApplyTrait>) -> Result<()> {
        if ctx.accounts.assembled_mint_token_account.amount == 0 {
            return Err(ErrorCode::OwnerDoesNotOwnNFT.into()) 
        }
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
    pub trait_mint: Account<'info, Mint>, 
    /// CHECK: TODO MAKE THIS A COLLECTION ACCOUNT
    pub trait_collection: UncheckedAccount<'info>,
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
        /// CHECK: TODO MAKE THIS A COLLECTION ACCOUNT
    pub trait_collection: UncheckedAccount<'info>,
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