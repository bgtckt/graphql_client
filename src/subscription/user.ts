import { gql } from "@apollo/client";

export const USER_CREATED = gql`
  subscription {
    userCreated {
      id
      name
    }
  }
`;