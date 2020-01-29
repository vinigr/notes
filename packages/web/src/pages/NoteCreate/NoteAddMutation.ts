import { commitMutation, graphql } from 'react-relay';
import { Environment } from '@todo/relay-web';

import { NoteAddInput, NoteAddMutation, NoteAddMutationResponse } from './__generated__/NoteAddMutation.graphql';

const mutation = graphql`
  mutation NoteAddMutation($input: NoteAddInput!) {
    NoteAdd(input: $input) {
      note {
        node {
          id
        }
      }
      error
    }
  }
`;

function commit(
  input: NoteAddInput,
  onCompleted: (response: NoteAddMutationResponse) => void,
  onError: (error: Error) => void,
) {
  return commitMutation<NoteAddMutation>(Environment, {
    mutation,
    variables: { input },
    onCompleted,
    onError,
  });
}

export default { commit };
