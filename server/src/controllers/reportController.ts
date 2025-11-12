import type { Request, Response, NextFunction } from "express";
import ReportService from "../services/reportService.ts"; // 👈 default import

const reportService = new ReportService();

export const createReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    console.log("Creating report:", data);

    const result = await reportService.generateReport(data);
    res.status(201).json({ message: "Report created successfully", result });
  } catch (error) {
    next(error);
  }
};

export const getAllReports = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const reports = await reportService.getReports();
    res.status(200).json(reports);
  } catch (error) {
    next(error);
  }
};

export const getReportById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const report = await reportService.getReportById(id);
    res.status(200).json({ report });
  } catch (error) {
    next(error);
  }
};
