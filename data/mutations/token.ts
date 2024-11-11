import movieAdvisor from '../clients/movieAdvisor';

const tokenMutation = () => ({
  mutationFn: () =>
    movieAdvisor.get<RequestToken>('/authentication/token/new', { preventCache: true }).then(({ request_token }) => ({
      redirectUrl: `https://www.themoviedb.org/authenticate/${request_token}`,
      requestToken: request_token
    }))
});

export default tokenMutation;
