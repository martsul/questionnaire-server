type User = { id: number; name: string; email: string };

export type UpdateUsers = {
    addUsers: Record<number, User>;
    deleteUsers: Record<number, User>;
};
