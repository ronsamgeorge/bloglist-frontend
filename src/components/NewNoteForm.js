const NewNoteForm = ({title,handleTitle, author, handleAuthor, url, handleUrl, handlePost}) => {
    return(
        <div>
          <form onSubmit={handlePost}>
            <p>title</p>
            <input 
            type='text'
            value={title}
            onChange={handleTitle}
            ></input>
  
            <p>Author</p>
            <input 
              type='text'
              value={author}
              onChange={handleAuthor}
            ></input>
  
            <p>URL</p>
            <input 
              type='text'
              value={url}
              onChange={handleUrl}
            ></input>
            <button type='submit'>Submit Blog</button>
          </form>
        </div>
      )
}

export default NewNoteForm;