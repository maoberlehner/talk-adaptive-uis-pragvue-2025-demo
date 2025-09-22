<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";

const props = defineProps<{
  action?: ((data: Record<string, unknown>) => unknown) | string;
}>();

const onSubmit = async (data: Record<string, unknown>) => {
  if (typeof props.action === "function") {
    await props.action(data);
  }
};
</script>

<template>
  <Card>
    <CardContent>
      <Form @submit="onSubmit">
        <slot />
        <div class="mt-4">
          <Button type="submit">Submit</Button>
        </div>
      </Form>
    </CardContent>
  </Card>
</template>
