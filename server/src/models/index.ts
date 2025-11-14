import { ClientModel } from "./clientModel.ts";
import { DomainModel } from "./domainModel.ts";
import { IssueCatalogModel } from "./issueCatalogModel.ts";
import { SeoAuditModel } from "./seoAuditModel.ts";
import { SeoChangeModel } from "./seoChangeModel.ts";
import { AbTestModel } from "./abTestModel.ts";

export { ClientModel, type Client } from "./clientModel.ts";
export { DomainModel, type Domain } from "./domainModel.ts";
export { IssueCatalogModel, type IssueCatalog } from "./issueCatalogModel.ts";
export { SeoAuditModel, type SeoAudit } from "./seoAuditModel.ts";
export { SeoChangeModel, type SeoChange } from "./seoChangeModel.ts";
export { AbTestModel, type AbTest } from "./abTestModel.ts";

// Optional: sync all indexes at startup
export async function syncAllIndexes() {
  await Promise.all([
    ClientModel.syncIndexes(),
    DomainModel.syncIndexes(),
    IssueCatalogModel.syncIndexes(),
    SeoAuditModel.syncIndexes(),
    SeoChangeModel.syncIndexes(),
    AbTestModel.syncIndexes(),
  ]);
}

