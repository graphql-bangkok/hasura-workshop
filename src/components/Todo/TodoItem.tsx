import * as React from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

export type TodoItem = {
  id: number;
  title: string;
  is_completed: boolean;
};

interface TodoItemType {
  index: number;
  todo: TodoItem;
}

const TOGGLE_TODO = gql`
  mutation toggleTodo($id: Int!, $isCompleted: Boolean!) {
    update_todos(
      where: { id: { _eq: $id } }
      _set: { is_completed: $isCompleted }
    ) {
      affected_rows
      returning {
        id
        title
        is_completed
      }
    }
  }
`;

const TodoItem = ({ index, todo }: TodoItemType) => {
  const [todoUpdate] = useMutation(TOGGLE_TODO);

  const removeTodo = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const toggleTodo = () => {
    todoUpdate({
      variables: { id: todo.id, isCompleted: !todo.is_completed },
      optimisticResponse: {
        __typename: "mutation_root",
        update_todos: {
          __typename: "todos_mutation_response",
          affected_rows: 1,
          returning: [
            {
              __typename: "todos",
              id: todo.id,
              title: todo.title,
              is_completed: !todo.is_completed
            }
          ]
        }
      }
    });
  };

  return (
    <li key={index}>
      <div className="view">
        <div className="round">
          <input
            checked={todo.is_completed}
            type="checkbox"
            id={todo.id!.toString()}
            onChange={() => toggleTodo()}
          />
          <label htmlFor={todo.id!.toString()} />
        </div>
      </div>

      <div className={"labelContent" + (todo.is_completed ? " completed" : "")}>
        <div>{todo.title}</div>
      </div>

      <button className="closeBtn" onClick={e => removeTodo(e)}>
        x
      </button>
    </li>
  );
};

export default TodoItem;
