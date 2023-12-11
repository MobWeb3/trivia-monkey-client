import { Card, Image, Text, Group } from '@mantine/core';
import { NftGameSession } from '../../game-domain/ nfts/NftGameSession';

type NftCardProps = {
    nft: NftGameSession; // Replace Nft with the actual type of your NFTs
  };

export function NftCard({nft}: NftCardProps) {

  function getIpfsHashFromUrl(url?: string) {
    if (url === undefined) return "";
    const parts = url.split('/');
    const ipfsHash = parts[2].split('.')[0];
    return ipfsHash;
  }

  function getCloudflareIpfsUrl(url?: string) {
    const ipfsHash = getIpfsHashFromUrl(url);
    return `https://cloudflare-ipfs.com/ipfs/${ipfsHash}`;
  }
  
  return ( 
     <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section /*component="a" href="https://mantine.dev/*/>
        <Image
          src={nft.image ? getCloudflareIpfsUrl(nft.image) : "https://bafybeiahlgcpkogk3rynat27ol4mdi7my3t7ykrrlel5wxnmpcy2fgmxqi.ipfs.nftstorage.link/"}
          height={160}
          alt="Nft image"
        />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{nft.name ?? "name"}</Text>
        {/* <Badge color="pink">On Sale</Badge> */}
      </Group>

      <Text size="sm" c="dimmed">
        {nft.description ?? nft.raw?.error}
      </Text>

      {/* <Button color="blue" fullWidth mt="md" radius="md">
        Book classic tour now
      </Button> */}
    </Card>
  );
}