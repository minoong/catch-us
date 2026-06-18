import type { Meta, StoryObj } from "@storybook/react-vite";

import BlobCursor from "./BlobCursor";

const meta = {
  title: "React Bits/Blob Cursor",
  component: BlobCursor,
  parameters: {
    layout: "centered",
  },
  args: {
    fillColor: "#5227FF",
    innerColor: "rgba(255,255,255,0.85)",
    shadowColor: "rgba(82,39,255,0.35)",
    trailCount: 3,
    useFilter: true,
  },
  argTypes: {
    blobType: {
      control: "inline-radio",
      options: ["circle", "square"],
    },
    fillColor: {
      control: "color",
    },
    innerColor: {
      control: "color",
    },
    shadowColor: {
      control: "color",
    },
    trailCount: {
      control: { type: "range", min: 1, max: 6, step: 1 },
    },
    useFilter: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof BlobCursor>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground = {
  render: (args) => (
    <div className="bg-background relative h-[480px] w-[720px] overflow-hidden rounded-xl border">
      <BlobCursor {...args} />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center">
        <p className="text-muted-foreground text-sm font-medium">
          Move your pointer inside this panel
        </p>
        <h2 className="max-w-md text-3xl font-semibold tracking-tight">
          Blob Cursor
        </h2>
        <p className="text-muted-foreground max-w-md text-sm">
          React Bits cursor animation installed through the shadcn registry.
        </p>
      </div>
    </div>
  ),
} satisfies Story;

export const Square = {
  args: {
    blobType: "square",
    fillColor: "#0f172a",
    innerColor: "rgba(255,255,255,0.9)",
    shadowColor: "rgba(15,23,42,0.35)",
    useFilter: false,
  },
  render: (args) => (
    <div className="bg-muted relative h-[420px] w-[680px] overflow-hidden rounded-xl border">
      <BlobCursor {...args} />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-8 text-center">
        <p className="text-muted-foreground max-w-sm text-sm font-medium">
          Square variant without the SVG goo filter.
        </p>
      </div>
    </div>
  ),
} satisfies Story;
