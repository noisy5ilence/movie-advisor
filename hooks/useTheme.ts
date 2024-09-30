'use client';

import { useContext } from 'react';

import { ThemeContext } from '@/providers/Theme';

const useTheme = () => useContext(ThemeContext);

export default useTheme;
