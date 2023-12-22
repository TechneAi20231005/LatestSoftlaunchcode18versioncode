import axios from 'axios'

//synchronous action creator
const fetchPostsSuccess = posts => ({
    type: 'FETCH_POSTS_SUCCESS',
    payload: { posts }
})

/*asynchronous thunk action creator
  calls the api, then dispatches the synchronous action creator
*/
export const fetchPosts =  () => {
    return async dispatch => {
        try {
            let posts = await axios.get('https://jsonplaceholder.typicode.com/posts')
            dispatch(fetchPostsSuccess(posts));
        }
        catch(e){
            console.log(e)
        }
    }
}