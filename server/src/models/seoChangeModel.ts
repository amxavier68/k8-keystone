import { Schema, model, type InferSchemaType } from "mongoose";

const DeltaSchema = new Schema(
  {
    field: { type: String, required: true }, // e.g., "title", "metaDescription", "wordCount", "headings.h2.length"
    from: { type: Schema.Types.Mixed },
    to: { type: Schema.Types.Mixed },
  },
  { _id: false }
);

const SeoChangeSchema = new Schema(
  {
    domain: { type: Schema.Types.ObjectId, ref: "Domain", required: true, index: true },
    url: { type: String, required: true, index: true },
    baselineAudit: { type: Schema.Types.ObjectId, ref: "SeoAudit", required: true },
    variantAudit: { type: Schema.Types.ObjectId, ref: "SeoAudit", required: true },
    deltas: [DeltaSchema],
    notes: { type: String },
    computedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

SeoChangeSchema.index({ domain: 1, url: 1, computedAt: -1 });

export type SeoChange = InferSchemaType<typeof SeoChangeSchema>;
export const SeoChangeModel = model<SeoChange>("SeoChange", SeoChangeSchema);
