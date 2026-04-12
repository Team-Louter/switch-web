import instance from "./axios";

export const fcm = async (token: string): Promise<void> => {
    await instance.post<void>("fcm/token", { token : token });
}