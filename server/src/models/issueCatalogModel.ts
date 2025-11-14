import { Schema, model, type InferSchemaType } from "mongoose";

const IssueCatalogSchema = new Schema(
  {
    issueCode: { type: String, required: true, unique: true, index: true }, // e.g., "META_DESCRIPTION_MISSING"
    category: {
      type: String,
      enum: ["technical", "content", "structure", "accessibility", "linking", "performance"],
      required: true,
      index: true,
    },
    description: { type: String, required: true },
    severity: { type: String, enum: ["low", "medium", "high", "critical"], required: true, index: true },
    detectionHint: { type: String }, // how we detect it (human-readable)
    resolution: {
      summary: { type: String, required: true },
      steps: [{ type: String }],
      examples: [{ type: String }], // code/text examples
    },
    impactScores: {
      seo: { type: Number, min: 0, max: 10, default: 5 },
      ux: { type: Number, min: 0, max: 10, default: 5 },
      conversion: { type: Number, min: 0, max: 10, default: 5 },
    },
    effort: { type: String, enum: ["low", "medium", "high"], default: "low" },
    automationPotential: { type: Boolean, default: false },
    references: [{ type: String }], // helpful links (our docs, Google docs, etc.)
  },
  { timestamps: true }
);

IssueCatalogSchema.index({ category: 1, severity: 1 });

export type IssueCatalog = InferSchemaType<typeof IssueCatalogSchema>;
export const IssueCatalogModel = model<IssueCatalog>("IssueCatalog", IssueCatalogSchema);
