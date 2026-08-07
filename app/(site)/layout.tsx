import { ReactNode } from 'react';

const SiteLayout = ({ children, modal }: { children: ReactNode; modal: ReactNode }) => (
  <>
    {children}
    {modal}
  </>
);

export default SiteLayout;
