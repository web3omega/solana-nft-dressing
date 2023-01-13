use anchor_lang::prelude::*;
use anchor_spl::{
    token::{Mint, Token, TokenAccount, Transfer, transfer},
    metadata::{SetAndVerifyCollection, set_and_verify_collection}
};
use mpl_token_metadata::instruction::{MetadataInstruction, unverify_collection};
use solana_program::instruction::Instruction;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

const TRAIT_PDA_SEED: &[u8] = b"trait";


//// TODO MOVE THIS TO METAPLEX
pub fn unverify_collection_anchor<'info>(
    ctx: CpiContext<'_, '_, '_, 'info, UnVerifyCollection<'info>>,
    collection_authority_record: Option<Pubkey>,
) -> Result<()> {
    let ix = unverify_collection(
        mpl_token_metadata::ID,
        *ctx.accounts.metadata.key,
        *ctx.accounts.collection_authority.key,
        *ctx.accounts.collection_mint.key,
        *ctx.accounts.collection_metadata.key,
        *ctx.accounts.collection_master_edition.key,
        collection_authority_record,
    );
    solana_program::program::invoke_signed(
        &ix,
        &ToAccountInfos::to_account_infos(&ctx),
        ctx.signer_seeds,
    )
    .map_err(Into::into)
}

#[derive(Accounts)]
pub struct UnVerifyCollection<'info> {
    /// CHECK:
    //pub payer: AccountInfo<'info>,
    /// CHECK:
    pub metadata: AccountInfo<'info>,
    /// CHECK:
    pub collection_authority: AccountInfo<'info>,
    /// CHECK:
    pub collection_mint: AccountInfo<'info>,
    /// CHECK:
    pub collection_metadata: AccountInfo<'info>,
    /// CHECK:
    pub collection_master_edition: AccountInfo<'info>,
}

/// # Unverify Collection
///
/// If a MetadataAccount Has a Collection allow an Authority of the Collection to unverify an NFT in a Collection
///
/// ### Accounts:
///
///   0. `[writable]` Metadata account
///   1. `[signer]` Collection Authority
///   2. `[signer]` payer
///   3. `[]` Mint of the Collection
///   4. `[]` Metadata Account of the Collection
///   5. `[]` MasterEdition2 Account of the Collection Token
/*#[allow(clippy::too_many_arguments)]
pub fn unverify_collection(
    program_id: Pubkey,
    metadata: Pubkey,
    collection_authority: Pubkey,
    payer: Pubkey,
    collection_mint: Pubkey,
    collection: Pubkey,
    collection_master_edition_account: Pubkey,
    collection_authority_record: Option<Pubkey>,
) -> Instruction {
    let mut accounts = vec![
        AccountMeta::new(metadata, false),
        AccountMeta::new(collection_authority, true),
        AccountMeta::new(payer, true),
        AccountMeta::new_readonly(collection_mint, false),
        AccountMeta::new_readonly(collection, false),
        AccountMeta::new_readonly(collection_master_edition_account, false),
    ];

    if let Some(collection_authority_record) = collection_authority_record {
        accounts.push(AccountMeta::new_readonly(
            collection_authority_record,
            false,
        ));
    }

    Instruction {
        program_id,
        accounts,
        data: MetadataInstruction::UnverifyCollection
            .try_to_vec()
            .unwrap(),
    }
}*/

#[program]
pub mod nft_dressing {

    use anchor_spl::token;

    use super::*;

    pub fn apply_trait(ctx: Context<ApplyTrait>) -> Result<()> {
        if ctx.accounts.assembled_mint_token_account.amount == 0 {
            return Err(ErrorCode::OwnerDoesNotOwnNFT.into()) 
        }

        // STEP 1 set the collection
        let collection_cpi_ctx = CpiContext::new(
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
        
        set_and_verify_collection(collection_cpi_ctx, None)?;

        // STEP 2 transfer to the vault 
        let transfer_cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.trait_token_account.to_account_info(),
                to: ctx.accounts.trait_vault.to_account_info(),
                authority: ctx.accounts.owner.to_account_info(),
            }
        );

        transfer(transfer_cpi_ctx, 1)?;
        
