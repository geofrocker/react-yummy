import React from 'react';

const Recipe = (props) => {
    return (
        <tr>
          <td>{props.id}</td>
          <td>{props.title}</td>
          <td>{props.category_rel}</td>
          <td>{props.author}</td>
          <td>{props.status}</td>
          <td>{props.create_date}</td>
          <td><a href={'/edit_recipe/' + props.recipe_id} className="btn btn-default pull-right"> Edit</a></td>
          <td><button onClick={() => props.deleteHandler(props.recipe_id)} className="btn btn-danger"> Delete</button></td>
    </tr>
    )
}
export default Recipe;
