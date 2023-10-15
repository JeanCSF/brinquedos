import axios, { AxiosResponse } from "axios";

export const api = axios.create({
    baseURL: "http://localhost:8080/toys",
});

export interface ApiResponse {
    userName: string;
    userImg: string;
    isAdm: string;
    token: string;
}

export const createSession = async (userName: string, password: string): Promise<AxiosResponse<ApiResponse>> => {
    return api.post('/login', { userName, password });
};
