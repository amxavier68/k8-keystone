import { Schema, model, type InferSchemaType } from "mongoose";

const ClientSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    contactEmail: { type: String, trim: true, lowercase: true },
    tags: [{ type: String, trim: true }],
    // Many clients will own multiple domains
    domains: [{ type: Schema.Types.ObjectId, ref: "Domain" }],
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

ClientSchema.index({ name: 1 }, { unique: false });

export type Client = InferSchemaType<typeof ClientSchema>;
export const ClientModel = model<Client>("Client", ClientSchema);
