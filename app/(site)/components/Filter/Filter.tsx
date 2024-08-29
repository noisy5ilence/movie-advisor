'use client';

import { Dispatch, SetStateAction, useRef, useState } from 'react';

import useFilters from '@/app/(site)/useFilters';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Toggle } from '@/components/ui/toggle';
import useUrlToMagnet from '@/hooks/useUrlToMagnet';

import useGenres from './useGenres';

export default function Filter() {
  useUrlToMagnet();

  const { filters, setFilters } = useFilters();
  const { data: genres, isFetched } = useGenres();

  const [years, setYears] = useState(filters.year || ['1990', new Date().getFullYear().toString()]);
  const [scores, setScores] = useState(filters.score || ['0', '10']);

  const timeout = useRef<NodeJS.Timeout>();

  const handleChangeGenre = (id: number) => () => {
    const genreId = id.toString();

    setFilters({
      name: 'genres',
      value: filters.genres?.includes(genreId)
        ? filters.genres.filter((id) => id !== genreId)
        : [...(filters.genres || []), genreId]
    });
  };

  const handleDebouncedChange =
    (setter: Dispatch<SetStateAction<Array<string>>>, key: keyof Filters) => (value: Array<number>) => {
      clearTimeout(timeout.current);

      timeout.current = setTimeout(() => setFilters({ name: key, value: value.map((value) => value.toString()) }), 300);

      setter(value.map((value) => value.toString()));
    };

  if (!isFetched) return;

  return (
    <>
      <Card className='mb-2'>
        <ul className='flex gap-2 overflow-auto no-scrollbar'>
          {genres?.map((genre) => (
            <li key={genre.id}>
              <Toggle
                data-state={filters.genres?.includes(genre.id.toString()) ? 'on' : 'off'}
                onClick={handleChangeGenre(genre.id)}
                className='whitespace-nowrap'
              >
                {genre.name}
              </Toggle>
            </li>
          ))}
        </ul>
      </Card>
      <div className='flex w-full my-4 gap-6 flex-wrap'>
        <div className='grow flex items-center basis-[250px]'>
          <Slider
            onValueChange={handleDebouncedChange(setYears, 'year')}
            value={years.map((value) => parseInt(value))}
            min={1960}
            max={new Date().getFullYear()}
            step={1}
          />
        </div>
        <div className='grow flex items-center basis-[250px]'>
          <Slider
            onValueChange={handleDebouncedChange(setScores, 'score')}
            value={scores.map((value) => parseInt(value))}
            min={0}
            max={10}
            step={1}
          />
        </div>
      </div>
    </>
  );
}
