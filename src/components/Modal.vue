<template>
  <div class="moda-backdrop">
    <div class="moda">
      <img
        src="../assets/close.svg"
        alt=""
        class="close-icon"
        @click="close()"
      />
      <div class="moda-content">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "modal",
  methods: {
    close() {
      this.$emit("close");
    }
  }
};
</script>
