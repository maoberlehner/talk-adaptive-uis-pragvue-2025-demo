<script setup lang="ts">
import { FormControl, FormField, FormMessage, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const props = defineProps<{
  name: string;
  label: string;
  value?: string;
}>();
</script>

<template>
  <FormField v-slot="{ componentField }" :name="props.name">
    <FormItem>
      <FormLabel>{{ props.label }}</FormLabel>
      <FormControl>
        <Input v-bind="componentField" />
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
