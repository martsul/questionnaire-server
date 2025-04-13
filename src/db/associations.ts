import { syncDatabase } from "./index.js";
import { Form } from "./Form.js";
import { FormTag } from "./Form-Tag.js";
import { FormUser } from "./Form-User.js";
import { Tag } from "./Tag.js";
import { Theme } from "./Theme.js";
import { Token } from "./Token.js";
import { User } from "./User.js";

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
    as: "owner",
});

Form.belongsToMany(Tag, {
    through: FormTag,
    foreignKey: "formId",
    otherKey: "tagId",
    as: "tags",
});

Tag.belongsToMany(Form, {
    through: FormTag,
    foreignKey: "tagId",
    otherKey: "formId",
});

Form.belongsToMany(User, {
    through: FormUser,
    foreignKey: "formId",
    otherKey: "userId",
    as: "users",
});

User.belongsToMany(Form, {
    through: FormUser,
    foreignKey: "userId",
    otherKey: "formId",
    as: "forms",
});

syncDatabase();

export const initAssociations = () => {
    console.log("Setting Associations...");
};
