import { Flex } from '@mantine/core';
import OptionButton from './OptionButton';

type ModalContentProps = {
    numberOfPlayers: number;
    style?: React.CSSProperties;
    closeModal?: () => void;
    children?: React.ReactNode;
};

export const ActionOptionsComponent = ({}: ModalContentProps) => {

    return (
        // Flex component from Mantine
        <Flex
            gap="md"
            justify="center"
            align="center"
            direction="column"
            w="100%"
            h="auto" // Fixed height
        >
            <OptionButton
                fontSize={"20px"}
                onClick={() => {console.log("clicked")}}
                background='linear-gradient(to bottom right, #FDD673, #D5B45B)'
                color='#2B2C21'
                style={{
                    marginTop: '0px',
                    marginBottom: '0px',
                }}> Exit and Save
            </OptionButton>

            <OptionButton
                fontSize={"20px"}
                onClick={() => {console.log("clicked")}}
                background='linear-gradient(to bottom right, #FDD673, #D5B45B)'
                color='#2B2C21'
                style={{
                    marginTop: '0px',
                    marginBottom: '0px',
                }}> Exit Without Saving
            </OptionButton>
        </Flex>

    );
};

export default ActionOptionsComponent;
