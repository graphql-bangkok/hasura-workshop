import React, { Fragment, useState } from "react";
import TodoItem from "./TodoItem";
import TodoFilters from "./TodoFilters";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

type Todo = {
  id: number;
  title: string;
  is_completed: boolean;
};

const GET_MY_TODOS = gql`
  query getMyTodos {
    todos(
      where: { is_public: { _eq: false } }
      order_by: { created_at: desc }
    ) {
      id
      title
      is_completed
    }
  }
`;

const TodoPrivateList = () => {
  const { data, loading } = useQuery(GET_MY_TODOS);
  const [filter, setFilter] = useState<string>("all");

  if (loading) {
    return <div> Loading...</div>;
  }

  const filterResults = (filter: string): void => {
    setFilter(filter);
  };

  const clearCompleted = () => {};

  let filteredTodos = data.todos;
  if (filter === "active") {
    filteredTodos = data.todos.filter(
      (todo: Todo) => todo.is_completed !== true
    );
  } else if (filter === "completed") {
    filteredTodos = data.todos.filter(
      (todo: Todo) => todo.is_completed === true
    );
  }

  const todoList = filteredTodos.map((todo: Todo, index: number) => (
    <TodoItem key={"item" + index} index={index} todo={todo} />
  ));

  return (
    <Fragment>
      <div className="todoListWrapper">
        <ul>{todoList}</ul>
      </div>

      <TodoFilters
        todos={filteredTodos}
        currentFilter={filter}
        filterResultsFn={filterResults}
        clearCompletedFn={clearCompleted}
      />
    </Fragment>
  );
};

export default TodoPrivateList;
