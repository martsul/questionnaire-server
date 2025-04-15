import { syncDatabase } from "./index.js";
import { Forms } from "./Forms.js";
import { FormTag } from "./Form-Tag.js";
import { FormUser } from "./Form-User.js";
import { Tags } from "./Tags.js";
import { Themes } from "./Themes.js";
import { Tokens } from "./Tokens.js";
import { Users } from "./Users.js";
import { Questions } from "./Questions.js";
import { Likes } from "./Likes.js";

Users.hasOne(Tokens, {
    foreignKey: "userId",
    sourceKey: "id",
});

Users.hasMany(Forms, {
    foreignKey: "ownerId",
    sourceKey: "id",
});

Users.belongsToMany(Forms, {
    through: FormUser,
    foreignKey: "userId",
    otherKey: "formId",
    as: "forms",
});

Users.hasMany(Likes, {
    foreignKey: "userId",
    sourceKey: "id",
});

Tokens.belongsTo(Users, {
    foreignKey: "userId",
    targetKey: "id",
});

Forms.hasMany(Likes, {
    foreignKey: "formId",
    sourceKey: "id",
});

Forms.belongsTo(Themes, {
    foreignKey: "themeId",
    targetKey: "id",
});

Forms.belongsTo(Users, {
    foreignKey: "ownerId",
    targetKey: "id",
    as: "owner",
});

Forms.hasMany(Questions, {
    foreignKey: "formId",
    sourceKey: "id",
});

Forms.belongsToMany(Tags, {
    through: FormTag,
    foreignKey: "formId",
    otherKey: "tagId",
    as: "tags",
});

Forms.belongsToMany(Users, {
    through: FormUser,
    foreignKey: "formId",
    otherKey: "userId",
    as: "users",
});


Tags.belongsToMany(Forms, {
    through: FormTag,
    foreignKey: "tagId",
    otherKey: "formId",
});

Themes.hasMany(Forms, {
    foreignKey: "themeId",
    sourceKey: "id",
});

Questions.belongsTo(Forms, {
    foreignKey: "formId",
    targetKey: "id",
});

Likes.belongsTo(Users, {
    foreignKey: "userId",
    targetKey: "id",
});

Likes.belongsTo(Forms, {
    foreignKey: "formId",
    targetKey: "id",
});

syncDatabase();

export const initAssociations = () => {
    console.log("Setting Associations...");
};
