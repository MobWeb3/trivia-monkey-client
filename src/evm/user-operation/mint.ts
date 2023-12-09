import { encodeFunctionData } from 'viem';
import { abi as GameSessionNftAbi } from '../abis/GameSessionNft.json'
import { AlchemyProvider } from '@alchemy/aa-alchemy';

const uoCallData = async (connectedProvider: AlchemyProvider) => encodeFunctionData({
    abi: GameSessionNftAbi,
    functionName: "mintNftActive",
    args: [await connectedProvider.getAddress()],
});


export const mintNftActive = async (connectedProvider: AlchemyProvider) => {

    connectedProvider.withAlchemyGasManager({
        policyId: "1b7bc96a-85a3-4949-bce4-42b4d23e3a0a", // replace with your policy id, get yours at https://dashboard.alchemy.com/
    });

    const data = await uoCallData(connectedProvider);
    const uo = await connectedProvider.sendUserOperation({
        target: "0xA82fefb68a74A990F4deC6FCAfad5E1d89059A4C",
        data,
      });
      
      const txHash = await connectedProvider.waitForUserOperationTransaction(uo.hash);
      
      console.log(txHash);
}