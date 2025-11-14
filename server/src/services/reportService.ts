import { seoScraper } from "../utils/seoScraper.ts";

export class ReportService {
  async generateReport(data: Record<string, any>): Promise<string> {
    console.log("Generating report with data:", data);
    return "Report generated successfully.";
  }

  async getReports(): Promise<string[]> {
    return ["Report A", "Report B", "Report C"];
  }

  async getReportById(id: string): Promise<string> {
    return `Report details for ID: ${id}`;
  }

  async generateAioReport(url: string) {
    const summary = await seoScraper(url);
    console.log("SEO Summary:", summary);
    return summary;
  }
}

export default ReportService; // 👈 add this line
