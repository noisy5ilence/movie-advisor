import { createShowMetadata, createShowPage } from '../../showPage';

export const revalidate = 86400;

export const generateMetadata = createShowMetadata('movie');

const MoviePage = createShowPage('movie');

export default MoviePage;
