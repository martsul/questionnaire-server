import { syncDatabase } from "./index.js";
import { Forms } from "./tables/Forms.js";
import { FormTag } from "./tables/Form-Tag.js";
import { FormUser } from "./tables/Form-User.js";
import { Tags } from "./tables/Tags.js";
import { Themes } from "./tables/Themes.js";
import { Tokens } from "./tables/Tokens.js";
import { Users } from "./tables/Users.js";
import { Questions } from "./tables/Questions.js";
import { Likes } from "./tables/Likes.js";
import { Comments } from "./tables/Comments.js";

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

Users.hasMany(Comments, {
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

Forms.hasMany(Comments, {
    foreignKey: "formId",
    sourceKey: "id",
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

Comments.belongsTo(Forms, {
    foreignKey: "formId",
    targetKey: "id",
});

Comments.belongsTo(Users, {
    foreignKey: "userId",
    targetKey: "id",
});

syncDatabase();

export const initAssociations = () => {
    console.log("Setting Associations...");
};
