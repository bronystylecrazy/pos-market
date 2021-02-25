<template>
  <div>
    <vs-card>
      <template #title>
        <h3>{{ item.title }}t</h3>
      </template>
      <template #img>
        <img
          :src="`https://avatars.dicebear.com/4.5/api/jdenticon/${item.title}.svg`"
          alt=""
        />
      </template>
      <template #text>
        <p>{{ item.body }}</p>
      </template>
      <template #interactions>
        <vs-button danger icon>
          <i class="bx bx-heart"></i>
        </vs-button>
        <vs-button class="btn-chat" shadow primary>
          <i class="bx bx-chat"></i>
          <span class="span"> {{ item.id }} </span>
        </vs-button>
      </template>
    </vs-card>
    <vs-button color="red" @click="$router.back()">Back to main</vs-button>
  </div>
</template>

<script>
export default {
  async asyncData({
    isDev,
    route,
    store,
    env,
    params,
    query,
    req,
    res,
    redirect,
    error,
    $axios,
  }) {
    const { data } = await $axios.get(
      "https://jsonplaceholder.typicode.com/posts/" + params.id
    );
    return {
      item: data,
    };
  },
};
</script>