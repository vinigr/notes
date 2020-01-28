import { commitMutation, graphql } from 'react-relay';
import { Environment } from '@todo/relay-web';

import {
  CategoryAddInput,
  CategoryAddMutation,
  CategoryAddMutationResponse,
} from './__generated__/CategoryAddMutation.graphql';

const mutation = graphql`
  mutation CategoryAddMutation($input: CategoryAddInput!) {
    CategoryAdd(input: $input) {
      category {
        node {
          _id
          name
        }
      }
      error
    }
  }
`;

function commit(
  input: CategoryAddInput,
  onCompleted: (response: CategoryAddMutationResponse) => void,
  onError: (error: Error) => void,
) {
  return commitMutation<CategoryAddMutation>(Environment, {
    mutation,
    variables: { input },
    onCompleted,
    onError,
  });
}

export default { commit };
