<template>
    <q-page padding>
        <q-form
            @submit="onSubmit"
            class="row q-col-gutter-sm"
        >
            <q-input
            outlined
            v-model="form.name"
            label="Nome"
            lazy-rules
            class="col-lg-6 col-xs-12"
            :rules="[ val => val && val.length > 0 || 'Campo obrigatório']"
            />

            <q-input
            outlined
            v-model="form.url"
            label="URL"
            lazy-rules
            class="col-lg-6 col-xs-12"
            :rules="[ val => val && val.length > 0 || 'Campo obrigatório']"
            />

            <div class="col-12 q-gutter-sm">
                <q-btn
                    label="Salvar"
                    color="primary"
                    class="float-right"
                    icon="save"
                    type="submit"
                />
                <q-btn
                    label="Cancelar"
                    color="white"
                    class="float-right"
                    text-color="primary"
                    icon="cancel"
                    :to="{ name: 'home' }"
                />
            </div>
        </q-form>
    </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import postsService from 'src/services/posts'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'

// onMounted(() => {
//   console.log("oieoioie")
//   fetch("https://pokeapi.co/api/v2/pokemon?limit=10&offset=0")
//   .then(res => res.json())
//   .then(res => console.log(res))
// })

export default defineComponent({
  name: 'FormPokemon',
  setup () {
    const { post, getById, update } = postsService()
    const $q = useQuasar()
    const router = useRouter()
    const route = useRoute()
    const form = ref({
      name: '',
      url: ''
    })

    onMounted(async () => {
      if (route.params.id) {
        getPost(route.params.id)
      }

      // fetch("https://pokeapi.co/api/v2/pokemon?limit=10&offset=0")
      // .then(res => res.json())
      // .then(res => console.log(res))
    })

    const getPost = async (id) => {
      try {
        const response = await getById(id)
        form.value = response
      } catch (error) {
        console.log(error)
      }
    }

    const onSubmit = async () => {
      console.log(form)
      try {
        if (form.value.id) {
          await update(form.value)
        } else {
          await post(form.value)
        }
        $q.notify({ message: 'Salvo com sucesso', icon: 'check', color: 'positive' })
        router.push({ name: 'home' })
      } catch (error) {
        console.log(error)
      }
    }

    return {
      form,
      onSubmit
    }
  }
})
</script>

<style>

</style>
