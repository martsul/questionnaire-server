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
import { Answers } from "./tables/Answers.js";

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
    onDelete: "CASCADE",
});

Users.hasMany(Likes, {
    foreignKey: "userId",
    sourceKey: "id",
});

Users.hasMany(Comments, {
    foreignKey: "userId",
    sourceKey: "id",
});

Users.hasMany(Answers, {
    foreignKey: "userId",
    sourceKey: "id",
});

Tokens.belongsTo(Users, {
    foreignKey: "userId",
    targetKey: "id",
    onDelete: "CASCADE",
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

Forms.hasMany(Answers, {
    foreignKey: "formId",
    sourceKey: "id",
});

Forms.belongsToMany(Tags, {
    through: FormTag,
    foreignKey: "formId",
    otherKey: "tagId",
    as: "Tags",
    onDelete: "CASCADE",
});

Forms.belongsToMany(Users, {
    through: FormUser,
    foreignKey: "formId",
    otherKey: "userId",
    as: "forms",
    onDelete: "CASCADE",
});

Forms.hasMany(FormUser, {
    foreignKey: "formId",
    sourceKey: "id"
})

Tags.belongsToMany(Forms, {
    through: FormTag,
    foreignKey: "tagId",
    otherKey: "formId",
    as: "Forms",
    onDelete: "CASCADE",
});

Tags.hasMany(FormTag, {
    foreignKey: "tagId",
    sourceKey: "id",
});

Themes.hasMany(Forms, {
    foreignKey: "themeId",
    sourceKey: "id",
});

Questions.belongsTo(Forms, {
    foreignKey: "formId",
    targetKey: "id",
    onDelete: "CASCADE",
});

Questions.hasMany(Answers, {
    foreignKey: "questionId",
    sourceKey: "id",
});

Likes.belongsTo(Users, {
    foreignKey: "userId",
    targetKey: "id",
});

Likes.belongsTo(Forms, {
    foreignKey: "formId",
    targetKey: "id",
    onDelete: "CASCADE",
});

Comments.belongsTo(Forms, {
    foreignKey: "formId",
    targetKey: "id",
    onDelete: "CASCADE",
});

Comments.belongsTo(Users, {
    foreignKey: "userId",
    targetKey: "id",
});

Answers.belongsTo(Users, {
    foreignKey: "userId",
    targetKey: "id",
});

Answers.belongsTo(Questions, {
    foreignKey: "questionId",
    targetKey: "id",
    onDelete: "CASCADE",
});

Answers.belongsTo(Forms, {
    foreignKey: "formId",
    targetKey: "id",
    onDelete: "CASCADE",
});

syncDatabase();

export const initAssociations = () => {
    console.log("Setting Associations...");
};
