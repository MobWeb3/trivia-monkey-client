import { Flex } from '@mantine/core';
import OptionButton from './OptionButton';
import { colors } from '../colors';
import useLocalStorageState from 'use-local-storage-state';
import { AuthSessionData } from '../../game-domain/AuthSessionData';
import { useEffect, useState } from 'react';
import { getUSDCBalance } from '../../solana/helpers';
import ModalHeader from '../common/ModalHeader';
import { MoonPayBuyWidget } from '@moonpay/moonpay-react';

export interface InsufficientBalanceComponentProps {
    onCloseComponent?: () => void;
}

export const InsufficientBalanceComponent:
     React.FC<InsufficientBalanceComponentProps> = ({onCloseComponent}) => {
    const [authSessionData] = useLocalStorageState<AuthSessionData>('authSessionData', {});
    const [balance, setBalance] = useState<number>(0.00);
    const [optionOnePressed, setOptionOnePressed] = useState<boolean>(false);

    // call get balance function
    useEffect(() => {
        // get network from useLocalStorageState
        if (authSessionData?.currentUserPublicKey !== undefined) {
            getUSDCBalance(authSessionData?.currentUserPublicKey).then((balance) => {
                if (balance) {
                    setBalance(balance);
                }
            })

        }
    }, [balance, authSessionData?.currentUserPublicKey]);

    return (
        <>
            <ModalHeader onPressedBack={onCloseComponent}/>
            <Flex
                gap="md"
                justify="center"
                align="center"
                direction="column"
                p="5%"
                w="100%"
                h="100%" // Fixed height
            >
                <h3 style={{ color: colors.black }}>Insufficient balance: Your current balance is: {`$${balance.toFixed(2)} USD `}
                    <br />
                    Select any of the following options to buy more credits</h3>
                <OptionButton
                    fontSize={"20px"}
                    onClick={async () => {
                        console.log("$1.99 picked!")
                        setOptionOnePressed(true);
                    }}
                    background={colors.yellow_gradient}
                    color={colors.black}
                    style={{
                        marginTop: '0px',
                        marginBottom: '0px',
                    }}> $1.99 for 1 session
                </OptionButton>

                <OptionButton
                    fontSize={"20px"}
                    onClick={async () => {
                        console.log("$9.99 picked!")
                    }}
                    background={colors.yellow_gradient}
                    color={colors.black}
                    style={{
                        marginTop: '0px',
                        marginBottom: '0px',
                    }}> $9.99 for 6 sessions
                </OptionButton>
            </Flex>
            <MoonPayBuyWidget
                variant="overlay"
                baseCurrencyCode="usd"
                baseCurrencyAmount="30"
                defaultCurrencyCode="USDC_FLOW"
                onLogin={() => {
                    console.log("Customer logged in! ");
                    return Promise.resolve();
                    }}
                onCloseOverlay={() => {
                        console.log("Overlay closed!");
                        if (optionOnePressed) {
                            setOptionOnePressed(false);
                        }
                    }
                }
                
                visible={optionOnePressed}
            />
        </>
    );
};

export default InsufficientBalanceComponent;
