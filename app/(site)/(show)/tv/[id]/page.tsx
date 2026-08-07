import { createShowMetadata, createShowPage } from '../../showPage';

export const revalidate = 86400;

export const generateMetadata = createShowMetadata('tv');

const SeriesPage = createShowPage('tv');

export default SeriesPage;
