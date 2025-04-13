import { ClientImg } from "./client-img";
import { StaticThemes } from "./static-themes";
import { UpdateTags } from "./update-tags";
import { UpdateUsers } from "./update-users";

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
