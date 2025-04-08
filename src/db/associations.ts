import { syncDatabase } from ".";
import { Token } from "./Token";
import { User } from "./User";

User.hasOne(Token, {
    foreignKey: "userId",
    sourceKey: "id",
});

Token.belongsTo(User, {
    foreignKey: "userId",
    targetKey: "id",
});

syncDatabase();

export const initAssociations = () => {
    console.log("Setting Associations...");
};
