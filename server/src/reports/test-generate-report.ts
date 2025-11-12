import fs from "fs";

import { ReportService } from "../services/reportService.ts";

(async () => {
  const reportService = new ReportService();

  const report = {
    domain: "kollabor8.net.au",
    score: 87,
    generatedAt: new Date(),
    issues: [
      { pillar: "Technical", description: "Unminified JS detected", severity: "medium" },
      { pillar: "Content", description: "Low text-HTML ratio on homepage", severity: "high" },
      { pillar: "Authority", description: "Missing structured data markup", severity: "high" },
      { pillar: "UX", description: "Mobile layout shifts detected", severity: "low" },
      { pillar: "AI Readiness", description: "No llms.txt found", severity: "medium" }
    ]
  };

  const pdfBuffer = await reportService.generateReport(report);
  fs.writeFileSync("test-audit-report.pdf", pdfBuffer);
  console.log("✅ Report generated: test-audit-report.pdf");
})();
