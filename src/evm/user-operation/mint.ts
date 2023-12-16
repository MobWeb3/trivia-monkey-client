import { Address, encodeFunctionData } from 'viem';
import { abi as nftAbi } from '../abis/GameSessionNft.json'
import { abi as sourceMinterAbi } from '../abis/SourceMinter.json'
import { AlchemyProvider } from '@alchemy/aa-alchemy';
import { PayFeesIn, routerConfig } from './constants';

const uoCallData = async () => encodeFunctionData({
    abi: nftAbi,
    functionName: "mintNftActive",
    args: ['data:application/json;base64,ewogICAgIm5hbWUiOiAiTW9ua2V5IFRyaXZpYSBTZXNzaW9uIENvbXBsZXRlZCIsCiAgICAiZGVzY3JpcHRpb24iOiAiR2FtZSBzZXNzaWlvbiBjb21wbGV0ZWQuICBZb3UgYXJlIGEgd2lubmVyISIsCiAgICAiaW1hZ2UiOiAiaHR0cHM6Ly9iYWZ5YmVpZXh4eTd2cHRwdGo2eXg2cmVodjV4cDRnYTd6enRiZTJ1ZHUyZDNnYTNiZTRnc243bmt4NC5pcGZzLm5mdHN0b3JhZ2UubGluay8iLAogICAgImF0dHJpYnV0ZXMiOiBbCiAgICAgICAgewogICAgICAgICAgICAidHJhaXRfdHlwZSI6ICJwbGFjZSIsCiAgICAgICAgICAgICJ2YWx1ZSI6ICIxc3QiCiAgICAgICAgfQogICAgXQp9'],
});

// const uoMintCompleteCallData = async (tokenUri: string) => encodeFunctionData({
//     abi: nftAbi,
//     functionName: "mintNftComplete",
//     args: [tokenUri],
// });

const paramsPolygonToAvax = {
    destinationChainSelector: routerConfig.avalancheFuji.chainSelector,
    destinationMinter: "0xdD65D629eB0Adfbf331306dFB5C2302b54E2BFFb" as Address, // Fuji minter
    fees: PayFeesIn.LINK,
    tokenUri: "https://bafkreih3uethjok3wtnyyg6knpc3oyko4lc5cehs4nx6qvmmsgnu6qebgm.ipfs.nftstorage.link/",
};

const uoCrossChainPolygonToAvaxCallData = async () => encodeFunctionData({
    abi: sourceMinterAbi,
    functionName: "mint",
    args: [...Object.values(paramsPolygonToAvax)],
});


export const mintNftActive = async (connectedProvider: AlchemyProvider) => {

    connectedProvider.withAlchemyGasManager({
        policyId: "1b7bc96a-85a3-4949-bce4-42b4d23e3a0a", // replace with your policy id, get yours at https://dashboard.alchemy.com/
    });

    const data = await uoCallData();
    const uo = await connectedProvider.sendUserOperation({
        target: "0xA82fefb68a74A990F4deC6FCAfad5E1d89059A4C",
        data,
    });

    const txHash = await connectedProvider.waitForUserOperationTransaction(uo.hash);

    console.log(txHash);
}

export const crossChainMintNftComplete = async (
    connectedProvider: AlchemyProvider,
    tokenUri?: string,
) => {

    connectedProvider.withAlchemyGasManager({
        policyId: "16ff27b8-884f-41f8-b1bb-1857b5d26c41", // replace with your policy id, get yours at https://dashboard.alchemy.com/
    });

    // sourceMinter: `0x202dBaD8f54394713158B2e0C2454cCb7CE3C26e` as Address, // Polygon source minter
    const uo = await connectedProvider.sendUserOperation({
        target: `0x202dBaD8f54394713158B2e0C2454cCb7CE3C26e` as Address, // source minter
        data: await uoCrossChainPolygonToAvaxCallData(),
    });

    //Transaction hash:  0xd2c12875c02ac851353ad70ab97601788e6c991cd722458037b4b647fee9e02d

    const txHash = await connectedProvider.waitForUserOperationTransaction(uo.hash);

    // get receipt data from txHash
    const receipt = await connectedProvider.getUserOperationReceipt(txHash);

    console.log("Transaction hash: ", txHash);

    console.log("UserOperationReceipt: ", receipt);
}