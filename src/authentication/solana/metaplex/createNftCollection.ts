import { GenericFile, Umi } from "@metaplex-foundation/umi";
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'
import { NftMetadata } from "./NftMetadata";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";

// create candy machine
export async function createNftCollection(umi: Umi) {

    const filePath = "assets/astronaut-monkey1-200x200.png";
    const response = await fetch(filePath);

    console.log("response", response);
    const blob = await response.blob();

    if (blob) {
        const arrayBuffer = await blob.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const file: GenericFile = {
            buffer: uint8Array,
            fileName: 'astronaut-monkey1-200x200.png',
            displayName: 'Astronaut Monkey',
            uniqueName: 'astronaut-monkey1-200x200.png',
            contentType: null,
            extension: null,
            tags: []
        };

        const [fileUri] = await umi.uploader.upload([file]);

        console.log("fileUri", fileUri);

        // const collectionMint = generateSigner(umi)

        // await createNft(umi, {
        //     mint: collectionMint,
        //     name: 'My Collection',
        //     uri: 'https://bafkreid5gmtk2w7dwfnt3xtje7kagjyqanyhjfkdt3c3avsirfpv52vzie.ipfs.nftstorage.link',
        //     sellerFeeBasisPoints: percentAmount(5.5), // 5.5%
        //     isCollection: true,
        //     authorizationRules: publicKey('2LbAtCJSaHqTnP9M5QSjvAMXk79RNLusFspFN5Ew67TC'),
        //     // delegateRecord: publicKey('2LbAtCJSaHqTnP9M5QSjvAMXk79RNLusFspFN5Ew67TC')
        //   }).sendAndConfirm(umi);
        // // const transactionHash = bs58.encode(collectionNft.signature);

        // console.log("collectionNft collectionMint:", collectionMint);



        // Create NFT metaddata for collection
        const metadata = new NftMetadata({ name: "Monkey Collection", symbol: "MONKEY", image: fileUri })
            .setDescription("Collection of trivia monkeys")
            .setAttributes([{ trait_type: "Monkey", value: "Mobweb3" }])
            .setProperties({ files: [{ uri: fileUri, type: "image/png" }] })

        // // console.log("metadata: ", metadata.toJSON());
        const resultUri = await umi.uploader.uploadJson(metadata.toJSON());
        // console.log("resultUri: ", resultUri);

        // Create the Collection NFT.
        // const collectionUpdateAuthority = generateSigner(umi);
        const collectionMint = generateSigner(umi);
        const collectionNft = await createNft(umi, {
            mint: collectionMint,
            authority: umi.identity,
            name: "Monkey Collection",
            symbol: "MONKEY",
            uri: resultUri,
            sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
            isCollection: true,
        }).sendAndConfirm(umi);

        const transactionHash = bs58.encode(collectionNft.signature);

        console.log("collectionNft transactionHash:", transactionHash);
        console.log("collectionMintNft created: ", collectionMint.publicKey.toString());

    }
}