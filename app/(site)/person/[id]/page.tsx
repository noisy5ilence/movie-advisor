import { FC } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import JsonLd from '@/components/JsonLd';
import Person from '@/components/Person';
import personQuery from '@/data/queries/person';
import { SITE_URL, TITLE } from '@/env';
import getQueryClient from '@/lib/queryClient';

interface Props {
  params: { id: string };
}

export const revalidate = 86400;

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

  const profile = await queryClient.fetchQuery(personQuery({ personId: id })).catch(() => null);

  if (!profile) return notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    description: profile.biography || undefined,
    image: profile.photo || undefined,
    birthDate: profile.birthday || undefined,
    deathDate: profile.deathday || undefined,
    birthPlace: profile.birthplace ? { '@type': 'Place', name: profile.birthplace } : undefined,
    url: `${SITE_URL}/person/${id}`
  };

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <JsonLd data={jsonLd} />
      <Person personId={id} />
    </HydrationBoundary>
  );
};

export default PersonPage;
