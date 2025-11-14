import { Schema, model, type InferSchemaType } from "mongoose";

const HeadingsSchema = new Schema(
  {
    h1: [{ type: String }],
    h2: [{ type: String }],
    h3: [{ type: String }],
  },
  { _id: false }
);

const LinksSchema = new Schema(
  {
    internal: { type: Number, default: 0, min: 0 },
    external: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const IssueFindingSchema = new Schema(
  {
    issueCode: { type: String, required: true, index: true },
    severity: { type: String, enum: ["low", "medium", "high", "critical"], required: true },
    message: { type: String }, // contextual detail (e.g., which tag missing)
  },
  { _id: false }
);

const FetchMetaSchema = new Schema(
  {
    statusCode: { type: Number },
    responseTimeMs: { type: Number },
    usedHttpFallback: { type: Boolean, default: false },
    error: { type: String }, // network/axios errors
  },
  { _id: false }
);

const SeoAuditSchema = new Schema(
  {
    domain: { type: Schema.Types.ObjectId, ref: "Domain", required: true, index: true },
    url: { type: String, required: true, index: true },

    // Fetch/network info
    fetch: FetchMetaSchema,

    // Parsed content
    title: { type: String },
    metaDescription: { type: String },
    metaRobots: { type: String },
    canonical: { type: String },
    headings: HeadingsSchema,
    wordCount: { type: Number, default: 0, min: 0 },
    images: {
      count: { type: Number, default: 0, min: 0 },
      missingAlt: { type: Number, default: 0, min: 0 },
    },
    links: LinksSchema,
    structuredDataTypes: [{ type: String }], // e.g., "Organization", "LocalBusiness"

    // Issues present in this snapshot
    issues: [IssueFindingSchema],

    // Quick scoring snapshot (extensible)
    scores: {
      contentDepth: { type: Number, min: 0, max: 100, default: 0 },
      structure: { type: Number, min: 0, max: 100, default: 0 },
      technical: { type: Number, min: 0, max: 100, default: 0 },
      accessibility: { type: Number, min: 0, max: 100, default: 0 },
    },

    // Content hash to detect change between snapshots
    contentHash: { type: String, index: true },

    // For human-readable summaries in reports
    summary: { type: String },
    status: { type: String, enum: ["success", "warning", "error"], default: "success", index: true },
    runAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

// Helpful compound indexes for history & diffing
SeoAuditSchema.index({ domain: 1, url: 1, runAt: -1 });
SeoAuditSchema.index({ domain: 1, contentHash: 1 });

export type SeoAudit = InferSchemaType<typeof SeoAuditSchema>;
export const SeoAuditModel = model<SeoAudit>("SeoAudit", SeoAuditSchema);
