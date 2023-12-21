import { Popover, Button, Select } from '@mantine/core';
import useLocalStorageState from 'use-local-storage-state';
import { SessionData } from '../../screens/SessionData';

export function SelectNetwork() {
    const [sessionData, setSessionData] = useLocalStorageState<SessionData>('sessionData');
    
    return (
        <Popover width={300} position="bottom" withArrow shadow="md">
            <Popover.Target>
                <Button>Networks</Button>
            </Popover.Target>
            <Popover.Dropdown>
                <Select
                    label="Networks"
                    placeholder="Pick network"
                    data={['Fuji', 'Mumbai', 'Sepolia']}
                    comboboxProps={{ withinPortal: false }}
                    value={sessionData?.nftWalletNetwork ?? ''}
                    onChange={(value) => {
                        console.log("onchange: ", value);

                        // set network on local
                        setSessionData({
                            ...sessionData,
                            nftWalletNetwork: value ?? 'Sepolia',
                        });
                    }}
                />
            </Popover.Dropdown>
        </Popover>
    );
}