import type { Member } from "@/types/member";
import instance from "./Axios";

export const getMember = async (gen: string): Promise<Member[]> => {
    const response = await instance.get<Member[]>("/main/members", {
        params: {
            generation: gen === "전체" ? null : Number(gen.replace("기", ""))
        }
    });
    return response.data;
}