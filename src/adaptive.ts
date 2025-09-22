import type { Component } from "vue";
import { search } from "@/repositories/photo";
import { research } from "@/repositories/research";
import { orderIntake, sales } from "@/repositories/crm";
import { prompt } from "@/repositories/prompt";
import CmpArticle from "@/components/cmp-article.vue";
import CmpCard from "@/components/cmp-card.vue";
import CmpChartBar from "@/components/cmp-chart-bar.vue";
import CmpChartLine from "@/components/cmp-chart-line.vue";
import CmpForm from "@/components/cmp-form.vue";
import CmpFormInputMarkdown from "@/components/cmp-form-input-markdown.vue";
import CmpFormInputText from "@/components/cmp-form-input-text.vue";
import CmpGallery from "@/components/cmp-gallery.vue";
import CmpGrid from "@/components/cmp-grid.vue";
import CmpGridCol from "@/components/cmp-grid-col.vue";
import CmpMap from "@/components/cmp-map.vue";
import CmpSubscribe from "@/components/cmp-subscribe.vue";
import CmpMetricCard from "@/components/cmp-metric-card.vue";
import CmpSection from "@/components/cmp-section.vue";
import CmpStack from "@/components/cmp-stack.vue";
import CmpStackSnippet from "@/components/cmp-stack-snippet.vue";
import CmpStackDataEntry from "@/components/cmp-stack-data-entry.vue";
import CmpTable from "@/components/cmp-table.vue";

export const resolvers: Record<string, (params?: Record<string, unknown>) => Promise<unknown>> = {
  imageSearch(params) {
    const { query, limit = 80 } = (params ?? {}) as { query: string; limit?: number };
    return search(query, { limit });
  },
  async research(params) {
    const { query, limit = 5 } = (params ?? {}) as { query: string; limit?: number };
    return research(query, { limit });
  },
  async orderIntake(params) {
    const result = await orderIntake(params as Parameters<typeof orderIntake>[0]);
    return result.map((o) => ({ startDate: o.startDate.toLocaleDateString(), value: o.amount }));
  },
  async sales(params) {
    const result = await sales(params as Parameters<typeof sales>[0]);
    return result.map((s) => ({ startDate: s.startDate.toLocaleDateString(), value: s.amount }));
  },
  prompt(params) {
    const { prompt: message, systemMessage } = (params ?? {}) as {
      prompt: string;
      systemMessage?: string;
    };
    return prompt(message, systemMessage);
  },
};

export const componentMap: Record<string, Component> = {
  article: CmpArticle,
  card: CmpCard,
  chartBar: CmpChartBar,
  chartLine: CmpChartLine,
  form: CmpForm,
  formInputMarkdown: CmpFormInputMarkdown,
  formInputText: CmpFormInputText,
  gallery: CmpGallery,
  grid: CmpGrid,
  gridCol: CmpGridCol,
  map: CmpMap,
  subscribe: CmpSubscribe,
  metricCard: CmpMetricCard,
  section: CmpSection,
  stack: CmpStack,
  stackSnippet: CmpStackSnippet,
  stackDataEntry: CmpStackDataEntry,
  table: CmpTable,
};
