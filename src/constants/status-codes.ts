export const statusCodes = new Map<unknown, number>([
    ["User Is Blocked", 403],
    ["User Not Founded", 404],
    ["Unauthorized", 401],
    ["invalid token", 401],
    ["jwt expired", 401],
    ["jwt malformed", 401],
    ["Rights Error", 403],
    ["SF Auth Error", 400],
    ["Api Time Error", 429],
]);
