<template>
  <vs-row justify="center">
    <vs-col v-for="item in items" :key="item.title" w="4">
      <vs-card style="width: 100%" @click="$router.push(`/user/${item.id}`)">
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
    </vs-col>
  </vs-row>
</template>

<script>
export default {
  //   layout: "fuck",
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
      "https://jsonplaceholder.typicode.com/posts/"
    );
    return {
      items: data,
    };
  },
};
</script>