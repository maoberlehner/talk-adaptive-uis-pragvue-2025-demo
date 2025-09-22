import { expect, it } from "vitest";
import { render, screen } from "@testing-library/vue";
import { defineComponent, h, Suspense, type Component, type ExtractPropTypes } from "vue";

import AdaptiveUI from "@/components/adaptive-ui.vue";
import type { Config } from "@/entites/config";

const wrapAsync = <C extends Component>(component: C, props: ExtractPropTypes<C>) =>
  defineComponent({
    render() {
      return h(
        "div",
        h(Suspense, () => h(component, props)),
      );
    },
  });

it("should render static components", async () => {
  const config: Config = {
    children: [
      {
        component: 'section(headline: "Foo")',
      },
    ],
  };
  render(wrapAsync(AdaptiveUI, { config }));

  expect(await screen.findByRole("heading", { name: "Foo" })).toBeInTheDocument();
});

it("should render components with data from data sources", async () => {
  const resolvers = {
    async foo() {
      return { foo: "Foo", bar: "Bar" };
    },
  };
  const config: Config = {
    dataSources: ["foo() -> foo"],
    children: [
      {
        component: "section(headline: `Hello ${foo.foo}`)",
      },
      {
        component: "section(headline: foo.bar)",
      },
    ],
  };
  render(wrapAsync(AdaptiveUI, { config, resolvers }));

  expect(await screen.findByRole("heading", { name: "Hello Foo" })).toBeInTheDocument();
  expect(await screen.findByRole("heading", { name: "Bar" })).toBeInTheDocument();
});

it("should map over results from data sources", async () => {
  const resolvers = {
    async foo() {
      return [{ x: "Foo" }, { x: "Bar" }];
    },
  };
  const config: Config = {
    dataSources: ["foo() -> foo"],
    children: [
      {
        component: "stack()",
        children: [
          {
            component: "map(items: foo)",
            children: [
              {
                component: 'snippet(title: item.x, snippet: "foo")',
              },
            ],
          },
        ],
      },
    ],
  };
  render(wrapAsync(AdaptiveUI, { config, resolvers }));

  expect(await screen.findByRole("heading", { name: "Foo" })).toBeInTheDocument();
  expect(await screen.findByRole("heading", { name: "Bar" })).toBeInTheDocument();
});

it("should call data sources with params", async () => {
  const resolvers = {
    async foo({ x }: { x: string }) {
      return { foo: x };
    },
  };
  const config: Config = {
    dataSources: ['foo(x: "Foo") -> foo'],
    children: [
      {
        component: "section(headline: foo.foo)",
      },
    ],
  };
  render(wrapAsync(AdaptiveUI, { config, resolvers }));

  expect(await screen.findByRole("heading", { name: "Foo" })).toBeInTheDocument();
});

it("should resolve nested data sources", async () => {
  const resolvers = {
    async foo() {
      return [{ x: "Foo" }, { x: "Bar" }];
    },
    async bar({ x }: { x: string }) {
      return `Bar ${x}`;
    },
  };
  const config: Config = {
    dataSources: ["foo() -> foo"],
    children: [
      {
        component: "stack()",
        children: [
          {
            component: "map(items: foo)",
            children: [
              {
                component: 'snippet(title: bar, snippet: "foo")',
                dataSources: ["bar(x: item.x) -> bar"],
              },
            ],
          },
        ],
      },
    ],
  };
  render(wrapAsync(AdaptiveUI, { config, resolvers }));

  expect(await screen.findByRole("heading", { name: "Bar Foo" })).toBeInTheDocument();
  expect(await screen.findByRole("heading", { name: "Bar Bar" })).toBeInTheDocument();
});
