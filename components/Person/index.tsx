'use client';

import { FC } from 'react';

import List from '@/components/List';
import NoResults from '@/components/NoResults';
import useTrackOnce from '@/lib/analytics/useTrackOnce';
import { formatDate } from '@/lib/utils';

import Biography from './components/Biography';
import PersonSkeleton from './components/Skeleton';
import useProfile from './useProfile';

interface Props {
  personId: string;
}

const lifespan = ({ birthday, deathday }: Profile) => {
  if (!birthday) return '';

  return deathday ? `${formatDate(birthday)} — ${formatDate(deathday)}` : formatDate(birthday);
};

const Person: FC<Props> = ({ personId }) => {
  const { data: profile, isError } = useProfile({ personId });

  useTrackOnce('person_viewed', profile ? personId : undefined, () => ({ personId }));

  if (isError) return <NoResults />;

  if (!profile) return <PersonSkeleton />;

  const dates = lifespan(profile);

  return (
    <div className='flex flex-1 flex-col'>
      <div className='flex flex-col gap-2 md:flex-row'>
        {Boolean(profile.photo) && (
          <div className='card-aspect-ratio static-aspect-ratio relative mx-auto overflow-hidden rounded-lg bg-black'>
            <img className='size-full object-cover' src={profile.photo} alt={profile.name} />
          </div>
        )}
        <div className='flex grow flex-col bg-background'>
          <h1 className='mb-4 text-3xl'>{profile.name}</h1>

          <div className='mb-4 flex w-full flex-wrap gap-5 whitespace-nowrap text-sm'>
            {Boolean(profile.department) && <span>{profile.department}</span>}
            {Boolean(dates) && <span>{dates}</span>}
            {Boolean(profile.birthplace) && <span className='whitespace-normal'>{profile.birthplace}</span>}
          </div>

          <Biography text={profile.biography} />
        </div>
      </div>

      {Boolean(profile.shows.length) && (
        <div className='mt-5'>
          <h2 className='mb-3 inline-block text-lg'>Filmography</h2>
          <List shows={profile.shows} />
        </div>
      )}

      {!profile.shows.length && <NoResults />}
    </div>
  );
};

export default Person;
