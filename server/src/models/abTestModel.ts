import { Schema, model, type InferSchemaType } from "mongoose";

const VariantRefSchema = new Schema(
  {
    label: { type: String, required: true }, // e.g., "Control", "New Title"
    audit: { type: Schema.Types.ObjectId, ref: "SeoAudit", required: true },
  },
  { _id: false }
);

const AbTestSchema = new Schema(
  {
    domain: { type: Schema.Types.ObjectId, ref: "Domain", required: true, index: true },
    url: { type: String, required: true, index: true },
    metric: {
      type: String,
      enum: ["contentDepth", "structure", "technical", "accessibility", "wordCount", "internalLinks", "externalLinks"],
      required: true,
      index: true,
    },
    variantA: { type: VariantRefSchema, required: true },
    variantB: { type: VariantRefSchema, required: true },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
    winner: { type: String, enum: ["A", "B", "none"] },
    notes: { type: String },
  },
  { timestamps: true }
);

AbTestSchema.index({ domain: 1, url: 1, startedAt: -1 });

export type AbTest = InferSchemaType<typeof AbTestSchema>;
export const AbTestModel = model<AbTest>("AbTest", AbTestSchema);
