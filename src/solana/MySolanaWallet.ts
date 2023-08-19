import * as anchor from '@project-serum/anchor';
import Provider, { Wallet } from "@project-serum/anchor/dist/cjs/provider"
import { WalletAdapter } from '@metaplex-foundation/js';

import { PublicKey, Transaction, Connection } from '@solana/web3.js';
import { SolanaWallet } from "@web3auth/solana-provider";



export class MySolanaWallet implements Wallet, WalletAdapter {

    connection: Connection;
  
    solanaWallet: SolanaWallet;
  
    publicKey!: PublicKey;
  
    constructor(solanaWallet: SolanaWallet, connection: Connection) {
      this.connection = connection;
      this.solanaWallet = solanaWallet;
    //   this.publicKey = new PublicKey("");
    }
  
    signTransaction(tx: Transaction): Promise<Transaction> {
      return this.solanaWallet.signTransaction(tx);
    }
  
    signAllTransactions(txs: Transaction[]): Promise<Transaction[]> {
      return this.solanaWallet.signAllTransactions(txs);
    }
  
    // Get the first public key in solana wallet accounts.
    async getPublicKey(): Promise<PublicKey> {
      const accounts = await this.accounts();
      const result = new PublicKey(accounts[0]);
      this.publicKey = result;
      return result;
    }
  
    async accounts(): Promise<string[]> {
      return await this.solanaWallet.requestAccounts();
    }
  
    //Assuming user is already logged in.
    async getPrivateKey() {
      const privateKey: any = await this.solanaWallet.request({
        method: "solanaPrivateKey"
      });
      return String(privateKey);
    }
  
    async isConnected() {
      const accounts = await this.accounts();
      return accounts.length > 0;
    }
  }
  
  export class MySolanaProvider implements Provider {
  
    wallet: MySolanaWallet;
  
    connection: anchor.web3.Connection;
  
    publicKey?: anchor.web3.PublicKey;
  
    constructor(connection: Connection, wallet: MySolanaWallet) {
      this.connection = connection;
      this.wallet = wallet;
    }
  
    async getPublicKey(): Promise<PublicKey> {
      return await this.wallet.getPublicKey();
    }
  
    async getPrivateKey(): Promise<string> {
      return await this.wallet.getPrivateKey();
    }
  
    async send(tx: anchor.web3.Transaction,
          signers?: anchor.web3.Signer[],
          opts?: anchor.web3.SendOptions): Promise<string> {
            const wallet  = this.wallet.solanaWallet;
            const { signature } = await wallet.signAndSendTransaction(tx);
            return signature;
    }
  
    async sendAndConfirm(tx: anchor.web3.Transaction, signers?: anchor.web3.Signer[], opts?: anchor.web3.ConfirmOptions): Promise<string>{
      const wallet  = this.wallet.solanaWallet;
  
      console.log("sendAndConfirm signers: ",  signers);
  
      if (signers !== undefined) {
        signers.forEach((signer) => {
          tx.partialSign(signer);
        })
      }
      
      const { signature } = await wallet.signAndSendTransaction(tx);
      return signature;
    }
    async sendAll?(txWithSigners: { tx: anchor.web3.Transaction; signers?: anchor.web3.Signer[]; }[], opts?: anchor.web3.ConfirmOptions): Promise<string[]>{
        const signatures: string[] = await Promise.all(txWithSigners.map(async ({ tx, signers }) => {
          const wallet = this.wallet.solanaWallet;
          if (signers !== undefined) {
            signers.forEach((signer) => {
              tx.partialSign(signer);
            })
          }
          const { signature } = await wallet.signAndSendTransaction(tx);
          return signature;
        }));
        return signatures;
      }

    simulate?(tx: anchor.web3.Transaction, signers?: anchor.web3.Signer[], commitment?: anchor.web3.Commitment, includeAccounts?: boolean | anchor.web3.PublicKey[]): Promise<anchor.utils.rpc.SuccessfulTxSimulationResponse>;
  
  }