import { FC } from 'react';

interface Props {
  data: Record<string, unknown>;
}

const JsonLd: FC<Props> = ({ data }) => (
  <script
    type='application/ld+json'
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
  />
);

export default JsonLd;
