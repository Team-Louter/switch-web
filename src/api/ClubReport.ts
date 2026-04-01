import instance from "./Axios";

export interface ClubReportRequest {
  scheduleIds: number[];
  month: number;
  weekNumber: number;
}

export interface ClubReportResponse {
  clubReportId: number;
  scheduleIds: number[];
  scheduleTitles: string[];
  month: number;
  weekNumber: number;
  activityContent: string;
  createdAt: string;
}

export const getClubReports = async (): Promise<ClubReportResponse[]> => {
  const response = await instance.get<ClubReportResponse[]>("/club-report");
  return response.data;
};

export const createClubReport = async (
  body: ClubReportRequest,
): Promise<ClubReportResponse> => {
  const response = await instance.post<ClubReportResponse>("/club-report", body);
  return response.data;
};

export const getClubReport = async (
  clubReportId: number,
): Promise<ClubReportResponse> => {
  const response = await instance.get<ClubReportResponse>(
    `/club-report/${clubReportId}`,
  );
  return response.data;
};

export const regenerateClubReport = async (
  clubReportId: number,
): Promise<ClubReportResponse> => {
  const response = await instance.post<ClubReportResponse>(
    `/club-report/${clubReportId}/regenerate`,
  );
  return response.data;
};
