import React from 'react';
import ReactMarkdown from 'react-markdown';

import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  p,
  h1,
  h2,
  h3,
  h4,
  ul,
  ol {
    color: #000;
    font-size: 1.25rem;
    font-weight: 300;
    line-height: 1.7;
    letter-spacing: 0.069rem;
    padding: 0 0.5rem;
  }

  p {
    margin: 0 0 1.6rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5 {
    margin: 0.5rem 0 1rem;
  }

  ul,
  ol {
    list-style: disc;
    padding-left: 2rem;
    margin: 0 0 1.6rem;
  }

  li {
    padding: 0.625rem 0;

    & > ul {
      margin-bottom: 0;
    }
  }

  p,
  li {
    code {
      word-wrap: break-word;
    }
  }

  img {
    display: block;
    max-width: 100%;
  }

  blockquote {
    color: #000;
    border-left: 0.3rem solid #1a63ff;
    padding: 0 1.875rem;
    margin: 3.125rem 0;
  }

  h1,
  h2,
  h3,
  h4,
  h5 {
    font-weight: 800;
    letter-spacing: 0.069rem;
    line-height: 1.4;
  }

  h1 {
    font-size: 2.8rem;
  }

  h2 {
    font-size: 2.1rem;
  }

  h3 {
    font-size: 1.6rem;
  }

  h4 {
    font-size: 1.4rem;
  }

  h5 {
    font-size: 1.2rem;
  }

  strong {
    font-weight: 700;
  }

  a {
    border-bottom: 1px dashed #1a63ff;
    color: #1a48ff;
    text-decoration: none;
    transition: opacity 0.5s;

    svg {
      color: #000;
    }

    &:hover {
      opacity: 0.8;
    }
  }

  code {
    max-width: 80%;
  }
`;

interface Props {
  text: string;
}

const NoteContent = ({ text }: Props) => (
  <Wrapper>
    <ReactMarkdown source={text.replace(/\u21b5/g, '\n')} />
  </Wrapper>
);

export default NoteContent;
