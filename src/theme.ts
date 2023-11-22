import cx from 'clsx';
import { Container, createTheme } from '@mantine/core';
import classes from './theme.module.css';

export const theme = createTheme({
    components: {
      Container: Container.extend({
        classNames: (_, { size }) => ({
          root: cx({ [classes.responsiveContainer]: size === 'responsive' }),
        }),
      }),
    },
  });