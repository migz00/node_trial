<template>
  <div class="about">
    <Folder/>
  </div>
</template>

<script>
// @ is an alias to /src
import Folder from '@/components/Folder.vue';

export default {
  name: 'About',
  components: {
    Folder,
  },
};
</script>