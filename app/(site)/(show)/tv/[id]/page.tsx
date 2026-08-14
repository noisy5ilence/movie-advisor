import { createShowMetadata, createShowPage } from '../../showPage';

export const revalidate = 604800;

export const generateStaticParams = async () => [];

export const generateMetadata = createShowMetadata('tv');

const SeriesPage = createShowPage('tv');

export default SeriesPage;
