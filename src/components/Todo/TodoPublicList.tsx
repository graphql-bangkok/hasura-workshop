import { useSubscription } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React, { Fragment } from "react";
import TaskItem from "./TaskItem";

type TodoItem = {
  id: number;
  title: string;
  user: { name: string };
};

type publicListProps = {
  latestTodo?: TodoItem | null;
};

// const PUBLIC_TODOS = gql`
//   query GetPublicTodo {
//     todos(where: { is_public: true }, order_by: { created_at: desc }) {
//       id
//     }
//   }
// `;

const LIVE_PUBLIC_TODOS = gql`
  subscription LivePublicTodos {
    todos(limit: 5, order_by: { created_at: desc }) {
      id
      title
      is_completed
      created_at
      user {
        name
      }
    }
  }
`;

const TodoPublicList = (props: publicListProps) => {
  const { loading, data } = useSubscription(LIVE_PUBLIC_TODOS);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Fragment>
      <div className="todoListWrapper">
        <ul>
          {data.todos &&
            data.todos.map((todo: any, index: number) => {
              return <TaskItem key={index} index={index} todo={todo} />;
            })}
        </ul>
      </div>
    </Fragment>
  );
};

export default TodoPublicList;
