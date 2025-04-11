import { syncDatabase } from ".";
import { Form } from "./Form";
import { Theme } from "./Theme";
import { Token } from "./Token";
import { User } from "./User";

User.hasOne(Token, {
    foreignKey: "userId",
    sourceKey: "id",
});

User.hasMany(Form, {
    foreignKey: "ownerId",
    sourceKey: "id",
});

Token.belongsTo(User, {
    foreignKey: "userId",
    targetKey: "id",
});

Theme.hasMany(Form, {
    foreignKey: "themeId",
    sourceKey: "id",
});

Form.belongsTo(Theme, {
    foreignKey: "themeId",
    targetKey: "id",
});

Form.belongsTo(User, {
    foreignKey: "ownerId",
    targetKey: "id",
});

syncDatabase();

export const initAssociations = () => {
    console.log("Setting Associations...");
};
