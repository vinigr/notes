import styled from 'styled-components';

export const FormAuthWrapper = styled.form`
  display: flex;
  flex-direction: column;
  width: 400px;
  border: #eee solid 0.5px;
  border-radius: 4px;
  padding: 30px 20px;

  h1 {
    font-size: 24px;
    font-weight: bold;
    margin-top: 0;
    margin-bottom: 2px;
  }

  h2 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 6px;
  }

  h3 {
    margin: 0;
    font-size: 14px;
    align-self: center;
    color: #d30c0d;
  }

  a {
    color: #979797;
    align-self: flex-end;
    text-decoration: none;
  }

  div#checkbox {
    display: flex;
    align-items: center;
    margin: 10px 0;

    label {
      font-size: 12px;
    }
  }
`;
