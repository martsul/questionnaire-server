import { syncDatabase } from ".";
import { Form } from "./Form";
import { FormTag } from "./Form-Tag";
import { FormUser } from "./Form-User";
import { Tag } from "./Tag";
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
