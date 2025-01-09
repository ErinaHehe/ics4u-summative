function Genres(props) {
    console.log(props.genresList);
  
    return (
      <div>
        <ul>
          {
            props.genresList.map((item) => {
              return (
                <li key={item.id}>{item.genre}</li>
              )
            })
          }
        </ul>
      </div>
    )
  }
  
  export default Genres;