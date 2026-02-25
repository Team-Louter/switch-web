import type { MyPost } from "@/types/post";
import instance from "./Axios";
import type { User } from "@/types/user"

export const getUser = async (): Promise<User> => {
    const response = await instance.get<User>("/me");
    return response.data;
}

export const getMyPost = async (): Promise<MyPost> => {
    const response = await instance.get<MyPost>("/me/posts");
    return response.data;
}