import instance from "./Axios";

export const fcm = async (token: string): Promise<void> => {
    await instance.post<void>("fcm/token", { token : token });
}