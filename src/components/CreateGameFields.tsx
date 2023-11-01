import React from 'react';
import { Input, SegmentedControl, Modal, Group, Badge, Button } from '@mantine/core';
import { NumberInputComponent } from '../components/NumberInput';
import { IconPacman } from '@tabler/icons-react';
import ModalContent from './ModalContent';

interface CreateGameFormProps {
  setNickname: (nickname: string) => void;
  setNumberPlayers: (numberPlayers: string) => void;
  setPointsToWin: (pointsToWin: string) => void;
  setSelectedChips: (selectedChips: string[]) => void;
  openModal: () => void;
  closeModal: () => void;
  opened: boolean;
  numberPlayers: string;
  selectedChips: string[];
}

const CreateGameForm: React.FC<CreateGameFormProps> = ({
  setNickname,
  setNumberPlayers,
  setPointsToWin,
  setSelectedChips,
  openModal,
  closeModal,
  opened,
  numberPlayers,
  selectedChips
}) => {
  return (
    <>
      <Input
        leftSection={<IconPacman />}
        placeholder="Your Name"
        radius="md"
        styles={{
          input: {
            textAlign: 'center',
          },
        }}
        onChange={(e) => setNickname(e.currentTarget.value)}
      />
      <NumberInputComponent setNumberSelected={setNumberPlayers} />
      <SegmentedControl
        data={[
          { value: '10', label: '10' },
          { value: '20', label: '20' },
          { value: '30', label: '30' },
        ]}
        onChange={(value) => setPointsToWin(value)}
      />
      <Modal opened={opened} onClose={closeModal} title="Pick topic" radius={'lg'} padding={'xl'}>
        <ModalContent setSelectedChips={setSelectedChips} numberOfPlayers={parseInt(numberPlayers)}></ModalContent>
        {/* Modal content */}
      </Modal>
      <Group justify="center">
        <Badge size="lg" radius="lg" variant="dot">
          Selected topics: {selectedChips.join(', ')}
        </Badge>
        <Button onClick={openModal}>Pick a topic</Button>
      </Group>
    </>
  );
};

export default CreateGameForm;