        Ok(())
    }

    pub fn remove_trait(ctx: Context<RemoveTrait>) -> Result<()> {
        if ctx.accounts.assembled_mint_token_account.amount == 0 {
            return Err(ErrorCode::OwnerDoesNotOwnNFT.into()) 
        }

        // STEP 1 Unverify
        let unverify_cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            UnVerifyCollection {
                metadata: ctx.accounts.trait_metadata.to_account_info(),
                collection_authority: ctx.accounts.owner.to_account_info(), //TODO authority should be the PDA
                collection_mint: ctx.accounts.assembled_mint.to_account_info(),
                collection_metadata: ctx.accounts.assembled_metadata.to_account_info(),
                collection_master_edition: ctx.accounts.assembled_master_edition.to_account_info(),  
            }
        );

        unverify_collection_anchor(unverify_cpi_ctx, None)?;

        // STEP 2 set the collection
        let collection_cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            SetAndVerifyCollection {
                metadata: ctx.accounts.trait_metadata.to_account_info(),
                collection_authority: ctx.accounts.owner.to_account_info(), //TODO authority should be the PDA
                payer: ctx.accounts.owner.to_account_info(),
                update_authority: ctx.accounts.owner.to_account_info(), //TODO authority should be the PDA
                collection_mint: ctx.accounts.trait_collection_mint.to_account_info(),
                collection_metadata: ctx.accounts.trait_collection_metadata.to_account_info(),
                collection_master_edition: ctx.accounts.trait_coll_master_edition.to_account_info(), 
            }
        );
        
        set_and_verify_collection(collection_cpi_ctx, None)?;

        // STEP 2 transfer from vault 
        let assembled_key = ctx.accounts.assembled_mint.key();
        let trait_coll_mint_key = ctx.accounts.trait_collection_mint.key();
        let (_vault_key, vault_key_bump) =
            Pubkey::find_program_address(&[TRAIT_PDA_SEED, assembled_key.as_ref(), trait_coll_mint_key.as_ref()], ctx.program_id);

        let seeds = &[TRAIT_PDA_SEED, assembled_key.as_ref(), trait_coll_mint_key.as_ref(), &[vault_key_bump]];
        let signer = &[&seeds[..]];

        let transfer_cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.trait_vault.to_account_info(),
                to: ctx.accounts.trait_token_account.to_account_info(),
                authority: ctx.accounts.trait_vault.to_account_info(),
            },
            signer
        );

        transfer(transfer_cpi_ctx, 1)?;

        // STEP 3 close the token account manually
        let cpi_accounts = anchor_spl::token::CloseAccount {
            account: ctx.accounts.trait_vault.to_account_info().clone(),
            destination: ctx.accounts.owner.to_account_info().clone(),
            authority: ctx.accounts.trait_vault.to_account_info().clone(),
        };

        let cpi_program = ctx.accounts.token_program.to_account_info().clone();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::close_account(cpi_ctx)?;

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
        token::authority = trait_vault)] //TODO check if this is possible? The ownership to the program/PDA to allow traded NFTs to disassemble
    pub trait_vault: Box<Account<'info, TokenAccount>>,
    #[account(
        mut
    )]
    /// CHECK: 
    pub trait_metadata: UncheckedAccount<'info>,
    pub trait_mint: Account<'info, Mint>, 
    #[account(
        mut,
        token::mint = trait_mint,
        token::authority = owner)] 
    pub trait_token_account: Box<Account<'info, TokenAccount>>,
    pub trait_collection: Account<'info, Mint>, 
    #[account(
        mut
    )]
    /// CHECK: 
    pub assembled_metadata: UncheckedAccount<'info>,
    pub assembled_mint: Account<'info, Mint>, 
    /// CHECK: 
    pub assembled_master_edition: UncheckedAccount<'info>,
    #[account(
        token::mint = assembled_mint,
        token::authority = owner)] 
    pub assembled_mint_token_account: Box<Account<'info, TokenAccount>>,
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
        seeds = [TRAIT_PDA_SEED, assembled_mint.to_account_info().key().as_ref(), trait_collection_mint.to_account_info().key().as_ref()],
        bump,
        //close = owner,
        token::mint = trait_mint,
        token::authority = trait_vault)]
    pub trait_vault: Box<Account<'info, TokenAccount>>,
    #[account(
        mut
    )]
    /// CHECK: 
    pub trait_metadata: UncheckedAccount<'info>,
    pub trait_mint: Account<'info, Mint>, 
    #[account(
        mut,
        token::mint = trait_mint,
        token::authority = owner)] 
    pub trait_token_account: Box<Account<'info, TokenAccount>>,
    #[account(
        mut
    )]
    /// CHECK: 
    pub trait_collection_metadata: UncheckedAccount<'info>,
    pub trait_collection_mint: Account<'info, Mint>, 
    /// CHECK: 
    pub trait_coll_master_edition: UncheckedAccount<'info>,
    #[account(
        mut
    )]
    /// CHECK: 
    pub assembled_metadata: UncheckedAccount<'info>,
    pub assembled_mint: Account<'info, Mint>, 
    /// CHECK: 
    pub assembled_master_edition: UncheckedAccount<'info>,
    #[account(
        token::mint = assembled_mint,
        token::authority = owner)] 
    pub assembled_mint_token_account: Box<Account<'info, TokenAccount>>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    /// CHECK: //TODO need to ensure its the metadata program
    pub metadata_program: UncheckedAccount<'info>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Owner does not own this NFT")]
    OwnerDoesNotOwnNFT
}