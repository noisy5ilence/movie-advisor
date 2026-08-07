import { FC } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Person from '@/components/Person';
import personQuery from '@/data/queries/person';
import { TITLE } from '@/env';
import getQueryClient from '@/lib/queryClient';

interface Props {
  params: { id: string };
}

export const generateMetadata = async ({ params: { id } }: Props): Promise<Metadata> => {
  const queryClient = getQueryClient();

  try {
    const { name, biography, photo } = await queryClient.fetchQuery(personQuery({ personId: id }));

    const description = biography || `Movies and series starring ${name}.`;

    return {
      title: `${name} | ${TITLE}`,
      description,
      alternates: { canonical: `/person/${id}` },
      openGraph: {
        title: name,
        description,
        siteName: TITLE,
        images: photo ? [photo] : [],
        type: 'profile',
        url: `/person/${id}`
      }
    };
  } catch (_) {
    return notFound();
  }
};

const PersonPage: FC<Props> = async ({ params: { id } }) => {
  const queryClient = getQueryClient();

  try {
    await queryClient.fetchQuery(personQuery({ personId: id }));
  } catch (_) {
    return notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Person personId={id} />
    </HydrationBoundary>
  );
};

export default PersonPage;
