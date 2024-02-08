// import { Metaplex, keypairIdentity } from '@metaplex-foundation/js';
// import { Connection, Keypair, PublicKey } from '@solana/web3.js';


// export const getAllNFTs = async (address: string) => {
//     const connection = new Connection('https://api.devnet.solana.com', "confirmed");
//     const keypair = Keypair.generate();
//     const metaplex = new Metaplex(connection);
//     metaplex.use(keypairIdentity(keypair));
  
//     const owner = new PublicKey(address);
//     const allNFTs = await metaplex.nfts().findAllByOwner({owner});

//     // const allNFTsWithCreator = await metaplex.nfts().findAllByCreator({creator: owner});
  
//     console.log("allNFTs: ", allNFTs);
//     // console.log("allNFTsWithOwner: ", allNFTsWithCreator);

//     return allNFTs;
// }