import movieAdvisor from '../clients/movieAdvisor';

const sessionMutation = () => ({
  mutationFn: ({ requestToken }: { requestToken: string }) =>
    movieAdvisor.post<Session>(
      '/authentication/session/new',
      {
        preventCache: true
      },
      { request_token: requestToken }
    )
});

export default sessionMutation;
