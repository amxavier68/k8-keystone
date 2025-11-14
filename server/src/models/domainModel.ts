import { Schema, model, type InferSchemaType } from "mongoose";

const DomainSchema = new Schema(
  {
    client: { type: Schema.Types.ObjectId, ref: "Client", required: true, index: true },
    hostname: { type: String, required: true, trim: true, lowercase: true, index: true },
    isVerified: { type: Boolean, default: false },
    sitemapUrl: { type: String, trim: true },
    robotsTxtUrl: { type: String, trim: true },
    lastAuditAt: { type: Date },
    status: {
      type: String,
      enum: ["active", "paused", "archived"],
      default: "active",
      index: true,
    },
    // Optional metadata we might parse/store over time
    techStack: [{ type: String }], // e.g., "WordPress", "Webflow"
    nicheHints: [{ type: String }], // inferred niche labels
  },
  { timestamps: true }
);

DomainSchema.index({ client: 1, hostname: 1 }, { unique: true });

export type Domain = InferSchemaType<typeof DomainSchema>;
export const DomainModel = model<Domain>("Domain", DomainSchema);
