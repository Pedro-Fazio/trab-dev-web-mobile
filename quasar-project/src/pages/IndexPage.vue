<template>
  <q-page padding>
    <q-table
      title="Treats"
      :rows="pokemons"
      :columns="columns"
      row-key="name"
    >

      <template v-slot:top>
        <span class="text-h5"> Pokemons </span>
        <q-space/>
        <div class="col-12 q-gutter-sm">
        <q-btn color="primary" label="Novo" :to="{ name: 'formPokemon' }" />
        <!-- <q-btn color="primary" label="Gerar novos pokemons" @click="generatePokemons(props)/> -->
        <q-btn color="primary" label="Gerar novos pokemons" v-on:click="generatePokemons" />
        </div>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-sm">
          <q-btn icon="edit" color="info" dense size="sm" @click="handleEditPost(props.row.id)" />
          <q-btn icon="delete" color="negative" dense size="sm" @click="handleDeletePost(props.row.id)" />
        </q-td>
      </template>
    </q-table>
  </q-page>

</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
// import { api } from 'boot/axios'
import postsService from 'src/services/posts'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'IndexPage',
  setup () {
    const pokemons = ref([])
    const { post, list, remove } = postsService()
    const router = useRouter()
    // let pokemonsFromApi

    onMounted(async () => {
      getPokemons()
    })

    const columns = [
      { name: 'id', field: 'id', label: 'Id', sortable: true, align: 'left' },
      { name: 'name', field: 'name', label: 'Nome', sortable: true, align: 'left' },
      { name: 'url', field: 'url', label: 'URL', sortable: true, align: 'left' },
      { name: 'actions', field: 'actions', label: 'Ações', align: 'right' }
    ]

    const $q = useQuasar()

    const generatePokemons = async () => {
      try {
        const pokemonData = await list()
        let idPokemon

        for (let i = pokemonData.length - 1; i >= 0; i--) {
          if (pokemonData[i].lastPokemon) {
            idPokemon = pokemonData[i].lastPokemon
            break
          } else {
            idPokemon = 1
          }
        }

        // const results = await fetch('https://pokeapi.co/api/v2/pokemon?limit=3&offset=0')
        const results = await fetch(`https://pokeapi.co/api/v2/pokemon/${idPokemon}`)
          .then(res => res.json())
          .then(res => res.species)

        // console.log(results)

        await post({ name: results.name, url: results.url, lastPokemon: idPokemon + 1 })

        // results.map(async (item) => {
        //   await post({ name: item.name, url: item.url })
        // })

        $q.notify({ message: 'Gerado com sucesso', icon: 'check', color: 'positive' })
        router.push({ name: 'home' })
        await getPokemons()

        // window.location.reload()
      } catch (error) {
        console.log(error)
      }
    }

    const getPokemons = async () => {
      try {
        // const { data } = await api.get('/pokemons')
        // const { data } = await list()
        const data = await list()
        pokemons.value = data
        console.log(pokemons.value)
      } catch (error) {
        console.log(error)
      }
    }

    const handleDeletePost = async (id) => {
      try {
        $q.dialog({
          title: 'Deletar',
          message: 'Deseja deletar este item?',
          cancel: true,
          persistent: true
        }).onOk(async () => {
          await remove(id)
          // alert('Apagado com sucesso')
          $q.notify({ message: 'Apagado com sucesso', icon: 'check', color: 'positive' })
          await getPokemons()
        })
      } catch (error) {
        // alert(error)
        $q.notify({ message: error, icon: 'times', color: 'negative' })
      }
    }

    const handleEditPost = async (id) => {
      router.push({ name: 'formPokemon', params: { id } })
    }

    return {
      pokemons,
      columns,
      handleDeletePost,
      handleEditPost,
      generatePokemons
    }
  }
})
</script>
