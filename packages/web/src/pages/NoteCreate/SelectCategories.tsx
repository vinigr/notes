import React, { useState, useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import { graphql, createRefetchContainer } from 'react-relay';
import CreatableSelect from 'react-select/creatable';
import { createQueryRenderer } from '@todo/relay-web';

import { SelectCategories_query } from './__generated__/SelectCategories_query.graphql';

import CategoryAddMutation from './CategoryAddMutation';
import { CategoryAddMutationResponse } from './__generated__/CategoryAddMutation.graphql';

interface Props {
  query: SelectCategories_query;
  relay: any;
  onChange: (newValue: any) => void;
  categoriesSelected: Array<ICategory> | null;
}

interface ICategory {
  value: string;
  label: string;
}

const SelectCategories = ({ query, relay, onChange, categoriesSelected }: Props) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState();
  const [error, setError] = useState();

  const { categoriesByCreator } = query;

  useEffect(() => {
    const temp: ICategory[] = [];
    categoriesByCreator?.edges.map(category => {
      temp.push({ value: category.node._id, label: category?.node.name });
    });

    setCategories(temp);
  }, [categoriesByCreator.edges]);

  const handleInputChange = (input: any) => {
    if (input.length < 3) {
      return;
    }

    const refetchVariables = () => ({
      first: 10,
      search: input,
    });
    relay.refetch(refetchVariables);
  };

  const createCategory = (name: string) => {
    setLoading(true);

    const input = {
      name,
    };

    const onCompleted = (response: CategoryAddMutationResponse) => {
      if (!response.CategoryAdd) return;

      const { error, category } = response.CategoryAdd;

      error && setError(error);

      if (category) {
        setCategories([{ value: category?.node._id, label: category?.node.name }, ...categories]);
        onChange([...categoriesSelected, { value: category?.node._id, label: category?.node.name }]);
      }
      setLoading(false);
    };

    const onError = () => {
      setLoading(false);
      setError('Something goes wrong with registration of the category');

      setLoading(false);
    };

    CategoryAddMutation.commit(input, onCompleted, onError);
  };

  return (
    <CreatableSelect
      isClearable
      onChange={onChange}
      onCreateOption={e => createCategory(e)}
      options={categories}
      isLoading={loading}
      isMulti
      placeholder="select categories..."
      value={categoriesSelected}
      onInputChange={handleInputChange}
    />
  );
};

const CategoryRefetchContainer = createRefetchContainer(
  SelectCategories,
  {
    query: graphql`
      fragment SelectCategories_query on Query @argumentDefinitions(first: { type: Int }, search: { type: String }) {
        categoriesByCreator(first: $first, search: $search) @connection(key: "App_categoriesByCreator", filters: []) {
          edges {
            node {
              _id
              name
            }
          }
        }
      }
    `,
  },

  graphql`
    query SelectCategoriesPaginationQuery($first: Int, $search: String) {
      ...SelectCategories_query @arguments(first: $first, search: $search)
    }
  `,
);

export default hot(
  createQueryRenderer(CategoryRefetchContainer, SelectCategories, {
    query: graphql`
      query SelectCategoriesQuery($first: Int, $search: String) {
        ...SelectCategories_query @arguments(first: $first, search: $search)
      }
    `,
    variables: { first: 10, search: null },
  }),
);
