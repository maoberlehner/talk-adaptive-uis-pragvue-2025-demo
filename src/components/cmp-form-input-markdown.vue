<script setup lang="ts">
import { FormControl, FormField, FormMessage, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

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
        <Textarea class="min-h-40" v-bind="componentField" />
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
