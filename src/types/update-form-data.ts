import { ClientImg } from "./client-img.js";
import { StaticThemes } from "./static-themes.js";
import { UpdateTags } from "./update-tags.js";
import { UpdateUsers } from "./update-users.js";

export type UpdateFormData = {
    formId: number;
    title: string;
    description: string;
    img: ClientImg;
    theme: StaticThemes;
    ownTheme?: string;
    isPublic: boolean;
    tags: UpdateTags
    users: UpdateUsers
};
