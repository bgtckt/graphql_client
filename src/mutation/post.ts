import { gql } from "@apollo/client";

export const CREATE_POST = gql`
  mutation createUser($createPostInput: CreatePostInput!) {
    createPost(createPostInput: $createPostInput) {
      id
      text
    }
  }
`;

export const DELETE_POST = gql`
  mutation deletePost($id: Int!) {
    deletePost(id: $id)
  }
`;