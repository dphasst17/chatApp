import { create } from "zustand";

interface User {
    fullName: string;
    setFullName: (name: string) => void;
}

const roomUser = create<User>((set) => ({
    fullName: "",
    setFullName: (name: string) => set({ fullName: name }),
}));

export default roomUser;