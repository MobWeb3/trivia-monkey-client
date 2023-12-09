import { encodeFunctionData } from 'viem';
import { abi as GameSessionNftAbi } from '../abis/GameSessionNft.json'
import { AlchemyProvider } from '@alchemy/aa-alchemy';

const uoCallData = async () => encodeFunctionData({
    abi: GameSessionNftAbi,
    functionName: "mintNftActive",
    args: ['data:application/json;base64,ewogICAgIm5hbWUiOiAiTW9ua2V5IFRyaXZpYSBTZXNzaW9uIENvbXBsZXRlZCIsCiAgICAiZGVzY3JpcHRpb24iOiAiR2FtZSBzZXNzaWlvbiBjb21wbGV0ZWQuICBZb3UgYXJlIGEgd2lubmVyISIsCiAgICAiaW1hZ2UiOiAiaHR0cHM6Ly9iYWZ5YmVpZXh4eTd2cHRwdGo2eXg2cmVodjV4cDRnYTd6enRiZTJ1ZHUyZDNnYTNiZTRnc243bmt4NC5pcGZzLm5mdHN0b3JhZ2UubGluay8iLAogICAgImF0dHJpYnV0ZXMiOiBbCiAgICAgICAgewogICAgICAgICAgICAidHJhaXRfdHlwZSI6ICJwbGFjZSIsCiAgICAgICAgICAgICJ2YWx1ZSI6ICIxc3QiCiAgICAgICAgfQogICAgXQp9'],
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