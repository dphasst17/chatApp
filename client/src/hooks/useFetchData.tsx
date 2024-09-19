import { getToken } from "@/utils/cookie";
import { useEffect, useState } from "react";

export const useFetch = (handle: any, key?: any, token?: boolean) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const t = token ? await getToken() : null;
                let convertHandle = null;

                if (token && key) {
                    convertHandle = handle(t, key);
                } else if (token) {
                    convertHandle = handle(t);
                } else if (key) {
                    convertHandle = handle(key);
                } else {
                    convertHandle = handle();
                }

                const resData = await convertHandle;
                setData(resData.data);
            } catch (err: any) {
                setError(err);
            }
        };
        fetchData();
    }, []);

    return { data, error };
};
