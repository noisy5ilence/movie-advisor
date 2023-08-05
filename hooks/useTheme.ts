'use client';

import { useContext } from 'react';

import { ThemeContext } from '@/providers/Theme';

export const useTheme = () => useContext(ThemeContext);
