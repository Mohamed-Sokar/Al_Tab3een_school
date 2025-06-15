<template>
  <Transition :duration="150" mode="out-in" name="fade">
    <slot></slot>
  </Transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  /*scale: 120%;*/
}
</style>
