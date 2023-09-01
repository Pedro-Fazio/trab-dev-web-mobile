import useApi from 'src/composables/UseApi'

export default function postsService () {
//   const { list, post, update, remove } = useApi('posts')
  const { list, getById, post, update, remove } = useApi('pokemons')

  return {
    list,
    getById,
    post,
    update,
    remove
  }
}
